import { create } from 'zustand';

export type EmailProvider = 'imap' | 'outlook' | 'thunderbird';

export interface EmailItem {
  id: string;
  subject: string;
  from: string;
  date?: string;
}

interface EmailState {
  provider: EmailProvider;
  emails: EmailItem[];
  setProvider: (p: EmailProvider) => void;
  setEmails: (list: EmailItem[]) => void;
}

export const useEmailStore = create<EmailState>((set) => ({
  provider: 'imap',
  emails: [],
  setProvider: (p) => set({ provider: p, emails: [] }),
  setEmails: (list) => set({ emails: list })
}));
