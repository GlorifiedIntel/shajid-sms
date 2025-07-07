'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session.user.role === 'admin') {
      fetch('/api/admin/applications')
        .then((res) => res.json())
        .then((data) => {
          setApplications(data);
          setLoading(false);
        });
    }
  }, [session, status]);

  if (status === 'loading' || loading) return <p>Loading...</p>;

  if (status === 'unauthenticated' || session.user.role !== 'admin') {
    return <p>Access denied</p>;
  }

  function updateStatus(id, newStatus) {
    fetch(`/api/admin/applications/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setApplications((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status: updated.status } : app))
        );
      });
  }

  return (
    <div className={styles.adminDashboard}>
      <h1>Admin Dashboard</h1>
      <h2>Submitted Applications</h2>
      <ul className={styles.applicationList}>
        {applications.length === 0 && <li className={styles.noApplications}>No applications found.</li>}
        {applications.map((app) => (
          <li key={app._id} className={styles.applicationItem}>
            <div className={styles.applicationHeader}>
              {app.personalInfo?.fullName || 'Unnamed Applicant'}
            </div>
            <div className={styles.applicationStatus}>Status: {app.status}</div>
            <div className={styles.submittedDate}>
              Submitted: {new Date(app.submittedAt).toLocaleString()}
            </div>
            <div className={styles.actionButtons}>
              <button
                className={`${styles.button} ${styles.buttonApprove}`}
                onClick={() => updateStatus(app._id, 'approved')}
              >
                Approve
              </button>
              <button
                className={`${styles.button} ${styles.buttonReject}`}
                onClick={() => updateStatus(app._id, 'rejected')}
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}