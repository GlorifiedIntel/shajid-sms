// components/Sidebar.jsx
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
  const { step } = useFormStep();

  return (
    <div className={styles.sidebar}>
      {steps.map((label, index) => {
        const isActive = step === index + 1;
        return (
          <div
            key={label}
            className={`${styles.stepItem} ${isActive ? styles.active : ""}`}
          >
            <div
              className={`${styles.stepCircle} ${
                isActive ? styles.active : ""
              }`}
            >
              {index + 1}
            </div>
            <div className={styles.stepText}>
              <div className={styles.stepNumber}>STEP {index + 1}</div>
              <div className={styles.stepLabel}>{label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
