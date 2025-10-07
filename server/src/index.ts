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

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4410;
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
