import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

export class ImapProvider {
  private client: ImapFlow | null = null;

  async init() {
    this.client = new ImapFlow({
      host: process.env.IMAP_HOST,
      port: process.env.IMAP_PORT ? parseInt(process.env.IMAP_PORT, 10) : 993,
      secure: true,
      auth: {
        user: process.env.IMAP_USER,
        pass: process.env.IMAP_PASSWORD
      }
    });
    await this.client.connect();
  }

  async list(limit = 10) {
    if (!this.client) throw new Error('IMAP not initialized');
    const lock = await this.client.getMailboxLock('INBOX');
    const results: any[] = [];
    try {
      let fetched = 0;
      for await (const msg of this.client.fetch({ seen: false }, { envelope: true, bodyStructure: true, source: true })) {
        fetched++;
        if (msg.source) {
          const parsed = await simpleParser(msg.source);
          results.push({
            id: msg.uid?.toString() || Math.random().toString(36).slice(2),
            subject: parsed.subject || '(kein Betreff)',
            from: parsed.from?.text || '',
            to: parsed.to ? parsed.to.value.map(v => v.address || '') : [],
            date: parsed.date?.toISOString(),
            snippet: parsed.text?.slice(0, 140),
            provider: 'imap'
          });
        }
        if (fetched >= limit) break;
      }
    } finally {
      lock.release();
    }
    return results;
  }
}
