import { motion } from 'framer-motion';
import styles from './StepForm.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const steps = [
  { icon: 'bi-laptop', title: 'Online Application' },
  { icon: 'bi-credit-card', title: 'Application Fee' },
  { icon: 'bi-person-check', title: 'Endorsement' },
  { icon: 'bi-patch-check', title: 'Acceptance' },
];

export default function StepForm() {
  return (
    <section className={styles.stepSection}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Application Process</h2>
        <div className={styles.stepsWrapper}>
          {steps.map((step, index) => (
            <motion.div
              className={styles.step}
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className={styles.icon}>
                <i className={`bi ${step.icon}`}></i>
              </div>
              <p className={styles.title}>{step.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
