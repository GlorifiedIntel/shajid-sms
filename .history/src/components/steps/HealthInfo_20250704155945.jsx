'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStep } from '@/context/FormContext';
import styles from './HealthInfo.module.css';
import { useEffect } from 'react';

const schema = z.object({
  chronicIllness: z.string().min(1, 'Please describe or enter "None"'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  genotype: z.string().min(1, 'Genotype is required'),
  emergencyContact: z.string().min(1, 'Emergency contact is required'),
});

export default function HealthInfo() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStep();

  // Load saved data from localStorage if any
  const savedFormData = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('healthInfo') || 'null')
    : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: savedFormData || formData.healthInfo || {
      chronicIllness: '',
      bloodGroup: '',
      genotype: '',
      emergencyContact: '',
    },
  });

  // Save form data to localStorage on changes
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem('healthInfo', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Reset form if context data changes (optional)
  useEffect(() => {
    if (formData.healthInfo) {
      reset(formData.healthInfo);
    }
  }, [formData.healthInfo, reset]);

  const onSubmit = async (values) => {
    updateFormData({ healthInfo: values });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label>Do you have any chronic illness?</label>
        <input {...register('chronicIllness')} className={styles.input} />
        {errors.chronicIllness && <p className={styles.error}>{errors.chronicIllness.message}</p>}
      </div>

      <div className={styles.field}>
        <label>Blood Group</label>
        <select {...register('bloodGroup')} className={styles.input}>
          <option value="">Select...</option>
          <option value="A+">A+</option>
          <option value="A−">A−</option>
          <option value="B+">B+</option>
          <option value="B−">B−</option>
          <option value="AB+">AB+</option>
          <option value="AB−">AB−</option>
          <option value="O+">O+</option>
          <option value="O−">O−</option>
        </select>
        {errors.bloodGroup && <p className={styles.error}>{errors.bloodGroup.message}</p>}
      </div>

      <div className={styles.field}>
        <label>Genotype</label>
        <select {...register('genotype')} className={styles.input}>
          <option value="">Select...</option>
          <option value="AA">AA</option>
          <option value="AS">AS</option>
          <option value="SS">SS</option>
          <option value="AC">AC</option>
          <option value="SC">SC</option>
        </select>
        {errors.genotype && <p className={styles.error}>{errors.genotype.message}</p>}
      </div>

      <div className={styles.field}>
        <label>Emergency Contact Number</label>
        <input {...register('emergencyContact')} className={styles.input} />
        {errors.emergencyContact && <p className={styles.error}>{errors.emergencyContact.message}</p>}
      </div>

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