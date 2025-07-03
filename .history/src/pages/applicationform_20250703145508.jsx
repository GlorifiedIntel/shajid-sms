import '../app/globals.css';
import styles from './applicationform.module.css';

import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

export default function ApplicationForm() {
  return (
    <>
     <Navbar />
    <div>
      <h1>Online Application Form</h1>
      {/* Your form or other content goes here */}
    </div>

     <Footer />
    </>

    
    
  );
}