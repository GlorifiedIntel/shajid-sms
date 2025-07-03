'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './navLink.module.css';

const NavLink = ({ item }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = pathname === item.path;

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={styles.navItem}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className={styles.mainLinkWrapper} onClick={item.children ? handleToggle : undefined}>
        <Link
          href={item.path}
          className={`${styles.mainLink} ${isActive ? styles.active : ''}`}
        >
          {item.title}
        </Link>
        {item.children && (
          <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
        )}
      </div>

      {item.children && isOpen && (
        <div className={styles.dropdown}>
          {item.children.map((child) => {
            const isChildActive = pathname === child.path;
            return child.external ? (
              <a
                key={child.title}
                href={child.path}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.dropdownLink}
                onClick={handleClose}
              >
                {child.title}
              </a>
            ) : (
              <Link
                key={child.title}
                href={child.path}
                className={`${styles.dropdownLink} ${isChildActive ? styles.active : ''}`}
                onClick={handleClose}
              >
                {child.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NavLink;