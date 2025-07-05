"use client";

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

  return (
    <div className={styles.sidebar}>
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = step === stepNumber;
        const isDisabled = step < stepNumber;

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
            aria-disabled={isDisabled}
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