// context/FormContext.js
import { createContext, useContext, useState } from "react";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  return (
    <FormContext.Provider value={{ step, setStep, next, back, formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormStep = () => useContext(FormContext);