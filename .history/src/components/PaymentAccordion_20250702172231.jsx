'use client';
import { useState } from 'react';
import PaymentAccordion from '../components/PaymentAccordion';

export default function PaymentAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion my-4" id="paymentAccordion">
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingOne">
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
          data-bs-parent="#paymentAccordion"
        >
          <div className="accordion-body">
            <p>
              To better protect your bank card information, <strong>BYU</strong> has instituted a secure way to make and process card payments. In this process, you enter your bank card information directly into a secure payment system rather than sending your information to Bachelor of General Studies to be entered. After completing the payment process, you will be given a confirmation number.
            </p>
            <p><strong>After clicking the button above:</strong></p>
            <ol>
              <li>Enter your BYU Net ID and Password then click “Enter”.</li>
              <li>If you have forgotten your BYU Net ID or password, click on the “Forgot your BYU Net ID or Password?” link and follow the instructions.</li>
              <li>If you do not know or do not have a BYU Net ID, click on the “Create a BYU Net ID” link and follow the instructions to create one.</li>
              <li>Once you are able to log in, follow the step-by-step registration instructions:
                <ul>
                  <li><strong>“Verify Person Info”</strong> page — verify your personal information and click “Continue”.</li>
                  <li><strong>“Payment Summary”</strong> page — verify information and click “Continue”.</li>
                  <li><strong>“Check Out”</strong> page — review terms and conditions and click “Continue”.</li>
                  <li><strong>“Registration Payment”</strong> page — enter your bank card information, then click “Process Payment Now”.</li>
                </ul>
              </li>
              <li>After the payment processes, you will be given a confirmation number.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}