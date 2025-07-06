'use client';

import { useState } from 'react';
import styles from './forgotPassword.module.css';
import Image from 'next/image';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    setMessage(data.message || data.error);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Image src="/logo2.png" alt="Logo" width={80} height={80} className={styles.logo} />
        <h1 className={styles.heading}>Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {message && <p className={styles.message}>{message}</p>}
        <p className={styles.signInText}>
  Remember your password? <Link href="/auth/sign-in" className={styles.link}>Sign In</Link>
</p>
      </form>
    </div>
  );
}