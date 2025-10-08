import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProfileProvider = 'imap' | 'outlook' | 'thunderbird';

export interface Profile {
  id: string;
  name: string;
  userName: string;
  email: string;
  provider: ProfileProvider;
  createdAt: string;
  imapHost?: string;
  imapUser?: string;
  imapPort?: number;
  imapSecure?: boolean; // default true
  imapConfigured?: boolean; // set true when user completed setup wizard
  imapPassword?: string; // optional persisted only if user explicitly chooses (security risk)
}

interface ProfileState {
  profiles: Profile[];
  activeId: string | null;
  addProfile: (data: Partial<Pick<Profile,'name'|'userName'|'email'|'provider'|'imapHost'|'imapUser'|'imapPort'|'imapSecure'|'imapConfigured'|'imapPassword'>>) => Profile;
  removeProfile: (id: string) => void;
  deleteProfile?: (id: string) => void; // alias for removeProfile for semantic clarity in UI
  setActive: (id: string) => void;
  renameProfile: (id: string, name: string) => void;
  updateProfile: (id: string, data: Partial<Omit<Profile,'id'|'createdAt'>>) => void;
}

function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

export const useProfileStore = create<ProfileState>()(persist((set, get) => ({
  profiles: [],
  activeId: null,
  addProfile: (data) => {
    const p: Profile = {
      id: uuid(),
      name: data.name || `Profil ${get().profiles.length + 1}`,
      userName: data.userName || 'Unbenannt',
      email: data.email || '',
      provider: data.provider || 'imap',
      createdAt: new Date().toISOString(),
      imapHost: data.imapHost,
      imapUser: data.imapUser,
      imapPort: data.imapPort,
      imapSecure: (typeof data.imapSecure === 'boolean') ? data.imapSecure : true,
      imapConfigured: !!data.imapConfigured,
      imapPassword: data.imapPassword // only if user opted in (UI control)
    };
    set(state => ({ profiles: [...state.profiles, p], activeId: p.id }));
    return p;
  },
  removeProfile: (id) => set(state => ({
    profiles: state.profiles.filter(p => p.id !== id),
    activeId: state.activeId === id ? (state.profiles.filter(p => p.id !== id)[0]?.id || null) : state.activeId
  })),
  // Provide alias
  deleteProfile: (id) => set(state => ({
    profiles: state.profiles.filter(p => p.id !== id),
    activeId: state.activeId === id ? (state.profiles.filter(p => p.id !== id)[0]?.id || null) : state.activeId
  })),
  setActive: (id) => set({ activeId: id }),
  renameProfile: (id, name) => set(state => ({ profiles: state.profiles.map(p => p.id === id ? { ...p, name } : p) })),
  updateProfile: (id, data) => set(state => ({ profiles: state.profiles.map(p => p.id === id ? { ...p, ...data } : p) }))
}), { name: 'email-responder-profiles',
  migrate: (persisted: any) => {
    if (!persisted) return persisted;
    if (persisted.profiles && persisted.profiles.length && !('userName' in persisted.profiles[0])) {
      persisted.profiles = persisted.profiles.map((p: any) => ({
        ...p,
        userName: 'Unbenannt',
        email: '',
        provider: 'imap'
      }));
    }
    // ensure new optional imap override fields exist (no destructive change)
    if (persisted.profiles) {
      persisted.profiles = persisted.profiles.map((p: any) => ({
        ...p,
        imapHost: p.imapHost,
        imapUser: p.imapUser,
        imapPort: p.imapPort ?? 993,
        imapSecure: (typeof p.imapSecure === 'boolean') ? p.imapSecure : true,
        imapConfigured: p.imapConfigured || false,
        imapPassword: p.imapPassword // do not modify; if absent keep absent
      }));
    }
    return persisted;
  }
}));
