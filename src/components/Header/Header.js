'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from '@/components/Logo/Logo';
import styles from './Header.module.scss';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <Link href="/" className={styles.logoLink} aria-label="ASMA Home">
            <Logo size={30} textSize="md" />
          </Link>

          <nav className={styles.nav} aria-label="Main navigation">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link href="/login" className={styles.signIn}>Sign in</Link>
            <Link href="/login" className={styles.cta}>
              Get started
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <button
            className={styles.menuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`${styles.menuIcon} ${mobileMenuOpen ? styles.open : ''}`}>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </header>

      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMobileMenuOpen(false)}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span>{link.label}</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
          ))}
          <div className={styles.mobileActions}>
            <Link href="/login" className={styles.mobileSignIn} onClick={() => setMobileMenuOpen(false)}>
              Sign in
            </Link>
            <Link href="/login" className={styles.mobileCta} onClick={() => setMobileMenuOpen(false)}>
              Get started free
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
