// components/steps/HealthInfo.jsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormContext } from '@/context/MultiStepContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './HealthInfo.module.css';

const schema = z.object({
  chronicIllness: z.string().min(1, 'Please describe or enter "None"'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  genotype: z.string().min(1, 'Genotype is required'),
  emergencyContact: z.string().min(1, 'Emergency contact is required'),
});

export default function HealthInfo() {
  const { formData, setFormData } = useFormContext();
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData.healthInfo || {},
  });

  const onSubmit = async (values) => {
    setFormData((prev) => ({
      ...prev,
      healthInfo: values,
    }));

    await fetch('/api/apply/step-2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session?.user?.id,
        data: values,
      }),
    });

    router.push('/apply/step-3-schools-attended');
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

      <button type="submit" className={styles.button}>Next</button>
    </form>
  );
}