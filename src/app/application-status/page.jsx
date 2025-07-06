'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import styles from './ApplicationStatus.module.css';
import toast from 'react-hot-toast';
import { generateStyledPDF } from '@/utils/generateStyledPDF';
import download from 'downloadjs';

export default function ApplicationStatusPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.id) {
      fetch(`/api/apply/status?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          setApplication(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [session, status, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!application) return toast.error('No application data found');
    toast.loading('Generating PDF...', { id: 'pdf-download' });

    try {
      const pdfBytes = await generateStyledPDF(application.allData);
      download(pdfBytes, 'application-status.pdf', 'application/pdf');
      toast.success('PDF downloaded!', { id: 'pdf-download' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PDF', { id: 'pdf-download' });
    }
  };

  if (loading) return <p className={styles.loading}>Loading application status...</p>;

  if (!application) {
    return (
      <DashboardLayout>
        <div className={styles.card}>
          <h2 className={styles.heading}>Application Not Found</h2>
          <p>You haven’t started or submitted an application yet.</p>
          <button onClick={() => router.push('/apply/step-1-personal-info')} className={styles.button}>
            Start Application
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.card}>
        <h2 className={styles.heading}>Your Application Status</h2>
        <p className={styles.text}><strong>Full Name:</strong> {application?.allData?.personalInfo?.fullName || 'N/A'}</p>
        <p className={styles.text}><strong>Program:</strong> {application?.allData?.programDetails?.program || 'N/A'}</p>
        <p className={styles.text}><strong>Submitted:</strong> {application?.submitted ? '✅ Yes' : '❌ No'}</p>
        <p className={styles.text}><strong>Payment Status:</strong> {application?.paymentStatus || 'Pending'}</p>

        {application?.submitted ? (
          <p className={styles.success}>🎉 Your application has been submitted!</p>
        ) : (
          <button onClick={() => router.push('/apply/step-7-review')} className={styles.button}>
            Complete Application
          </button>
        )}

        <div className={styles.actions}>
          <button onClick={handlePrint} className={styles.buttonOutline}>
            🖨️ Print
          </button>
          <button onClick={handleDownloadPDF} className={styles.button}>
            📥 Download PDF
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}