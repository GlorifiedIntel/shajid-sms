'use client';

import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export function FormProvider({ children }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  // Move to next step (max 7)
  const nextStep = () => setStep((s) => Math.min(s + 1, 7));

  // Move to previous step (min 1)
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Directly go to a specific step (between 1 and 7)
  const goToStep = (num) => {
    if (num >= 1 && num <= 7) setStep(num);
  };

  // Update form data by merging new data with existing data
  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

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