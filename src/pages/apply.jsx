import '../app/globals.css';
import styles from './apply.module.css';

import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import ApplySection from '../components/ApplySection';

export default function ApplyPage() {
  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <h1 className={styles.heading}>Application Portal</h1>
        <p className={styles.subText}>
          Welcome to the Shajid College of Nursing and Midwifery Application Portal.
        </p>
        <p className={styles.subText}>
          Please proceed through the steps to complete your application.
        </p>

        <div className={styles.card}>
          <ApplySection />
        </div>
      </main>
      <Footer />
    </>
  );
}