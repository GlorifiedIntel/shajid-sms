'use client';

import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export function FormProvider({ children }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = () => setStep((s) => Math.min(s + 1, 7));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const goToStep = (num) => {
    if (num >= 1 && num <= 7) setStep(num);
  };

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