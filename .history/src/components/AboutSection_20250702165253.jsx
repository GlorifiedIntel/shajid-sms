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
                src="/online-application2.jpg" 
                alt="About Shajid SMS"
              />
            </div>
          </div>
          <div className={styles.textCol}>
            <div className={styles.textWrapper}>
              <span className={styles.subheading}>How to Apply</span>
              <h2 className={styles.heading}>Step 1: <br /> Complete the Online Application</h2>
              <p className={styles.lead}>
                As part of the Shajid College of Nursing and Midwifery application process, you will need to Create an Account before you can continue. This account will also allow you to complete the online  endorsement, register for any our program, pay Post UTME Fee, check your application status, edit your application form, and perform a number of other functions dealing with personal information. Submit any necessary document as indicated on the online application form.
              </p>
              <a className={styles.button} href="#">Online Application Form <i class="bi bi-arrow-up-right-square-fill"></i></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}