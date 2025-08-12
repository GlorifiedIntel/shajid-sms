'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './navLink.module.css';

const NavLink = ({ item }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isActive = pathname === item.path;

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleModalOpen = (e) => {
    e.preventDefault(); // prevent immediate navigation
    setShowModal(true);
  };

  const handleRedirect = (path) => {
    setShowModal(false);
    router.push(path);
  };

  return (
    <div
      className={styles.navItem}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        className={styles.mainLinkWrapper}
        onClick={item.children ? handleToggle : undefined}
      >
        {/* If link should show modal, don't navigate immediately */}
        {item.showModal ? (
          <a
            href={item.path}
            className={`${styles.mainLink} ${isActive ? styles.active : ''}`}
            onClick={handleModalOpen}
          >
            {item.title}
          </a>
        ) : (
          <Link
            href={item.path}
            className={`${styles.mainLink} ${isActive ? styles.active : ''}`}
          >
            {item.title}
          </Link>
        )}

        {item.children && (
          <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
        )}
      </div>

      {/* Dropdown Children */}
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

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Do you already have an account?</h3>
            <div className={styles.modalButtons}>
              <button onClick={() => handleRedirect('/auth/sign-in')} className={styles.modalButton}>
                Yes, Sign In
              </button>
              <button onClick={() => handleRedirect('/create-account')} className={styles.modalButtonAlt}>
                No, Create Account
              </button>
            </div>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavLink;