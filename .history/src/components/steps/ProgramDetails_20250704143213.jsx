'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStep } from '@/context/FormContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './ProgramDetails.module.css';

const schema = z.object({
  program: z.string().min(1, 'Select your preferred program'),
  mode: z.string().min(1, 'Choose full-time or part-time'),
  campus: z.string().min(1, 'Choose a campus'),
});

const programs = [
  'Basic Midwifery',
  'Community Midwifery',
  'Post Basic Nursing',
  'Mental Health Nursing',
];

const campuses = [
  'Main Campus',
  'Satellite Campus 1',
  'Satellite Campus 2',
];

export default function ProgramDetails() {
  const { formData, updateData, back, next } = useFormStep();
  const { data: session } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData.programDetails || {
      program: '',
      mode: '',
      campus: '',
    },
  });

  const onSubmit = async (formValues) => {
    updateData({ programDetails: formValues });

    await fetch('/api/apply/step-5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session?.user?.id,
        data: formValues,
      }),
    });

    next();
    router.push('/apply/step-6-utme');
  };

  const goBack = () => {
    back();
    router.push('/apply/step-4-exam-results');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <label>Program of Choice</label>
      <select {...register('program')} className={styles.input}>
        <option value="">Select a program</option>
        {programs.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      {errors.program && <p className={styles.error}>{errors.program.message}</p>}

      <label>Mode of Study</label>
      <select {...register('mode')} className={styles.input}>
        <option value="">Select mode</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
      </select>
      {errors.mode && <p className={styles.error}>{errors.mode.message}</p>}

      <label>Preferred Campus</label>
      <select {...register('campus')} className={styles.input}>
        <option value="">Select campus</option>
        {campuses.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {errors.campus && <p className={styles.error}>{errors.campus.message}</p>}

      <div className={styles.actions}>
        <button type="button" onClick={goBack} className={styles.backButton}>
          Back
        </button>
        <button type="submit" className={styles.button}>
          Next
        </button>
      </div>
    </form>
  );
}