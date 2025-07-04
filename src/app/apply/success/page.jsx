'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';
import { useWindowSize } from '@uidotdev/usehooks';
import styles from './success.module.css';

export default function SuccessPage() {
  const router = useRouter();
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Optional: play success sound
    const audio = new Audio('/success.mp3'); // Place this file in /public
    audio.play().catch(() => {});
  }, []);

  return (
    <div className={styles.container}>
      <Confetti width={width} height={height} />

      <div className={styles.card}>
        <h1 className={styles.heading}>🎉 Application Submitted!</h1>
        <p className={styles.text}>
          Thank you for completing your application to Shajid College of Nursing and Midwifery.
        </p>

        <button onClick={() => router.push('/dashboard')} className={styles.button}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}