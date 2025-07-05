'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {session.user.name}</h1>
      <p className={styles.subtext}>Email: {session.user.email}</p>
	    <p className={styles.subtext}>Use the menu to start or check your application.</p>
      <button
        onClick={() => signOut({ callbackUrl: '/auth/signin' })}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#e53935',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
}