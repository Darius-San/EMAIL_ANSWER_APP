import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore';
import { EmailList } from '../email/EmailList';

export const ProfileInboxPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const profile = useProfileStore(s => s.profiles.find(p => p.id === id));
  const setActive = useProfileStore(s => s.setActive);

  useEffect(() => {
    if (profile && profile.id) setActive(profile.id);
  }, [profile?.id]);

  if (!profile) {
    return <div className="text-sm text-gray-500 p-4">Profil nicht gefunden. <button onClick={()=>navigate('/') } className="underline text-[var(--primary)]">Zurück</button></div>;
  }
  if (profile.provider === 'imap' && !profile.imapConfigured) {
    return <div className="text-sm text-gray-600 p-4">IMAP noch nicht konfiguriert. <button onClick={()=>navigate(`/profiles/${profile.id}/setup`)} className="underline text-[var(--primary)]">Setup abschließen</button></div>;
  }
  return (
    <div className="max-w-6xl mx-auto">
  <h2 className="text-2xl font-bold mb-4">Posteingang - {profile.name}</h2>
      <EmailList limit={100} />
    </div>
  );
};
