'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStep } from '@/context/FormContext'; 
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './SchoolsAttended.module.css';

const schema = z.object({
  primarySchool: z.string().min(1, 'Primary School name is required'),
  secondarySchool: z.string().min(1, 'Secondary School name is required'),
  otherInstitutions: z.string().optional(),
});

export default function SchoolsAttended() {
  const { updateData } = useFormStep(); 
  const { data: session } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formValues) => {
    updateData({ schoolsAttended: formValues }); 

    await fetch('/api/apply/step-3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session?.user?.id,
        data: formValues,
      }),
    });

    router.push('/apply/step-4-exam-results');
  };

  const goBack = () => {
    router.push('/apply/step-2-health-info');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label>Primary School Attended</label>
        <input {...register('primarySchool')} className={styles.input} />
        {errors.primarySchool && (
          <p className={styles.error}>{errors.primarySchool.message}</p>
        )}
      </div>

      <div className={styles.field}>
        <label>Secondary School Attended</label>
        <input {...register('secondarySchool')} className={styles.input} />
        {errors.secondarySchool && (
          <p className={styles.error}>{errors.secondarySchool.message}</p>
        )}
      </div>

      <div className={styles.field}>
        <label>Other Institutions (if any)</label>
        <textarea {...register('otherInstitutions')} className={styles.input} />
      </div>

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