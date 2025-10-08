import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DebugState {
  enabled: boolean;
  toggle: () => void;
  set: (value: boolean) => void;
}

export const useDebugStore = create<DebugState>()(persist((set, get) => ({
  enabled: false,
  toggle: () => set({ enabled: !get().enabled }),
  set: (value: boolean) => set({ enabled: value })
}), { name: 'email-responder-debug' }));
