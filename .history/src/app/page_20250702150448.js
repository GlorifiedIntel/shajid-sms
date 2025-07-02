import Image from "next/image";
import Link from "next/link";
import './globals.css';
import styles from './page.module.css';


export default function Home() {
  return (
    <>
      <section className={styles.mainSection}>
        <div className={styles.imageContainer}>
          <Image src="/nurse-3.png" alt="Students talking" width={427} height={640} />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>
            SIMPLE <br />
            <strong>APPLICATION PROCESS</strong>
          </h2>
          <p>Everything you need to know about the application process.</p>
          <Link href="#" className={`${styles.applyButton} ${styles.large}`}>
            Apply Now
          </Link>
        </div>
      </section>

        <section className={styles.container}>
      <div className={styles.textBlock}>
        <h2 className={styles.heading}>WHEN TO APPLY</h2>
        <p>
          If you have completed <strong>27+ credits</strong> at BYU (Provo) as an admitted student and have been away for at least two years
          (or have <strong>90+ credits</strong>), you can apply to the BGS Program anytime. There are no application deadlines, and you may
          register for BYU Independent Study courses as soon as you are formally admitted to the BGS program. However, if you want to attend
          classes at the Salt Lake Center, Evening Classes, or on campus during Spring or Summer terms, please note the campus priority
          registration dates. Also be aware that the admissions process can take up to four weeks after completing your application.{' '}
          <a
            href="https://example.com/priority-registration"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Check priority registration dates
          </a>
        </p>
      </div>

      <aside className={styles.sidebar}>
        <button className={styles.primaryButton}>Check My Eligibility</button>
        <nav className={styles.navLinks}>
          <Link href="#">Application Process</Link>
          <Link href="#">Fees & Financial Assistance</Link>
          <Link href="#">Advising & Support</Link>
          <Link href="#">FAQ</Link>
        </nav>
      </aside>
    </section>

      <div className={styles.chatButton}>💬 Live Chat</div>
    </>
  );
}