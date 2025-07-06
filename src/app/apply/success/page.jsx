'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';
import { useWindowSize } from '@uidotdev/usehooks';
import { generateStyledPDF } from '@/utils/generateStyledPDF';
import download from 'downloadjs';
import styles from './success.module.css';

export default function SuccessPage() {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // Play success sound
    const audio = new Audio('/success.mp3');
    audio.play().catch(() => {});

    // Load submitted data
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleDownloadPDF = async () => {
    if (!formData) return;
    try {
      const pdfBlob = await generateStyledPDF(formData);
      download(pdfBlob, 'shajid-application.pdf', 'application/pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Could not generate PDF.');
    }
  };

  const formatLabel = (label) => {
    const customLabels = {
      dob: 'Date of Birth',
      fullName: 'Full Name',
      gender: 'Gender',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      parentName: 'Parent Name',
      bloodGroup: 'Blood Group',
      emergencyContact: 'Emergency Contact',
      chronicIllness: 'Chronic Illness',
    };
    return (
      customLabels[label] ||
      label.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase())
    );
  };

  const renderSummary = () => {
    if (!formData) return null;

    return Object.entries(formData).map(([section, values]) => (
      <div key={section} className={styles.section}>
        <h3 className={styles.sectionHeading}>{formatLabel(section)}</h3>
        <table className={styles.summaryTable}>
          <tbody>
            {Object.entries(values).map(([key, val]) => (
              <tr key={key}>
                <td className={styles.label}>{formatLabel(key)}</td>
                <td className={styles.value}>
                  {Array.isArray(val)
                    ? val.join(', ')
                    : typeof val === 'object' && val !== null
                    ? JSON.stringify(val)
                    : val?.toString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      <Confetti width={width} height={height} />
      <div className={styles.card}>
        <h1 className={styles.heading}>🎉 Application Submitted!</h1>
        <p className={styles.text}>
          Thank you for completing your application to Shajid College of Nursing and Midwifery.
        </p>

        <div className={styles.buttonRow}>
          <button onClick={handleDownloadPDF} className={styles.button}>
            📄 Download PDF
          </button>
          <button onClick={() => router.push('/dashboard')} className={styles.button}>
            🏠 Go to Dashboard
          </button>
        </div>
      </div>

      <div className={styles.summaryWrapper}>{renderSummary()}</div>
    </div>
  );
}