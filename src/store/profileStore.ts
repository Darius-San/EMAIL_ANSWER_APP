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
}

interface ProfileState {
  profiles: Profile[];
  activeId: string | null;
  addProfile: (data: Partial<Pick<Profile,'name'|'userName'|'email'|'provider'>>) => Profile;
  removeProfile: (id: string) => void;
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
      createdAt: new Date().toISOString()
    };
    set(state => ({ profiles: [...state.profiles, p], activeId: p.id }));
    return p;
  },
  removeProfile: (id) => set(state => ({
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
    return persisted;
  }
}));
