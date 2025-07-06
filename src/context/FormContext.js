'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const FormContext = createContext();

export function FormProvider({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  // State for step and formData initialized with defaults
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  // Mark as mounted after first client render
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Load saved data only after mount
  useEffect(() => {
    if (hasMounted) {
      const savedStep = localStorage.getItem('formStep');
      setStep(savedStep ? Number(savedStep) : 1);

      const savedData = localStorage.getItem('formData');
      setFormData(savedData ? JSON.parse(savedData) : {});
    }
  }, [hasMounted]);

  // Save step to localStorage on change (only after mount)
  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('formStep', step.toString());
    }
  }, [step, hasMounted]);

  // Save formData to localStorage on change (only after mount)
  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [formData, hasMounted]);

  const nextStep = () => setStep((s) => Math.min(s + 1, 7));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const goToStep = (num) => {
    if (num >= 1 && num <= 7) setStep(num);
  };

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const resetForm = () => {
    setFormData({});
    setStep(1);
    if (hasMounted) {
      localStorage.removeItem('formData');
      localStorage.removeItem('formStep');
    }
  };

  const stepTitles = {
    1: 'Personal Information',
    2: 'Health Information',
    3: 'Schools Attended',
    4: 'Exam Results',
    5: 'Program Details',
    6: 'UTME Information',
    7: 'Review & Submit',
  };

  const currentStepTitle = stepTitles[step] || '';

  // While not mounted, render nothing to avoid hydration mismatch
  if (!hasMounted) return null;

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