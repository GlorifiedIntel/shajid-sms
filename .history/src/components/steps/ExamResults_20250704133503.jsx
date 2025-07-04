'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStep } from '@/context/FormContext'; // ✅ Correct hook name
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { examSubjects } from '@/constants/subjects'; // ✅ Make sure this file exists
import styles from './ExamResults.module.css';

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
  const { updateData, back, next } = useFormStep(); // ✅ Use FormContext
  const { data: session } = useSession();
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      sitting1: { subjects: Array(5).fill({ subject: '', grade: '' }) },
      sitting2: { subjects: Array(5).fill({ subject: '', grade: '' }) },
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

  const gradeOptions = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'];

  const onSubmit = async (formValues) => {
    updateData(formValues); // ✅ Save in context

    await fetch('/api/apply/step-4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session?.user?.id,
        data: formValues,
      }),
    });

    next(); 
    router.push('/apply/step-5-program-details'); // optional: if using routing for steps
  };

  const goBack = () => {
    back(); 
    router.push('/apply/step-3-schools-attended');
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

      <label>Exam Year</label>
      <input type="text" {...register('sitting1.examYear')} className={styles.input} />

      <label>Exam Number</label>
      <input type="text" {...register('sitting1.examNumber')} className={styles.input} />

      {subjects1.map((field, index) => (
        <div key={field.id} className={styles.subjectRow}>
          <label>Subject {index + 1}</label>
          <select {...register(`sitting1.subjects.${index}.subject`)} className={styles.input}>
            <option value="">Select</option>
            {examSubjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select {...register(`sitting1.subjects.${index}.grade`)} className={styles.input}>
            <option value="">Grade</option>
            {gradeOptions.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {index >= 5 && (
            <button type="button" onClick={() => remove1(index)} className={styles.removeBtn}>Remove</button>
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
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select {...register(`sitting2.subjects.${index}.grade`)} className={styles.input}>
            <option value="">Grade</option>
            {gradeOptions.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <button type="button" onClick={() => remove2(index)} className={styles.removeBtn}>Remove</button>
        </div>
      ))}

      <button type="button" onClick={() => append2({ subject: '', grade: '' })} className={styles.addBtn}>
        Add Subject
      </button>

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