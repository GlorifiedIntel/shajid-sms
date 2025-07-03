import styles from './ApplicationSteps.module.css';

export default function ApplicationSteps() {
  return (
    <section className={styles.applicationSteps}>
      <div className={styles.step}>
        <img src="/laptop.png" alt="Online Application" />
        <p>Online Application</p>
      </div>
      <div className={styles.step}>
        <img src="/money.png" alt="Application Fee" />
        <p>Application Fee</p>
      </div>
      <div className={styles.step}>
        <img src="/handshake.png" alt="Endorsement" />
        <p>Endorsement</p>
      </div>
      <div className={styles.step}>
        <img src="/award.png" alt="Acceptance" />
        <p>Acceptance</p>
      </div>
    </section>
  );
}
