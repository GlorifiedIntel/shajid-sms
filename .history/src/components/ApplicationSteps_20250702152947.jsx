// components/ApplicationSteps.jsx
export default function ApplicationSteps() {
  return (
    <section className="application-steps">
      <div className="step">
        <img src="/icons/laptop.svg" alt="Online Application" />
        <p>Online Application</p>
      </div>
      <div className="step">
        <img src="/icons/money.svg" alt="Application Fee" />
        <p>Application Fee</p>
      </div>
      <div className="step">
        <img src="/icons/handshake.svg" alt="Ecclesiastical Endorsement" />
        <p>Ecclesiastical Endorsement</p>
      </div>
      <div className="step">
        <img src="/icons/award.svg" alt="Acceptance" />
        <p>Acceptance</p>
      </div>
    </section>
  );
}