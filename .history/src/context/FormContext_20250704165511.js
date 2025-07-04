'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const FormContext = createContext();

export function FormProvider({ children }) {
  // Initialize step from localStorage or default to 1
  const [step, setStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedStep = localStorage.getItem('formStep');
      return savedStep ? Number(savedStep) : 1;
    }
    return 1;
  });

  // Initialize formData from localStorage or empty object
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('formData');
      return savedData ? JSON.parse(savedData) : {};
    }
    return {};
  });

  // Save step to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('formStep', step.toString());
    }
  }, [step]);

  // Save formData to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [formData]);

  const nextStep = () => setStep((s) => Math.min(s + 1, 7));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const goToStep = (num) => {
    if (num >= 1 && num <= 7) setStep(num);
  };

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // Reset function clears data and localStorage
  const resetForm = () => {
    setFormData({});
    setStep(1);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('formData');
      localStorage.removeItem('formStep');
    }
  };

  // Map step number to title
  const stepTitles = {
    1: 'Personal Information',
    2: 'Health Information',
    3: 'Schools Attended',
    4: 'Exam Results',
    5: 'Program Details',
    6: 'UTME Information',
    7: 'Review & Submit',
  };

  // Current step title based on step
  const currentStepTitle = stepTitles[step] || '';

  return (
    <FormContext.Provider
      value={{
        step,
        setStep,
        nextStep,
        prevStep,
        goToStep,
        formData,
        updateFormData,
        resetForm,
        currentStepTitle, 
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormStep() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormStep must be used within a FormProvider');
  }
  return context;
}