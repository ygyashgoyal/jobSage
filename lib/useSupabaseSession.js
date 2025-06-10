'use client';

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useRouter } from 'next/navigation';

export default function useSupabaseSession() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login');
      } else {
        setSession(data.session);
      }
    };
    checkSession();
  }, [router]);

  return [session, setSession];
}
