import { useProfileStore } from './profileStore';

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
