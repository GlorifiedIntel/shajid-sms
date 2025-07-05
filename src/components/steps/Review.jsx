'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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

  const { formData, prevStep } = useFormStep();

  // HYDRATION FIX: only render after client mount
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null; // or <p>Loading...</p>
  }

  const handleFinalSubmit = async () => {
    const confirmSubmit = window.confirm(
      'Are you sure you want to submit? You will not be able to make changes afterward.'
    );
    if (!confirmSubmit) return;

    if (!formData || Object.keys(formData).length === 0) {
      toast.error('No data to submit');
      console.error('Submission failed: formData is empty or undefined');
      return;
    }

    if (!session?.user?.email) {
      toast.error('User is not authenticated');
      console.error('Submission failed: session.user.email is missing');
      return;
    }

    setSubmitting(true);
    toast.loading('Submitting application...', { id: 'submit-toast' });

    try {
      console.log('Submitting application with:', {
        userId: session.user.email,
        data: formData,
      });

      const res = await fetch('/api/apply/final-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.email, // use email as userId
          data: formData,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Submission failed:', errorText);
        throw new Error('Submission failed');
      }

      const result = await res.json();

      const submittedAt = result.createdAt
        ? new Date(result.createdAt).toLocaleString()
        : new Date().toLocaleString();

      setSubmitted(true);
      setSubmittedDate(submittedAt);

      toast.success('Application submitted successfully!', { id: 'submit-toast' });
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

  const formatLabel = (label) => {
    const customLabels = {
      dob: 'Date of Birth',
      fullName: 'Full Name',
      parentName: 'Parent Name',
      parentAddress: 'Parent Address',
      bloodGroup: 'Blood Group',
      emergencyContact: 'Emergency Contact',
      chronicIllness: 'Chronic Illness',
      schoolAttended: 'School Attended',
      examType: 'Exam Type',
      examYear: 'Exam Year',
      resultUpload: 'Result Upload',
      courseChoice: 'Course Choice',
      gender: 'Gender',
      genotype: 'Genotype',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
    };

    if (customLabels[label]) return customLabels[label];

    const spaced = label.replace(/([a-z])([A-Z])/g, '$1 $2');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  const renderSectionTable = (sectionTitle, dataObject) => {
    if (sectionTitle === 'schoolsAttended') {
      return (
        <div key={sectionTitle} className={styles.section}>
          <h3 className={styles.sectionHeading}>Schools Attended</h3>
          <table className={styles.reviewTable}>
            <thead>
              <tr>
                <th>Level</th>
                <th>School Name</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Primary</td>
                <td>{dataObject.primarySchool?.name || '-'}</td>
                <td>{dataObject.primarySchool?.from || '-'}</td>
                <td>{dataObject.primarySchool?.to || '-'}</td>
              </tr>
              <tr>
                <td>Secondary</td>
                <td>{dataObject.secondarySchool?.name || '-'}</td>
                <td>{dataObject.secondarySchool?.from || '-'}</td>
                <td>{dataObject.secondarySchool?.to || '-'}</td>
              </tr>
              {dataObject.otherInstitutions && (
                <tr>
                  <td colSpan="1">Other Institutions</td>
                  <td colSpan="3">{dataObject.otherInstitutions}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div key={sectionTitle} className={styles.section}>
        <h3 className={styles.sectionHeading}>{formatLabel(sectionTitle)}</h3>
        <table className={styles.reviewTable}>
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(dataObject).map(([key, value]) => (
              <tr key={key}>
                <td className={styles.tableKey}>{formatLabel(key)}</td>
                <td className={styles.tableValue}>
                  {Array.isArray(value)
                    ? value.join(', ')
                    : typeof value === 'object' && value !== null
                    ? JSON.stringify(value)
                    : value?.toString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderExamResultsTable = (examResults) => {
    if (!examResults) return null;

    return (
      <div className={styles.section}>
        <h3 className={styles.sectionHeading}>Exam Results</h3>

        {['sitting1', 'sitting2'].map((sittingKey) => {
          const sitting = examResults[sittingKey];
          if (!sitting || !sitting.examType) return null;

          return (
            <div key={sittingKey} className={styles.subSection}>
              <h4>
                {sittingKey === 'sitting1' ? 'Sitting 1' : 'Sitting 2'} — {sitting.examType} ({sitting.examYear})
              </h4>
              <p><strong>Exam Number:</strong> {sitting.examNumber}</p>
              <table className={styles.reviewTable}>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {sitting.subjects.map((subj, index) => (
                    <tr key={index}>
                      <td>{subj.subject || '-'}</td>
                      <td>{subj.grade || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.reviewContainer}>
      <h2 className={styles.heading}>Review Your Application</h2>

      {/* Passport Photo */}
      {formData.personalInfo?.photo && (
        <div className={styles.section}>
          <h3 className={styles.sectionHeading}>Passport Photo</h3>
          <div className={styles.passportPhotoContainer}>
            <img
              src={formData.personalInfo.photo}
              alt="Passport"
              loading="lazy"
              className={styles.passportPhoto}
            />
          </div>
        </div>
      )}

      {formData &&
        Object.entries(formData).map(([section, values]) =>
          section === 'examResults'
            ? renderExamResultsTable(values)
            : renderSectionTable(section, values)
        )}

      <button
        onClick={handleDownloadPDF}
        disabled={previewing || submitting || submitted}
        className={styles.downloadBtn}
      >
        {previewing ? <span className={styles.spinner} /> : 'Download PDF Preview'}
      </button>

      <br />
      <br />

      <div className={styles.actions}>
        {!submitted && (
          <button
            onClick={prevStep}
            disabled={submitting || previewing}
            className={styles.backButton}
          >
            Previous
          </button>
        )}

        {!submitted && (
          <button
            onClick={handleFinalSubmit}
            disabled={submitting || previewing}
            className={styles.submitBtn}
          >
            {submitting ? <span className={styles.spinner} /> : 'Submit Final Application'}
          </button>
        )}
      </div>

      {submitted && submittedDate && (
        <p className={styles.submittedMessage}>
          ✅ Application submitted on: <strong>{submittedDate}</strong>
        </p>
      )}
    </div>
  );
}