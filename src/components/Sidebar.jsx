"use client";

import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { useFormStep } from "@/context/FormContext";

const steps = [
  "Personal Info",
  "Health Info",
  "Schools Attended",
  "Exam Results",
  "Program Details",
  "UTME Info",
  "Review & Submit",
];

export default function Sidebar() {
  const { step, goToStep } = useFormStep();
  const [hasMounted, setHasMounted] = useState(false);

  // Wait until mounted on client to render to avoid SSR mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null; // Render nothing on server

  // Fallback if step is undefined
  const currentStep = typeof step === "number" ? step : 1;

  return (
    <div className={styles.sidebar}>
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isDisabled = currentStep < stepNumber;

        return (
          <div
            key={label}
            className={`${styles.stepItem} ${isActive ? styles.active : ""} ${
              isDisabled ? styles.disabled : ""
            }`}
            onClick={(e) => {
              if (isDisabled) {
                e.preventDefault();
              } else {
                goToStep(stepNumber);
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
                goToStep(stepNumber);
              }
            }}
            aria-current={isActive ? "step" : undefined}
            aria-disabled={isDisabled ? "true" : undefined}
          >
            <div
              className={`${styles.stepCircle} ${
                isActive
                  ? styles.active
                  : isDisabled
                  ? styles.disabledCircle
                  : ""
              }`}
            >
              {stepNumber}
            </div>
            <div className={styles.stepText}>
              <div className={styles.stepNumber}>STEP {stepNumber}</div>
              <div className={styles.stepLabel}>{label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}