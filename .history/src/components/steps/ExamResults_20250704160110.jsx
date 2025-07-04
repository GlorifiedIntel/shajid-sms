'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStep } from '@/context/FormContext';
import { useSession } from 'next-auth/react';
import { examSubjects } from '@/constants/subjects';
import styles from './ExamResults.module.css';
import { useEffect } from 'react';

const subjectSchema = z.object({
  subject: z.string().min(1),
  grade: z.string().min(1),
});

const sittingSchema = z.object({
  examType: z.string().min(1),
  examYear: z.string().min(4),
  examNumber: z.string().min(5),
  subjects: z.array(subjectSchema).min(5, 'At least 5 subjects required'),
});

const schema = z.object({
  sitting1: sittingSchema,
  sitting2: sittingSchema.optional(),
});

export default function ExamResults() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStep();
  const { data: session } = useSession();

  // Load saved data from localStorage if any
  const savedFormData = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('examResults') || 'null')
    : null;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: savedFormData || formData.examResults || {
      sitting1: {
        examType: '',
        examYear: '',
        examNumber: '',
        subjects: Array(5).fill({ subject: '', grade: '' }),
      },
      sitting2: {
        examType: '',
        examYear: '',
        examNumber: '',
        subjects: Array(5).fill({ subject: '', grade: '' }),
      },
    },
  });

  const { fields: subjects1, append: append1, remove: remove1 } = useFieldArray({
    control,
    name: 'sitting1.subjects',
  });

  const { fields: subjects2, append: append2, remove: remove2 } = useFieldArray({
    control,
    name: 'sitting2.subjects',
  });

  // Watch form data and save to localStorage on every change
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem('examResults', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Reset form if context formData changes
  useEffect(() => {
    if (formData.examResults) {
      reset(formData.examResults);
    }
  }, [formData.examResults, reset]);

  const gradeOptions = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'];

  const onSubmit = async (formValues) => {
    updateFormData({ examResults: formValues });

    try {
      await fetch('/api/apply/step-4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          data: formValues,
        }),
      });
    } catch (err) {
      console.error('Failed to submit step-4 data:', err);
    }

    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h3>Sitting 1</h3>

      <label>Exam Type</label>
      <select {...register('sitting1.examType')} className={styles.input}>
        <option value="">Select</option>
        <option value="WAEC">WAEC</option>
        <option value="NECO">NECO</option>
        <option value="NABTEB">NABTEB</option>
      </select>
      {errors.sitting1?.examType && <p className={styles.error}>{errors.sitting1.examType.message}</p>}

      <label>Exam Year</label>
      <input type="text" {...register('sitting1.examYear')} className={styles.input} />
      {errors.sitting1?.examYear && <p className={styles.error}>{errors.sitting1.examYear.message}</p>}

      <label>Exam Number</label>
      <input type="text" {...register('sitting1.examNumber')} className={styles.input} />
      {errors.sitting1?.examNumber && <p className={styles.error}>{errors.sitting1.examNumber.message}</p>}

      {subjects1.map((field, index) => (
        <div key={field.id} className={styles.subjectRow}>
          <label>Subject {index + 1}</label>
          <select {...register(`sitting1.subjects.${index}.subject`)} className={styles.input}>
            <option value="">Select</option>
            {examSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <select {...register(`sitting1.subjects.${index}.grade`)} className={styles.input}>
            <option value="">Grade</option>
            {gradeOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {index >= 5 && (
            <button type="button" onClick={() => remove1(index)} className={styles.removeBtn}>
              Remove
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={() => append1({ subject: '', grade: '' })} className={styles.addBtn}>
        Add Subject
      </button>

      <hr className={styles.divider} />

      <h3>Sitting 2 (Optional)</h3>

      <label>Exam Type</label>
      <select {...register('sitting2.examType')} className={styles.input}>
        <option value="">Select</option>
        <option value="WAEC">WAEC</option>
        <option value="NECO">NECO</option>
        <option value="NABTEB">NABTEB</option>
      </select>

      <label>Exam Year</label>
      <input type="text" {...register('sitting2.examYear')} className={styles.input} />

      <label>Exam Number</label>
      <input type="text" {...register('sitting2.examNumber')} className={styles.input} />

      {subjects2.map((field, index) => (
        <div key={field.id} className={styles.subjectRow}>
          <label>Subject {index + 1}</label>
          <select {...register(`sitting2.subjects.${index}.subject`)} className={styles.input}>
            <option value="">Select</option>
            {examSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <select {...register(`sitting2.subjects.${index}.grade`)} className={styles.input}>
            <option value="">Grade</option>
            {gradeOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <button type="button" onClick={() => remove2(index)} className={styles.removeBtn}>
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={() => append2({ subject: '', grade: '' })} className={styles.addBtn}>
        Add Subject
      </button>

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