'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateStyledPDF } from '@/utils/generateStyledPDF';
import download from 'downloadjs';
import styles from './ApplicationStatus.module.css';

export default function ApplicationStatusPage() {
  const { data: session } = useSession();
  const [application, setApplication] = useState(null);
  const [submittedDate, setSubmittedDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.email) return;
      const res = await fetch(`/api/apply/get?email=${session.user.email}`);
      const data = await res.json();
      setApplication(data);

      if (data?.submittedAt) {
        setSubmittedDate(new Date(data.submittedAt).toLocaleString());
      }
    }

    fetchData();
  }, [session]);

  const handlePrintPDF = async () => {
    if (!application) return;
    setIsGenerating(true);

    try {
      const blob = await generateStyledPDF(application);
      const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.onload = () => iframe.contentWindow?.print();
    } catch (err) {
      console.error('Print failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!application) return;
    setIsGenerating(true);

    try {
      const blob = await generateStyledPDF(application);
      download(blob, 'submitted-application.pdf', 'application/pdf');
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!application) {
    return <p className={styles.loading}>Loading application...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📄 Application Status</h2>

      <div className={styles.statusCard}>
        <p className={styles.statusLabel}>Status:</p>
        <p className={application.submitted ? styles.submitted : styles.inProgress}>
          {application.submitted ? '✅ Submitted' : '📝 In Progress'}
        </p>
        {submittedDate && (
          <p className={styles.submittedDate}>📅 Submitted on: {submittedDate}</p>
        )}
        {application.reviewStatus && (
          <p className={styles.reviewStatus}>
            🗂️ Admin Review: <strong>{application.reviewStatus}</strong>
          </p>
        )}
      </div>

      <div className={styles.actions}>
        <button onClick={() => router.push('/apply')} className={styles.editButton}>
          {application.submitted ? 'View Application' : 'Continue Editing'}
        </button>
        <button onClick={handlePrintPDF} className={styles.printButton} disabled={isGenerating}>
          🖨️ Print
        </button>
        <button
          onClick={handleDownloadPDF}
          className={styles.downloadButton}
          disabled={isGenerating}
        >
          ⬇️ Download PDF
        </button>
      </div>

      <div className={styles.progressContainer}>
        <p>Application Progress</p>
        <div className={styles.progressBar}>
          {Array.from({ length: 7 }).map((_, idx) => {
            const stepNum = idx + 1;
            const isComplete = stepNum <= application.step;
            return (
              <div
                key={stepNum}
                className={`${styles.step} ${isComplete ? styles.stepComplete : ''}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {stepNum}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}