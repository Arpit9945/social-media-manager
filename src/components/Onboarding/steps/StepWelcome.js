'use client';

import styles from './Step.module.scss';

export default function StepWelcome({ onNext, userName }) {
  return (
    <div className={styles.step}>
      <div className={styles.welcomeIcon}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="url(#welcome-grad)" />
          <path d="M14 32L24 16L34 32" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M18 26h12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="36" cy="16" r="2.5" fill="white" />
          <defs>
            <linearGradient id="welcome-grad" x1="0" y1="0" x2="48" y2="48">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <h1 className={styles.title}>
        Welcome, <span className={styles.gradient}>{userName}</span>
      </h1>

      <p className={styles.description}>
        Let&apos;s set up your brand profile. This helps ASMA generate content that
        actually sounds like <em>you</em> — not generic AI fluff.
      </p>

      <div className={styles.benefits}>
        <div className={styles.benefit}>
          <span className={styles.benefitIcon}>⚡</span>
          <div>
            <p className={styles.benefitTitle}>Takes 2 minutes</p>
            <p className={styles.benefitText}>5 quick steps, no fluff</p>
          </div>
        </div>
        <div className={styles.benefit}>
          <span className={styles.benefitIcon}>🎨</span>
          <div>
            <p className={styles.benefitTitle}>Personalized AI</p>
            <p className={styles.benefitText}>Every output matches your brand</p>
          </div>
        </div>
        <div className={styles.benefit}>
          <span className={styles.benefitIcon}>✏️</span>
          <div>
            <p className={styles.benefitTitle}>Editable anytime</p>
            <p className={styles.benefitText}>Change settings later from your dashboard</p>
          </div>
        </div>
      </div>

      <button onClick={onNext} className={styles.startButton}>
        Let&apos;s start
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
