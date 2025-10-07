import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Profile {
  id: string;
  name: string;
  createdAt: string;
}

interface ProfileState {
  profiles: Profile[];
  activeId: string | null;
  addProfile: (name?: string) => Profile;
  removeProfile: (id: string) => void;
  setActive: (id: string) => void;
  renameProfile: (id: string, name: string) => void;
}

function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

export const useProfileStore = create<ProfileState>()(persist((set, get) => ({
  profiles: [],
  activeId: null,
  addProfile: (name) => {
    const p: Profile = { id: uuid(), name: name || `Profil ${get().profiles.length + 1}` , createdAt: new Date().toISOString() };
    set(state => ({ profiles: [...state.profiles, p], activeId: p.id }));
    return p;
  },
  removeProfile: (id) => set(state => ({
    profiles: state.profiles.filter(p => p.id !== id),
    activeId: state.activeId === id ? (state.profiles.filter(p => p.id !== id)[0]?.id || null) : state.activeId
  })),
  setActive: (id) => set({ activeId: id }),
  renameProfile: (id, name) => set(state => ({ profiles: state.profiles.map(p => p.id === id ? { ...p, name } : p) }))
}), { name: 'email-responder-profiles' }));
