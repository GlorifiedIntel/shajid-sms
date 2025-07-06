'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStep } from '@/context/FormContext';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import styles from './PersonalInfo.module.css';

const schema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  gender: z.enum(['Male', 'Female'], 'Gender is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number is required'),
  address: z.string().min(5, 'Contact address is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  parentName: z.string().min(3, 'Parent/Guardian name is required'),
  parentAddress: z.string().min(5, "Parent's contact address is required"),
  // no validation for photo because it’s optional
});

export default function PersonalInfo() {
  const { formData, updateFormData, nextStep } = useFormStep();
  const { data: session } = useSession();

  // local state for photo preview
  const [photoPreview, setPhotoPreview] = useState(formData.personalInfo?.photo || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData.personalInfo || {
      fullName: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
      dob: '',
      parentName: '',
      parentAddress: '',
      photo: '',
    },
  });

  // If formData.personalInfo.photo changes externally, update preview
  useEffect(() => {
    if (formData.personalInfo?.photo) {
      setPhotoPreview(formData.personalInfo.photo);
      setValue('photo', formData.personalInfo.photo);
    }
  }, [formData.personalInfo?.photo, setValue]);

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.toString();
      setPhotoPreview(base64String);
      // Update form value & form data context with base64 string
      setValue('photo', base64String);
      updateFormData({
        personalInfo: {
          ...formData.personalInfo,
          photo: base64String,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    updateFormData({ personalInfo: data });

    try {
      await fetch('/api/apply/step-1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          personalInfo: data,  // <-- fixed key here
        }),
      });
    } catch (error) {
      console.error('Failed to save personal info:', error);
    }

    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <h2 className={styles.heading}>Step 1: Personal Information</h2>
      <p className={styles.subtext}>Please fill in the required details below.</p>

      <input
        {...register('fullName')}
        placeholder="Full Names"
        className={styles.input}
        aria-invalid={errors.fullName ? 'true' : 'false'}
      />
      {errors.fullName && <p className={styles.error}>{errors.fullName.message}</p>}

      <select
        {...register('gender')}
        className={styles.input}
        aria-invalid={errors.gender ? 'true' : 'false'}
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      {errors.gender && <p className={styles.error}>{errors.gender.message}</p>}

      <input
        {...register('email')}
        placeholder="Email Address"
        className={styles.input}
        aria-invalid={errors.email ? 'true' : 'false'}
      />
      {errors.email && <p className={styles.error}>{errors.email.message}</p>}

      <input
        {...register('phone')}
        placeholder="Phone Number"
        className={styles.input}
        aria-invalid={errors.phone ? 'true' : 'false'}
      />
      {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}

      <input
        {...register('address')}
        placeholder="Contact Address"
        className={styles.input}
        aria-invalid={errors.address ? 'true' : 'false'}
      />
      {errors.address && <p className={styles.error}>{errors.address.message}</p>}

      <input
        {...register('dob')}
        type="date"
        className={styles.input}
        aria-invalid={errors.dob ? 'true' : 'false'}
      />
      {errors.dob && <p className={styles.error}>{errors.dob.message}</p>}

      <input
        {...register('parentName')}
        placeholder="Parent/Guardian Name"
        className={styles.input}
        aria-invalid={errors.parentName ? 'true' : 'false'}
      />
      {errors.parentName && <p className={styles.error}>{errors.parentName.message}</p>}

      <input
        {...register('parentAddress')}
        placeholder="Parent's Contact Address"
        className={styles.input}
        aria-invalid={errors.parentAddress ? 'true' : 'false'}
      />
      {errors.parentAddress && <p className={styles.error}>{errors.parentAddress.message}</p>}

      {/* Photo upload */}
      <label className={styles.label} htmlFor="photoUpload">Upload Passport Photo</label>
      <input
        type="file"
        id="photoUpload"
        accept="image/*"
        onChange={onPhotoChange}
        className={styles.input}
      />
      {photoPreview && (
        <img
          src={photoPreview}
          alt="Passport Preview"
          style={{ maxWidth: '150px', marginTop: '10px', borderRadius: '5px' }}
        />
      )}

      <button type="submit" className={styles.button}>
        Save and Continue
      </button>
    </form>
  );
}