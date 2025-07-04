// src/components/layouts/DashboardLayout.jsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Shajid Portal</h2>
        <nav className={styles.nav}>
          <button onClick={() => router.push('/dashboard')}>🏠 Dashboard</button>
          <button onClick={() => router.push('/apply/step-1-personal-info')}>📝 Start Application</button>
          <button onClick={() => router.push('/application-status')}>📄 Application Status</button>
          <button onClick={() => router.push('/auth/signout')}>🚪 Sign Out</button>
        </nav>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}