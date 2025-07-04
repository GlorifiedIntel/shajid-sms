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
          <div className={styles.applicationContainer}>
        <h1 className={styles.pageTitle}>Online Application Form</h1>

        <div className={styles.instructions}>
          <h2 className={styles.instructionsHeading}>Instructions to the Applicant:</h2>
          <ol>
            <li>
              <strong>STEP 1:</strong> Complete and submit this application form. 
              <br />
              <em>Note:</em> You may save a draft of this application for 30 days by clicking the <strong>"Save Draft"</strong> button at the bottom of the page.
            </li>
            <li>
              <strong>STEP 2:</strong> Pay the &#8358;3,500 application fee online or by Bank Deposit.
            </li>
            <li>
              <strong>STEP 3:</strong> Agreement to abide by the Honor Code.
            </li>
            <li>
              <strong>STEP 4:</strong> Complete the online Endorsement.
            </li>
          </ol>
        </div>
          <PersonalInfo />
          {/* Use step === 2 ? <Step2 /> : ... for next steps */}
        </div>
      </div>
    </FormProvider>

    <Footer />
    </>
    
  );
}