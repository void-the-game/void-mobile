import { useState, useEffect } from 'react';
import { storage } from '@/services/storage';
import { apiDev } from '@/services/api';

export interface UsePlayerProfileReturn {
  myId: string | null;
  myAvatar: string | undefined;
  myNickname: string;
}

export function usePlayerProfile(): UsePlayerProfileReturn {
  const [myId, setMyId] = useState<string | null>(null);
  const [myAvatar, setMyAvatar] = useState<string | undefined>(undefined);
  const [myNickname, setMyNickname] = useState('Tripulante');

  useEffect(() => {
    const load = async () => {
      const [id, token] = await Promise.all([
        storage.getUserId(),
        storage.getToken(),
      ]);
      setMyId(id);
      if (id && token) {
        try {
          const res = await apiDev.get(`/profile/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data?.profile?.avatar) setMyAvatar(res.data.profile.avatar);
          if (res.data?.profile?.nickname)
            setMyNickname(res.data.profile.nickname);
        } catch {}
      }
    };
    load();
  }, []);

  return { myId, myAvatar, myNickname };
}
