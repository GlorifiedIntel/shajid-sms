'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStep } from '@/context/FormContext';
import { useSession } from 'next-auth/react';
import { examSubjects } from '@/constants/subjects';
import styles from './ExamResults.module.css';

const subjectSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  grade: z.string().min(1, 'Grade is required'),
});

const sittingSchema = z.object({
  examType: z.string().min(1, 'Exam type is required'),
  examYear: z.string().min(4, 'Enter a valid exam year'),
  examNumber: z.string().min(5, 'Enter a valid exam number'),
  subjects: z.array(subjectSchema).min(5, 'At least 5 subjects are required'),
});

const schema = z
  .object({
    sitting1: sittingSchema,
    sitting2: z
      .object({
        examType: z.string(),
        examYear: z.string(),
        examNumber: z.string(),
        subjects: z.array(subjectSchema),
      })
      .optional()
      .refine(
        (s) =>
          !s ||
          (s.examType || s.examYear || s.examNumber || (s.subjects && s.subjects.length > 0))
            ? s.examType &&
              s.examYear &&
              s.examNumber &&
              s.subjects.length >= 5 &&
              s.subjects.every((sub) => sub.subject && sub.grade)
            : true,
        { message: 'Please complete all Sitting 2 fields or leave it entirely empty.' }
      ),
  });

export default function ExamResults() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStep();
  const { data: session } = useSession();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData.examResults || {
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
        subjects: [],
      },
    },
  });

  const sitting2Values = watch('sitting2');

  const isSecondSittingFilled = (s2) => {
    if (!s2) return false;
    const { examType, examYear, examNumber, subjects } = s2;
    return (
      examType.trim() ||
      examYear.trim() ||
      examNumber.trim() ||
      (subjects && subjects.some((sub) => sub.subject || sub.grade))
    );
  };

  const { fields: subjects1, append: append1, remove: remove1 } = useFieldArray({
    control,
    name: 'sitting1.subjects',
  });

  const { fields: subjects2, append: append2, remove: remove2 } = useFieldArray({
    control,
    name: 'sitting2.subjects',
  });

  const gradeOptions = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'];

  const onSubmit = async (values) => {
    updateFormData({ examResults: values });

    try {
      await fetch('/api/apply/step-4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          data: values,
        }),
      });
    } catch (err) {
      console.error('Error saving exam results:', err);
    }

    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <h2 className={styles.heading}>Step 4: Exam Results</h2>
      <p className={styles.subtext}>Enter your WAEC/NECO/NABTEB exam details below.</p>

      {/* === TABLE PREVIEW REMOVED FROM HERE === */}

      <h3>Sitting 1 (Required)</h3>

      <div className={styles.field}>
        <label>Exam Type</label>
        <select {...register('sitting1.examType')} className={styles.input}>
          <option value="">Select</option>
          <option value="WAEC">WAEC</option>
          <option value="NECO">NECO</option>
          <option value="NABTEB">NABTEB</option>
        </select>
        {errors?.sitting1?.examType && (
          <p className={styles.error}>{errors.sitting1.examType.message}</p>
        )}
      </div>

      <div className={styles.field}>
        <label>Exam Year</label>
        <input type="text" {...register('sitting1.examYear')} className={styles.input} />
        {errors?.sitting1?.examYear && (
          <p className={styles.error}>{errors.sitting1.examYear.message}</p>
        )}
      </div>

      <div className={styles.field}>
        <label>Exam Number</label>
        <input type="text" {...register('sitting1.examNumber')} className={styles.input} />
        {errors?.sitting1?.examNumber && (
          <p className={styles.error}>{errors.sitting1.examNumber.message}</p>
        )}
      </div>

      {subjects1.map((_, index) => (
        <div key={index} className={styles.subjectRow}>
          <select {...register(`sitting1.subjects.${index}.subject`)} className={styles.input}>
            <option value="">Subject</option>
            {examSubjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
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
            <button
              type="button"
              onClick={() => remove1(index)}
              className={styles.removeBtn}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => append1({ subject: '', grade: '' })}
        className={styles.addBtn}
      >
        Add Subject
      </button>

      {isSecondSittingFilled(sitting2Values) && (
        <>
          <hr className={styles.divider} />
          <h3>Sitting 2 (Optional)</h3>

          <div className={styles.field}>
            <label>Exam Type</label>
            <select {...register('sitting2.examType')} className={styles.input}>
              <option value="">Select</option>
              <option value="WAEC">WAEC</option>
              <option value="NECO">NECO</option>
              <option value="NABTEB">NABTEB</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Exam Year</label>
            <input type="text" {...register('sitting2.examYear')} className={styles.input} />
          </div>

          <div className={styles.field}>
            <label>Exam Number</label>
            <input type="text" {...register('sitting2.examNumber')} className={styles.input} />
          </div>

          {subjects2.map((_, index) => (
            <div key={index} className={styles.subjectRow}>
              <select {...register(`sitting2.subjects.${index}.subject`)} className={styles.input}>
                <option value="">Subject</option>
                {examSubjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
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

              <button
                type="button"
                onClick={() => remove2(index)}
                className={styles.removeBtn}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append2({ subject: '', grade: '' })}
            className={styles.addBtn}
          >
            Add Subject
          </button>
        </>
      )}

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