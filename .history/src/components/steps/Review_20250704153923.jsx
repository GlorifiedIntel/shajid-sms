'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStep } from '@/context/FormContext';
import { generateStyledPDF } from '@/utils/generateStyledPDF';
import download from 'downloadjs';
import toast from 'react-hot-toast';
import styles from './Review.module.css';

export default function Step7Review() {
  const { data: session } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedDate, setSubmittedDate] = useState(null);

  const { formData } = useFormStep();

  const handleFinalSubmit = async () => {
    const confirmSubmit = window.confirm(
      'Are you sure you want to submit? You will not be able to make changes afterward.'
    );
    if (!confirmSubmit) return;

    if (!formData) {
      toast.error('No data to submit');
      return;
    }

    setSubmitting(true);
    toast.loading('Submitting application...', { id: 'submit-toast' });

    try {
      const res = await fetch('/api/apply/final-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          data: formData,
        }),
      });

      if (!res.ok) throw new Error('Submission failed');

      // Optional: if your API returns createdAt timestamp
      const result = await res.json();
      const submittedAt = result.createdAt
        ? new Date(result.createdAt).toLocaleString()
        : new Date().toLocaleString();

      setSubmitted(true);
      setSubmittedDate(submittedAt);

      toast.success('Application submitted successfully!', { id: 'submit-toast' });
      // You can optionally navigate to success page here:
      // router.push('/apply/success');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong submitting your application.', { id: 'submit-toast' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!formData) {
      toast.error('No data to generate PDF');
      return;
    }
    setPreviewing(true);
    toast.loading('Generating PDF...', { id: 'pdf-toast' });

    try {
      const pdfBytes = await generateStyledPDF(formData);
      download(pdfBytes, 'shajid-application.pdf', 'application/pdf');
      toast.success('PDF downloaded!', { id: 'pdf-toast' });
    } catch (err) {
      console.error(err);
      toast.error('Error generating PDF.', { id: 'pdf-toast' });
    } finally {
      setPreviewing(false);
    }
  };

  return (
    <div className={styles.reviewContainer}>
      <h2 className={styles.heading}>Review Your Application</h2>

      <pre className={styles.previewBox}>{JSON.stringify(formData, null, 2)}</pre>

      <button
        onClick={handleDownloadPDF}
        disabled={previewing || submitting || submitted}
        className={styles.downloadBtn}
      >
        {previewing ? <span className={styles.spinner} /> : 'Download PDF Preview'}
      </button>

      <br />
      <br />

      {!submitted && (
        <button
          onClick={handleFinalSubmit}
          disabled={submitting || previewing}
          className={styles.submitBtn}
        >
          {submitting ? <span className={styles.spinner} /> : 'Submit Final Application'}
        </button>
      )}

      {submitted && submittedDate && (
        <p className={styles.submittedMessage}>
          ✅ Application submitted on: <strong>{submittedDate}</strong>
        </p>
      )}
    </div>
  );
}