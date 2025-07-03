import Image from "next/image";
import Link from "next/link";
import './globals.css';
import styles from './page.module.css';
import WhenToApply from "@/components/WhenToApply";
import ApplicationSteps from "@/components/ApplicationSteps";
import AboutSection from "@/components/AboutSection";





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
      <section className={styles.secondarySection}>
        <WhenToApply />
      </section>
      <section className={styles.secondarySection}>
        <ApplicationSteps />
      </section>
    <container className={styles.Aboutcontainer}>
      <AboutSection />
    </container>
      
      
      <div className={styles.chatButton}>💬 Live Chat</div>
    </>
  );
}