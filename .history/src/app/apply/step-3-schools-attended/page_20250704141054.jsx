'use client';

import SchoolsAttended from '@/components/steps/SchoolsAttended';
import { FormProvider } from '@/context/FormContext';

export default function SchoolsAttendedPage() {
  return (
    <FormProvider>
      <SchoolsAttended />
    </FormProvider>
  );
}