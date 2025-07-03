import '../app/globals.css';

export default function ApplyPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Application Portal</h1>
      <p className={styles.subText}>
        Welcome to the Shajid College of Nursing and Midwifery Application Portal.
      </p>
      <p className={styles.subText}>
        Please proceed through the steps to complete your application.
      </p>

      <div className={styles.card}>
        <p>This card can contain an introduction or links to steps like Step 1, Step 2, etc.</p>
      </div>
    </main>
  );
}