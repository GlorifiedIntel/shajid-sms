'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStep } from '@/context/FormContext';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import styles from './SchoolsAttended.module.css';

const schoolPeriodSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  from: z.string().min(4, 'From year is required'),
  to: z.string().min(4, 'To year is required'),
}).refine((data) => parseInt(data.to) >= parseInt(data.from), {
  message: 'To year must be equal or after From year',
  path: ['to'],
});

const schema = z.object({
  primarySchool: schoolPeriodSchema,
  secondarySchool: schoolPeriodSchema,
  otherInstitutions: z.string().optional(),
});

export default function SchoolsAttended() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStep();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData.schoolsAttended || {
      primarySchool: { name: '', from: '', to: '' },
      secondarySchool: { name: '', from: '', to: '' },
      otherInstitutions: '',
    },
  });

  useEffect(() => {
    if (formData.schoolsAttended) {
      reset(formData.schoolsAttended);
    }
  }, [formData, reset]);

  const onSubmit = async (data) => {
    updateFormData({ schoolsAttended: data });

    try {
      await fetch('/api/apply/step-3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          data,
        }),
      });
    } catch (err) {
      console.error('Error saving school info:', err);
    }

    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <h2 className={styles.heading}>Step 3: Schools Attended</h2>
      <p className={styles.subtext}>
        Provide details of your educational background.
      </p>

      {/* === Primary School === */}
      <div className={styles.fieldGroup}>
        <label>Primary School Attended</label>
        <div className={styles.row}>
          <input
            {...register('primarySchool.name')}
            className={styles.input}
            placeholder="School Name"
          />
          <input
            {...register('primarySchool.from')}
            className={styles.input}
            placeholder="From Year"
          />
          <input
            {...register('primarySchool.to')}
            className={styles.input}
            placeholder="To Year"
          />
        </div>
        {errors?.primarySchool?.name && <p className={styles.error}>{errors.primarySchool.name.message}</p>}
        {errors?.primarySchool?.from && <p className={styles.error}>{errors.primarySchool.from.message}</p>}
        {errors?.primarySchool?.to && <p className={styles.error}>{errors.primarySchool.to.message}</p>}
      </div>

      {/* === Secondary School === */}
      <div className={styles.fieldGroup}>
        <label>Secondary School Attended</label>
        <div className={styles.row}>
          <input
            {...register('secondarySchool.name')}
            className={styles.input}
            placeholder="School Name"
          />
          <input
            {...register('secondarySchool.from')}
            className={styles.input}
            placeholder="From Year"
          />
          <input
            {...register('secondarySchool.to')}
            className={styles.input}
            placeholder="To Year"
          />
        </div>
        {errors?.secondarySchool?.name && <p className={styles.error}>{errors.secondarySchool.name.message}</p>}
        {errors?.secondarySchool?.from && <p className={styles.error}>{errors.secondarySchool.from.message}</p>}
        {errors?.secondarySchool?.to && <p className={styles.error}>{errors.secondarySchool.to.message}</p>}
      </div>

      {/* === Other Institutions === */}
      <div className={styles.field}>
        <label>Other Institutions (if any)</label>
        <textarea {...register('otherInstitutions')} className={styles.input} />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={prevStep} className={styles.backButton}>
          Back
        </button>
        <button type="submit" className={styles.button}>
          Save and Continue
        </button>
      </div>
    </form>
  );
}