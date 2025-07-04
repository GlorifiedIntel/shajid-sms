"use client";
import { createContext, useContext, useState } from "react";

// Create context
const FormContext = createContext();

// Provider
export const FormProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);
  const updateData = (data) => setFormData((prev) => ({ ...prev, ...data }));

  return (
    <FormContext.Provider value={{ step, setStep, next, back, formData, updateData }}>
      {children}
    </FormContext.Provider>
  );
};

// Hook
export const useFormStep = () => useContext(FormContext);