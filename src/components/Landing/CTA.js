import Link from 'next/link';
import styles from './CTA.module.scss';

export default function CTA() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.glow} aria-hidden="true"></div>
          <div className={styles.grid} aria-hidden="true"></div>

          <div className={styles.content}>
            <h2 className={styles.title}>
              Stop guessing.
              <br />
              <span className={styles.gradient}>Start growing</span>
              .
            </h2>
            <p className={styles.subtitle}>
              Join thousands of creators using AI to outperform their competition. 
              Free forever, no strings attached.
            </p>
            <Link href="/login" className={styles.cta}>
              Get started free
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
