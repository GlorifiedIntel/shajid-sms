import styles from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              <img
                className={styles.image}
                src="/about-image.png" // Put your image in /public
                alt="About Shajid SMS"
              />
            </div>
          </div>
          <div className={styles.textCol}>
            <div className={styles.textWrapper}>
              <span className={styles.subheading}>How to Apply</span>
              <h2 className={styles.heading}>Step 1: Complete the Online Application</h2>
              <p className={styles.lead}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className={styles.lead}>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.
              </p>
              <a className={styles.button} href="#">Learn more</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}