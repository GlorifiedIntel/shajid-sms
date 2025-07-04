// app/dashboard/page.jsx
'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className={styles.card}>
        <h1 className={styles.heading}>Welcome to Your Dashboard</h1>
        <p className={styles.subtext}>Use the menu to start or check your application.</p>
      </div>
    </DashboardLayout>
  );
}