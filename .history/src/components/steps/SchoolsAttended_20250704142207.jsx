'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStep } from '@/context/FormContext';
import styles from './SchoolsAttended.module.css';

const schema = z.object({
  primarySchool: z.string().min(1, 'Primary School name is required'),
  secondarySchool: z.string().min(1, 'Secondary School name is required'),
  otherInstitutions: z.string().optional(),
});

export default function SchoolsAttended() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const { nextStep, prevStep, updateFormData } = useFormStep();

  const onSubmit = (data) => {
    updateFormData(data);  // save data in context
    nextStep(); // go to next step
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