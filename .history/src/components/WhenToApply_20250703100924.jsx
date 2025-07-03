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
      </div>

      
    </section>
  );
}