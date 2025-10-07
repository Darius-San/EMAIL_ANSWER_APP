export interface NormalizedEmail {
  id: string;
  subject: string;
  from: string;
  to: string[];
  date?: string;
  snippet?: string;
  bodyPlain?: string;
  bodyHtml?: string;
  inReplyTo?: string;
  references?: string[];
  provider: 'imap' | 'outlook' | 'thunderbird';
}

export interface FetchEmailsParams {
  limit?: number;
  since?: Date;
}

export interface IEmailProvider {
  init(): Promise<void>;
  list(params?: FetchEmailsParams): Promise<NormalizedEmail[]>;
  get(id: string): Promise<NormalizedEmail | null>;
  sendReply(originalId: string, body: string): Promise<{ id: string }>;
  dispose?(): Promise<void>;
}

export type ProviderId = 'imap' | 'outlook' | 'thunderbird';
