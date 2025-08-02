'use client';

import { useEffect, useState } from 'react';
import styles from './Overview.module.css';

export default function OverviewPage() {
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    const fetchChecklist = async () => {
      const res = await fetch('/api/checklist');
      const data = await res.json();
      setChecklist(data);
    };
    fetchChecklist();
  }, []);

  const handleToggle = async (id, completed) => {
    const res = await fetch(`/api/checklist/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    const updated = await res.json();
    setChecklist(prev =>
      prev.map(item => (item._id === updated._id ? updated : item))
    );
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>Application Overview</h1>

      {/* Status Card */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Current Application Status</h2>
        <p className={`${styles.status} ${styles.inReview}`}>In Review</p>
      </div>

      {/* Interactive Checklist */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Application Checklist</h2>
        <ul className={styles.checklist}>
          {checklist.map(item => (
            <li key={item._id}>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggle(item._id, item.completed)}
              />
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Profile Summary */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Profile Summary</h2>
        <div className={styles.profile}>
          <p><strong>Full Name:</strong> Shajid A. Musa</p>
          <p><strong>Email:</strong> shajid@example.com</p>
          <p><strong>Phone:</strong> +234-800-123-4567</p>
          <p><strong>Academic History:</strong> B.Sc in Computer Science, GPA: 3.7</p>
          <p><strong>Test Scores:</strong> WAEC: 6 Credits, UTME: 280</p>
        </div>
      </div>
    </section>
  );
}
