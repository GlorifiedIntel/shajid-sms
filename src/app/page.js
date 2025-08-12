'use client';

import Image from "next/image";
import Link from "next/link"; 
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';
import WhenToApply from "@/components/WhenToApply";
import ApplicationSteps from "@/components/ApplicationSteps";

export default function Home() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleApplyNow = () => {
    setShowModal(true); // open modal
  };

  const handleRedirect = (path) => {
    setShowModal(false); // close modal
    router.push(path); // redirect
  };

  return (
    <>
      <section className={styles.mainSection}>
        <div className={styles.imageContainer}>
          <Image src="/nurse-3.png" alt="Students talking" width={427} height={640} />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>
            SIMPLE <br />
            <strong>APPLICATION PROCESS</strong>
          </h2>
          <p>Everything you need to know about the application process.</p>

          <button onClick={handleApplyNow} className={`${styles.applyButton} ${styles.large}`}>
            Apply Now
          </button>
          </div>
      </section>

      <section className={styles.secondarySection}>
        <WhenToApply />
        <ApplicationSteps />
      </section>

      <div className={styles.chatButton}>💬 Live Chat</div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Do you already have an account?</h3>
            <div className={styles.modalButtons}>
              <button onClick={() => handleRedirect('/auth/sign-in')} className={styles.modalButton}>
                Yes, Sign In
              </button>
              <button onClick={() => handleRedirect('/create-account')} className={styles.modalButtonAlt}>
                No, Create Account
              </button>
            </div>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>✖</button>
          </div>
        </div>
      )}
    </>
  );
}