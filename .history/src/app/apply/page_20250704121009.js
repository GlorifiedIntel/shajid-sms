"use client";
import { FormProvider } from "@/context/FormContext";
import Sidebar from "@/components/Sidebar";
import Step1PersonalInfo from "@/components/steps/PersonalInfo";
// You can import Step2, Step3... later

export default function ApplyPage() {
  return (
    <FormProvider>
      <div className="min-h-screen flex items-start">
        <Sidebar />
        <div className="flex-1 bg-white p-8">
          <Step1PersonalInfo />
          {/* Use step === 2 ? <Step2 /> : ... for next steps */}
        </div>
      </div>
    </FormProvider>
  );
}