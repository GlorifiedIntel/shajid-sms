'use client';

import { FormProvider, useFormStep } from '@/context/FormContext';
import Sidebar from '@/components/Sidebar';
import PersonalInfo from '@/components/steps/PersonalInfo';
import HealthInfo from '@/components/steps/HealthInfo';
import SchoolsAttended from '@/components/steps/SchoolsAttended'; 
import ExamResults from '@/components/steps/ExamResults';
import ProgramDetails from '@/components/steps/ProgramDetails';
import UTMEInfo from '@/components/steps/UTMEInfo';
import Review from '@/components/steps/Review';
import styles from './applicationform.module.css';

export default function ApplyPage() {
  // StepRenderer moved inside ApplyPage to access context properly
  function StepRenderer() {
    const { step } = useFormStep();

    switch (step) {
      case 1:
        return <PersonalInfo />;
      case 2:
        return <HealthInfo />;
      case 3:
        return <SchoolsAttended />;
      case 4:
        return <ExamResults />;
      case 5:
        return <ProgramDetails />;
      case 6:
        return <UTMEInfo />;
      case 7:
        return <Review />;
      default:
        return <div>Unknown step</div>;
    }
  }

  return (
    <FormProvider>
      <div className="min-h-screen flex items-start">
        <Sidebar />
        <div className={styles.applicationContainer}>
          <h1 className={styles.pageTitle}>Online Application Form</h1>

          <div className={styles.instructions}>
            <h2 className={styles.instructionsHeading}>Instructions to the Applicant:</h2>
            <strong>STEP 1:</strong> Complete and submit this application form.
          </div>

          <StepRenderer />
        </div>
      </div>
    </FormProvider>
  );
}