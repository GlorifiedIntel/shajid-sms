'use client';

import { useSession } from 'next-auth/react';  // import session hook
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';  // client side router in Next.js 13 app dir

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
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      // redirect if not logged in
      router.push('/auth/sign-in'); // or your login page path
    }
  }, [status, router]);

  // Show loading while session status is loading
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // Only render the form if authenticated
  if (!session) {
    return <div>You must be signed in</div>;
  }

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
          <StepRenderer />
        </div>
      </div>
    </FormProvider>
  );
}