'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './DashboardSidebar.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faFileAlt, faBell } from '@fortawesome/free-solid-svg-icons';

export default function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard/overview',
      label: 'Application Overview',
      icon: faChartLine,
    },
    {
      href: '/dashboard/documents',
      label: 'Documents & Resources',
      icon: faFileAlt,
    },
    {
      href: '/dashboard/notifications',
      label: 'Notifications',
      icon: faBell,
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Dashboard</h2>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.href} className={styles.navItem}>
            <Link
              href={item.href}
              className={`${styles.link} ${pathname === item.href ? styles.active : ''}`}
            >
              <FontAwesomeIcon icon={item.icon} style={{ marginRight: '8px' }} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}