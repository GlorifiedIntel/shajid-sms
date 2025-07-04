'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStep } from '@/context/FormContext';
import { generateStyledPDF } from '@/utils/generateStyledPDF';
import download from 'downloadjs';
import toast from 'react-hot-toast';
import styles from './Review.module.css';

function SectionTitle({ children }) {
  return <h3 className={styles.sectionTitle}>{children}</h3>;
}

function KeyValue({ label, value }) {
  return (
    <p>
      <strong>{label}:</strong> {value || 'N/A'}
    </p>
  );
}

// Format the nested formData into readable JSX summary
function renderSummary(formData) {
  if (!formData) return null;

  const { 
    fullName,
    gender,
    email,
    phone,
    address,
    dob,
    parentName,
    parentAddress,
  } = formData.personalInfo || {};

  const health = formData.healthInfo || {};
  const schools = formData.schoolsAttended || {};
  const examResults = formData.examResults || {};
  const programDetails = formData.programDetails || {};
  const utmeInfo = formData.utmeInfo || {};

  return (
    <>
      <SectionTitle>Personal Information</SectionTitle>
      <KeyValue label="Full Name" value={fullName} />
      <KeyValue label="Gender" value={gender} />
      <KeyValue label="Email" value={email} />
      <KeyValue label="Phone" value={phone} />
      <KeyValue label="Address" value={address} />
      <KeyValue label="Date of Birth" value={dob} />
      <KeyValue label="Parent/Guardian Name" value={parentName} />
      <KeyValue label="Parent's Contact Address" value={parentAddress} />

      <SectionTitle>Health Information</SectionTitle>
      <KeyValue label="Chronic Illness" value={health.chronicIllness} />
      <KeyValue label="Blood Group" value={health.bloodGroup} />
      <KeyValue label="Genotype" value={health.genotype} />
      <KeyValue label="Emergency Contact" value={health.emergencyContact} />

      <SectionTitle>Schools Attended</SectionTitle>
      <KeyValue label="Primary School" value={schools.primarySchool} />
      <KeyValue label="Secondary School" value={schools.secondarySchool} />
      <KeyValue label="Other Institutions" value={schools.otherInstitutions} />

      <SectionTitle>Exam Results</SectionTitle>
      {examResults.sitting1 ? (
        <>
          <p><strong>Sitting 1</strong></p>
          <KeyValue label="Exam Type" value={examResults.sitting1.examType} />
          <KeyValue label="Exam Year" value={examResults.sitting1.examYear} />
          <KeyValue label="Exam Number" value={examResults.sitting1.examNumber} />
          <p><strong>Subjects & Grades:</strong></p>
          <ul>
            {(examResults.sitting1.subjects || []).map(({ subject, grade }, i) => (
              <li key={i}>{subject || 'N/A'}: {grade || 'N/A'}</li>
            ))}
          </ul>
        </>
      ) : <p>No Sitting 1 exam results provided.</p>}

      {examResults.sitting2 && (
        <>
          <p><strong>Sitting 2</strong></p>
          <KeyValue label="Exam Type" value={examResults.sitting2.examType} />
          <KeyValue label="Exam Year" value={examResults.sitting2.examYear} />
          <KeyValue label="Exam Number" value={examResults.sitting2.examNumber} />
          <p><strong>Subjects & Grades:</strong></p>
          <ul>
            {(examResults.sitting2.subjects || []).map(({ subject, grade }, i) => (
              <li key={i}>{subject || 'N/A'}: {grade || 'N/A'}</li>
            ))}
          </ul>
        </>
      )}

      <SectionTitle>Program Details</SectionTitle>
      <KeyValue label="Program" value={programDetails.program} />
      <KeyValue label="Mode of Study" value={programDetails.mode} />
      <KeyValue label="Preferred Campus" value={programDetails.campus} />

      <SectionTitle>UTME Information</SectionTitle>
      <KeyValue label="JAMB Registration Number" value={utmeInfo.jambRegNo} />
      <KeyValue label="JAMB Score" value={utmeInfo.jambScore} />
      <p><strong>JAMB Subjects:</strong></p>
      <ul>
        {(utmeInfo.jambSubjects || []).map((subj, i) => (
          <li key={i}>{subj}</li>
        ))}
      </ul>
    </>
  );
}

export default function Step7Review() {
  const { data: session } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const { formData } = useFormStep();

  const hasData = formData && Object.keys(formData).length > 0;

  if (!hasData) {
    return (
      <div className={styles.reviewContainer}>
        <h2 className={styles.heading}>No application data found.</h2>
        <button
          onClick={() => router.push('/apply/step-1-personal-info')}
          className={styles.submitBtn}
        >
          Start Application
        </button>
      </div>
    );
  }

  const handleFinalSubmit = async () => {
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

      <div className={styles.summaryBox}>
        {renderSummary(formData)}
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => router.back()}
          className={styles.backButton}
        >
          Back
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={previewing || !hasData}
          className={styles.downloadBtn}
        >
          {previewing ? (
            <span className={styles.spinner} aria-label="Loading PDF generation" />
          ) : (
            'Download PDF Preview'
          )}
        </button>

        <button
          onClick={handleFinalSubmit}
          disabled={submitting || !hasData}
          className={styles.submitBtn}
        >
          {submitting ? (
            <span className={styles.spinner} aria-label="Submitting application" />
          ) : (
            'Submit Final Application'
          )}
        </button>
      </div>
    </div>
  );
}