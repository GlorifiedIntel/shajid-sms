'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStep } from '@/context/FormContext'; // ✅ use correct hook
import { generateStyledPDF } from '@/utils/generateStyledPDF';
import download from 'downloadjs';
import toast from 'react-hot-toast';
import styles from './Review.module.css';

export default function Step7Review() {
  const { data: session } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const { formData } = useFormStep(); // ✅ use correct context

  const handleFinalSubmit = async () => {
    if (!formData) return toast.error('No data to submit');
    setSubmitting(true);
    toast.loading('Submitting application...', { id: 'submit-toast' });

    try {
      const res = await fetch('/api/apply/final-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          fullForm: formData,
        }),
      });

      if (res.ok) {
        toast.success('Application submitted successfully!', { id: 'submit-toast' });
        router.push('/apply/success');
      } else {
        toast.error('Something went wrong submitting your application.', { id: 'submit-toast' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error submitting form.', { id: 'submit-toast' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!formData) return toast.error('No data to generate PDF');
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

      <pre className={styles.previewBox}>
        {JSON.stringify(formData, null, 2)}
      </pre>

      <button
        onClick={handleDownloadPDF}
        disabled={previewing}
        className={styles.downloadBtn}
      >
        {previewing ? <span className={styles.spinner} /> : 'Download PDF Preview'}
      </button>

      <br /><br />

      <button
        onClick={handleFinalSubmit}
        disabled={submitting}
        className={styles.submitBtn}
      >
        {submitting ? <span className={styles.spinner} /> : 'Submit Final Application'}
      </button>
    </div>
  );
}