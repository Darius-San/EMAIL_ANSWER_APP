import { describe, it, expect, beforeEach } from 'vitest';
import { useProfileStore } from './profileStore';

// Reset store between tests
beforeEach(() => {
  const { profiles, activeId } = useProfileStore.getState();
  useProfileStore.setState({ profiles: [], activeId: null });
});

describe('profileStore basic', () => {
  it('adds profile and sets active', () => {
    const p = useProfileStore.getState().addProfile({ name: 'A', userName: 'u' });
    expect(useProfileStore.getState().activeId).toBe(p.id);
  });

  it('updateProfile works', () => {
    const p = useProfileStore.getState().addProfile({ name: 'A', userName: 'u' });
    useProfileStore.getState().updateProfile(p.id, { name: 'B' });
    expect(useProfileStore.getState().profiles[0].name).toBe('B');
  });

  it('gracefully handles legacy profile without provider', () => {
    // simulate persisted legacy entry lacking provider
    useProfileStore.setState({
      profiles: [
        {
          id: 'legacy1',
          name: 'Legacy',
          userName: 'legacy',
          email: '',
          provider: undefined,
          createdAt: new Date().toISOString(),
        } as any,
      ],
    });

    const p = useProfileStore.getState().profiles[0];
    expect(p.provider).toBeUndefined();
    // Access pattern used in UI fallback should not throw
    const label = (p.provider || 'imap').toUpperCase();
    expect(label).toBe('IMAP');
  });
});

describe('profileStore', () => {
  beforeEach(() => {
    // reset store state
    const { profiles, activeId } = useProfileStore.getState();
    if (profiles.length || activeId) {
      useProfileStore.setState({ profiles: [], activeId: null });
    }
  });

  it('creates a profile and sets it active', () => {
    const p = useProfileStore.getState().addProfile({ name: 'Test' });
    expect(useProfileStore.getState().profiles.length).toBe(1);
    expect(useProfileStore.getState().activeId).toBe(p.id);
  });

  it('removes a profile and updates active', () => {
    const s = useProfileStore.getState();
    const p1 = s.addProfile({ name: 'A' });
    const p2 = s.addProfile({ name: 'B' });
    expect(useProfileStore.getState().activeId).toBe(p2.id);
    s.removeProfile(p2.id);
    expect(useProfileStore.getState().profiles.length).toBe(1);
    expect(useProfileStore.getState().activeId).toBe(p1.id);
  });
});
