import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ImapProvider } from './providers/imapProvider.js';
import { OutlookProvider } from './providers/outlookProvider.js';
import { ThunderbirdProvider } from './providers/thunderbirdProvider.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Placeholder route for fetching emails (to be implemented per provider)
const imap = new ImapProvider();
const outlook = new OutlookProvider();
const thunderbird = new ThunderbirdProvider();

let initialized = false;
async function ensureInit() {
  if (initialized) return;
  try {
    await imap.init();
  } catch (e) {
    console.warn('IMAP init failed (maybe credentials missing)', (e as Error).message);
  }
  initialized = true;
}

app.get('/api/emails', async (req, res) => {
  const provider = (req.query.provider as string) || 'imap';
  await ensureInit();
  try {
    if (provider === 'imap') {
      const list = await imap.list(10);
      return res.json({ emails: list });
    }
    if (provider === 'outlook') {
      return res.json({ emails: await outlook.list() });
    }
    if (provider === 'thunderbird') {
      return res.json({ emails: await thunderbird.list() });
    }
    res.status(400).json({ error: 'Unknown provider' });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// Dynamic IMAP listing with provided credentials (not persisted server-side)
app.post('/api/imap/list', async (req, res) => {
  const { host, port, secure, user, pass, limit, mailbox } = req.body || {};
  // Basic validation
  const errors: string[] = [];
  if (!host || typeof host !== 'string') errors.push('host erforderlich');
  const finalPort = typeof port === 'number' ? port : (typeof port === 'string' ? parseInt(port, 10) : 993);
  if (!user || typeof user !== 'string') errors.push('user erforderlich');
  if (!pass || typeof pass !== 'string') errors.push('pass erforderlich');
  if (finalPort <= 0 || finalPort > 65535) errors.push('port ungültig');
  const lim = typeof limit === 'number' ? limit : 10;
  if (errors.length) {
    return res.status(400).json({ error: 'Validation', details: errors });
  }
  // Lazy import to avoid bundling if unused
  let ImapFlow: any; let simpleParser: any;
  try {
    ({ ImapFlow } = await import('imapflow'));
    ({ simpleParser } = await import('mailparser'));
  } catch (e) {
    return res.status(500).json({ error: 'Server dependency error', details: (e as Error).message });
  }
  const client = new ImapFlow({
    host,
    port: finalPort,
    secure: secure === false ? false : true, // default true
    auth: { user, pass }
  });
  try {
    await client.connect();
    const targetMailbox = (mailbox && typeof mailbox === 'string') ? mailbox : 'INBOX';
    const lock = await client.getMailboxLock(targetMailbox);
    const results: any[] = [];
    try {
      let fetched = 0;
      for await (const msg of client.fetch({ seen: false }, { envelope: true, bodyStructure: true, source: true })) {
        fetched++;
        if (msg.source) {
          const parsed = await simpleParser(msg.source);
          results.push({
            id: msg.uid?.toString() || Math.random().toString(36).slice(2),
            subject: parsed.subject || '(kein Betreff)',
            from: parsed.from?.text || '',
            to: parsed.to ? parsed.to.value.map((v: any) => v.address || '') : [],
            date: parsed.date?.toISOString(),
            snippet: parsed.text?.slice(0, 140),
            provider: 'imap'
          });
        }
        if (fetched >= lim) break;
      }
    } finally {
      lock.release();
    }
    res.json({ emails: results });
  } catch (e: any) {
    let status = 500;
    const msg = e?.message || 'Unbekannter Fehler';
    if (/auth|login|credentials/i.test(msg)) status = 401;
    res.status(status).json({ error: msg });
  } finally {
    try { await client.logout(); } catch { /* ignore */ }
  }
});

const basePort = process.env.PORT ? parseInt(process.env.PORT, 10) : 4410;
const maxAttempts = 5;

function start(port: number, attempt = 1) {
  const server = app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
    if (port !== basePort) {
      console.warn(`Started on fallback port (requested ${basePort}). Update client API base if necessary.`);
    }
  });
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      if (attempt < maxAttempts) {
        const next = port + 1;
        console.warn(`Port ${port} in use. Retrying on ${next} (attempt ${attempt + 1}/${maxAttempts})...`);
        start(next, attempt + 1);
      } else {
        console.error(`Failed to bind after ${maxAttempts} attempts. Exiting.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

start(basePort);
