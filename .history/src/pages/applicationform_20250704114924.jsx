import '../app/globals.css';
import styles from './applicationform.module.css';

import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

export default function ApplicationForm() {
  return (
    <>
      <Navbar />
      <div className={styles.applicationContainer}>
        <h1>Online Application Form</h1>

        <div className={styles.instructions}>
          <h2>Instructions to the Applicant:</h2>
          <ol>
            <li>
              <strong>STEP 1:</strong> Complete and submit this application form. 
              <br />
              <em>Note:</em> You may save a draft of this application for 30 days by clicking the <strong>"Save Draft"</strong> button at the bottom of the page.
            </li>
            <li>
              <strong>STEP 2:</strong> Pay the $35 application fee online or by check.
            </li>
            <li>
              <strong>STEP 3:</strong> Agreement to abide by the Honor Code.
            </li>
            <li>
              <strong>STEP 4:</strong> Complete the online Ecclesiastical Endorsement.
            </li>
          </ol>
        </div>

        {/* Your form or other content goes here */}
      </div>
      <Footer />
    </>
  );
}