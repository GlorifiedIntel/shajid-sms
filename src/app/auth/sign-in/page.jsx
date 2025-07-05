'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './signIn.module.css';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
      callbackUrl: '/dashboard',
    });

    if (res?.ok) {
      router.push(res.url || '/dashboard');
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.logoWrapper}>
          <Image src="/logo2.png" alt="Logo" width={80} height={80} className={styles.logo} />
        </div>

        <h1 className={styles.title}>Sign In</h1>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputGroup}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <p className={styles.forgotPassword}>
          <Link href="/auth/forgot-password" className={styles.link}>Forgot Password?</Link>
        </p>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className={styles.signUpText}>
          Don’t have an account? <Link href="/create-account" className={styles.link}>Create one</Link>
        </p>
      </form>
    </div>
  );
}