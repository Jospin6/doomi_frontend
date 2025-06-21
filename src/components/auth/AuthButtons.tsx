'use client';

import { useSession, signOut } from 'next-auth/react';
import { useAuthModalStore } from '@/stores/useAuthModalStore';
import { Button } from '@/components/ui/button';

export function AuthButtons() {
  const { data: session } = useSession();
  const { openLogin, openRegister } = useAuthModalStore();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>Welcome, {session.user?.name}</p>
        <Button onClick={() => signOut()}>Logout</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button onClick={openLogin}>Login</Button>
      <Button variant="secondary" onClick={openRegister}>
        Register
      </Button>
    </div>
  );
}
