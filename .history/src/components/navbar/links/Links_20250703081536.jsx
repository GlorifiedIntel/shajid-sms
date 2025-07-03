'use client';

import styles from './links.module.css';
import NavLink from './navLink/navLink';

const Links = () => {
  const links = [
    { title: 'HOME', path: '/' },
    {
      title: 'PROSPECTIVE STUDENT',
      path: '/auth/prospective-student',
      children: [
        { title: 'Check My Eligibility', path: '/auth/prospective-student/eligibility' },
        { title: 'Prospective Student Info', path: '/auth/prospective-student/info' },
        { title: 'Fees & Financial Assistance', path: '/auth/prospective-student/fees' },
        { title: 'Graduation Requirements', path: '/auth/prospective-student/graduation' },
        { title: 'Apply Now', path: '/apply' },
        { title: 'Advising & Support', path: '/auth/prospective-student/advising' },
        { title: 'FAQ', path: '/auth/prospective-student/faq' },
      ],
    },
    {
      title: 'ADMITTED STUDENT',
      path: '/auth/admitted-student',
      children: [
        { title: 'Admitted Student Info', path: '/auth/admitted-student/info' },
        { title: 'Fees & Financial Assistance', path: '/auth/admitted-student/fees' },
        { title: 'Advising & Support', path: '/auth/admitted-student/advising' },
        { title: 'Facebook Group 🔗', path: 'https://facebook.com/groups/yourgroup', external: true },
      ],
    },
    { title: 'APPLY NOW', path: '/apply' },
  ];

  return (
    <div className={styles.links}>
      {links.map((link) => (
        <NavLink item={link} key={link.title} />
      ))}
    </div>
  );
};

export default Links;