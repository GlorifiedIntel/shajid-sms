import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const FormContext = createContext();

export function FormProvider({ children }) {
  const { data: session } = useSession();
  const [hasMounted, setHasMounted] = useState(false);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [lastUser, setLastUser] = useState(null);

  // ✅ Declare resetForm early so it's available in useEffect below
  const resetForm = () => {
    setFormData({});
    setStep(1);
    if (hasMounted) {
      localStorage.removeItem('formData');
      localStorage.removeItem('formStep');
      localStorage.removeItem('formUser');
    }
  };

  // Mark as mounted
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Load saved form only after mount
  useEffect(() => {
    if (hasMounted) {
      const savedStep = localStorage.getItem('formStep');
      setStep(savedStep ? Number(savedStep) : 1);

      const savedData = localStorage.getItem('formData');
      setFormData(savedData ? JSON.parse(savedData) : {});

      const savedUser = localStorage.getItem('formUser');
      setLastUser(savedUser || null);
    }
  }, [hasMounted]);

  // ✅ Now resetForm is safe to use here
  useEffect(() => {
    if (!hasMounted || !session?.user?.email) return;

    if (lastUser && lastUser !== session.user.email) {
      resetForm(); // clear form if logged-in user has changed
    }

    setLastUser(session.user.email);
    localStorage.setItem('formUser', session.user.email);
  }, [session?.user?.email, hasMounted, lastUser, resetForm]);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('formStep', step.toString());
    }
  }, [step, hasMounted]);

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