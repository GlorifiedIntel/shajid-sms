'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStep } from '@/context/FormContext';
import { useSession } from 'next-auth/react';
import styles from './UTMEInfo.module.css';
import { useEffect } from 'react';

const schema = z.object({
  jambRegNo: z.string().min(6, 'Enter a valid JAMB Reg Number'),
  jambScore: z
    .number({ invalid_type_error: 'JAMB score must be a number' })
    .min(0, 'Minimum score is 0')
    .max(400, 'Maximum score is 400'),
  jambSubjects: z
    .array(z.string().min(1))
    .min(4, 'Select 4 subjects')
    .max(4, 'Only 4 subjects allowed'),
});

const jambSubjectOptions = [
  'English',
  'Biology',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Economics',
  'Government',
  'Geography',
  'Literature in English',
  'Christian Religious Studies',
  'Islamic Religious Studies',
  'Agricultural Science',
  'Commerce',
];

export default function UTMEInfo() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStep();
  const { data: session } = useSession();

  // Load saved data from localStorage if present
  const savedFormData = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('utmeInfo') || 'null')
    : null;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: savedFormData || formData.utmeInfo || {
      jambRegNo: '',
      jambScore: '',
      jambSubjects: [],
    },
  });

  const selectedSubjects = watch('jambSubjects', []);

  // Save form data to localStorage on every change
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem('utmeInfo', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Reset form if context data changes
  useEffect(() => {
    if (formData.utmeInfo) {
      reset(formData.utmeInfo);
    }
  }, [formData.utmeInfo, reset]);

  const onSubmit = async (formValues) => {
    updateFormData({ utmeInfo: formValues });

    try {
      await fetch('/api/apply/step-6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          data: formValues,
        }),
      });
    } catch (err) {
      console.error('Error saving UTME info:', err);
    }

    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <label>JAMB Registration Number</label>
      <input {...register('jambRegNo')} className={styles.input} />
      {errors.jambRegNo && <p className={styles.error}>{errors.jambRegNo.message}</p>}

      <label>JAMB Total Score</label>
      <input
        type="number"
        {...register('jambScore', { valueAsNumber: true })}
        className={styles.input}
      />
      {errors.jambScore && <p className={styles.error}>{errors.jambScore.message}</p>}

      <label>JAMB Subject Combination (Select 4)</label>
      <div className={styles.checkboxGrid}>
        {jambSubjectOptions.map((subj) => (
          <label key={subj} className={styles.checkboxItem}>
            <input
              type="checkbox"
              value={subj}
              {...register('jambSubjects')}
              disabled={
                !selectedSubjects.includes(subj) && selectedSubjects.length >= 4
              }
            />
            {subj}
          </label>
        ))}
      </div>
      {errors.jambSubjects && (
        <p className={styles.error}>{errors.jambSubjects.message}</p>
      )}

      <div className={styles.actions}>
        <button type="button" onClick={prevStep} className={styles.backButton}>
          Back
        </button>
        <button type="submit" className={styles.button}>
          Next
        </button>
      </div>
    </form>
  );
}