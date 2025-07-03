// app/components/WhenToApply.jsx
import Link from 'next/link';
import styles from './WhenToApply.module.css';

export default function WhenToApply() {
  return (
    <section className={styles.container}>
      <div className={styles.textBlock}>
        <h2 className={styles.heading}>WHEN TO APPLY</h2>
        <p>
          If you have completed <strong>Secondary Education</strong> or from a recognized college, you are eligible to apply for any of our programs. 
          Our admissions operate on a rolling basis, meaning there are no application deadlines. You may submit your application and register for your chosen program at any time throughout the year. </p>
          <p>Follow the steps below to apply. Start your journey in healthcare today — apply when you're ready, and we’ll be here to support you every step of the way. If you have any questions or need help with your application, feel free to contact our admissions team at <strong>admissions@shajidcollege.edu.ng.</strong></p>
      </div>

      
    </section>
  );
}