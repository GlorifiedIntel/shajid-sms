"use client";
import { FormProvider } from "@/context/FormContext";
import Sidebar from "@/components/Sidebar";
import PersonalInfo from "@/components/steps/PersonalInfo";
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
// You can import Step2, Step3... later

export default function ApplyPage() {
  return (
    <>
    <Navbar />
    <FormProvider>
      <div className="min-h-screen flex items-start">
        <Sidebar />
        <div className="flex-1 bg-white p-8">
          <PersonalInfo />
          {/* Use step === 2 ? <Step2 /> : ... for next steps */}
        </div>
      </div>
    </FormProvider>

    <Footer />
    </>
    
  );
}