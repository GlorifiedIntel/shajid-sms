'use client';
import { useState } from 'react';
import styles from './PaymentAccordion.module.css';

export default function PaymentAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`accordion my-4 ${styles.myAccordion_accordionWrapper}`} id="paymentAccordion">
      <div className="accordion-item">
        <h2 className={`accordion-header ${styles.myAccordion_accordionHeader}`} id="headingOne">
          <button
            className={`accordion-button ${!isOpen ? 'collapsed' : ''}`}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="collapseOne"
          >
            Secure Payment Instructions
          </button>
        </h2>
        <div
          id="collapseOne"
          className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
          aria-labelledby="headingOne"
        >
          <div className={`accordion-body ${styles.myAccordion_accordionBody}`}>
            <p>
              To better protect your bank card information, <strong>BYU</strong> has instituted a secure...
            </p>
            {/* [rest of content] */}
          </div>
        </div>
      </div>
    </div>
  );
}