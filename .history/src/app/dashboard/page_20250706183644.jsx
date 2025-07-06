import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from './dashboard.module.css';
import {
  FaFileAlt,
  FaMoneyCheckAlt,
  FaClipboardCheck,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import { authOptions } from '@/lib/auth'; // adjust this import path to where you define your NextAuth options

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/sign-in');
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
          <form
            action="/api/auth/signout"
            method="post"
            className={styles.logoutForm}
          >
            <button type="submit" className={styles.logoutButton}>
              <FaSignOutAlt className={styles.icon} />
              Log out
            </button>
          </form>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <h1>Welcome, {session.user.name || 'User'}!</h1>
        <p>Select an option from the sidebar to get started.</p>
      </main>
    </div>
  );
}