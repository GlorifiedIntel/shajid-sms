'use client';

import styles from './links.module.css';
import NavLink from './navLink/navLink';

const Links = () => {
  const links = [
    { title: 'HOME', path: '/' },
    { title: 'PROSPECTIVE STUDENT', path: '/auth/prospective-student' },
    { title: 'ADMITTED STUDENT', path: '/auth/admitted-student' },
    { title: 'APPLY NOW', path: '/apply' },
  ];

  return (
    <div className={styles.links}>
      {links.map((link) => (
       <NavLink item={link} key={link.title}/>
      ))}
    </div>
  );
};

export default Links;