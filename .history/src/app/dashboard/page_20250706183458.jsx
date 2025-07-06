'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import Link from 'next/link';
import {
  FaFileAlt,
  FaMoneyCheckAlt,
  FaClipboardCheck,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') {
    router.push('/auth/sign-in');
    return null;
  }

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Dashboard</h2>
        <nav className={styles.nav}>
          <Link href="/apply" className={styles.navLink}>
            <FaFileAlt className={styles.icon} />
            Start Application
          </Link>
          <Link href="/apply/payment" className={styles.navLink}>
            <FaMoneyCheckAlt className={styles.icon} />
            Pay Application Fee
          </Link>
          <Link href="/apply/status" className={styles.navLink}>
            <FaClipboardCheck className={styles.icon} />
            Check Application Status
          </Link>
          <Link href="/dashboard/settings" className={styles.navLink}>
            <FaCog className={styles.icon} />
            Settings
          </Link>
          <button
            className={styles.logoutButton}
            onClick={() => signOut({ callbackUrl: '/auth/sign-in' })}
          >
            <FaSignOutAlt className={styles.icon} />
            Log out
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <h1>Welcome, {session?.user?.name || 'User'}!</h1>
        <p>Select an option from the sidebar to get started.</p>
      </main>
    </div>
  );
}