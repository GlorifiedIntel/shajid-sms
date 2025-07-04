'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStep } from '@/context/FormContext';
import { useEffect } from 'react';
import styles from './SchoolsAttended.module.css';

const schema = z.object({
  primarySchool: z.string().min(1, 'Primary School name is required'),
  secondarySchool: z.string().min(1, 'Secondary School name is required'),
  otherInstitutions: z.string().optional(),
});

export default function SchoolsAttended() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStep();

  // Load from localStorage if available
  const savedFormData = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('schoolsAttended') || 'null')
    : null;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: savedFormData || formData.schoolsAttended || {
      primarySchool: '',
      secondarySchool: '',
      otherInstitutions: '',
    },
  });

  // Save on every input change
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem('schoolsAttended', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Reset form if context data changes (optional)
  useEffect(() => {
    if (formData.schoolsAttended) {
      reset(formData.schoolsAttended);
    }
  }, [formData.schoolsAttended, reset]);

  const onSubmit = (data) => {
    updateFormData({ schoolsAttended: data });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <label>Primary School Attended</label>
      <input {...register('primarySchool')} className={styles.input} />
      {errors.primarySchool && <p className={styles.error}>{errors.primarySchool.message}</p>}

      <label>Secondary School Attended</label>
      <input {...register('secondarySchool')} className={styles.input} />
      {errors.secondarySchool && <p className={styles.error}>{errors.secondarySchool.message}</p>}

      <label>Other Institutions (if any)</label>
      <textarea {...register('otherInstitutions')} className={styles.input} />

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