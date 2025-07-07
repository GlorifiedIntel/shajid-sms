'use client';

import { useEffect, useState } from 'react';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div>
      <h1>Admin Analytics</h1>
      <ul>
        <li>Total Users: {stats.totalUsers}</li>
        <li>Active Users: {stats.activeUsers}</li>
        <li>Admin Users: {stats.adminUsers}</li>
        <li>Total Applications Submitted: {stats.totalApplications}</li>
      </ul>
    </div>
  );
}
