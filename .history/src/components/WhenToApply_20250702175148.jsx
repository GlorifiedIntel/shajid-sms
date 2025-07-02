// app/components/WhenToApply.jsx
import Link from 'next/link';
import styles from './WhenToApply.module.css';

export default function WhenToApply() {
  return (
    <section className={styles.container}>
      <div className={styles.textBlock}>
        <h2 className={styles.heading}>WHEN TO APPLY</h2>
        <p>
          If you have completed <strong>27+ credits</strong> at BYU (Provo) as an admitted student and have been away for at least two years
          (or have <strong>90+ credits</strong>), you can apply to the BGS Program anytime. There are no application deadlines, and you may
          register for BYU Independent Study courses as soon as you are formally admitted to the BGS program. However, if you want to attend
          classes at the Salt Lake Center, Evening Classes, or on campus during Spring or Summer terms, please note the campus priority
          registration dates. Also be aware that the admissions process can take up to four weeks after completing your application.{' '}
          
        </p>
      </div>

      <aside className={styles.sidebar}>
        <button className={styles.primaryButton}>Check My Eligibility</button>
        <nav className={styles.whenToApplyNavLinks}>
          <Link href="#">Application Process</Link>
          <Link href="#">Fees & Financial Assistance</Link>
          <Link href="#">Advising & Support</Link>
          <Link href="#">FAQ</Link>
        </nav>
      </aside>
    </section>
  );
}