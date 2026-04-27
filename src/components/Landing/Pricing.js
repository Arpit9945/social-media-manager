import Link from 'next/link';
import styles from './Pricing.module.scss';

const features = [
  'Reel & Profile Analyzer',
  'Unlimited AI Caption Generation',
  'Smart Hashtag Suggestions',
  '20+ Pre-built Post Templates',
  'AI Post Generation',
  'Brand Voice Customization',
  'History & Saved Posts',
  'Mobile + Desktop Access',
  'Free Forever — No Credit Card',
];

export default function Pricing() {
  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>PRICING</span>
          <h2 className={styles.title}>
            Forever free.
            <br />
            <span className={styles.muted}>No catch.</span>
          </h2>
          <p className={styles.subtitle}>
            Built as a tool, not a subscription. Use everything, no card required, no hidden tiers.
          </p>
        </div>

        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.cardGlow} aria-hidden="true"></div>
            
            <div className={styles.priceSection}>
              <span className={styles.priceLabel}>Free Plan</span>
              <div className={styles.price}>
                <span className={styles.currency}>₹</span>
                <span className={styles.amount}>0</span>
                <span className={styles.period}>/forever</span>
              </div>
              <p className={styles.priceCaption}>
                Everything included. No premium tier. No paywall.
              </p>
            </div>

            <div className={styles.divider}></div>

            <ul className={styles.features}>
              {features.map((feature) => (
                <li key={feature} className={styles.feature}>
                  <span className={styles.checkIcon}>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/login" className={styles.cta}>
              Get started free
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <p className={styles.disclaimer}>
              Sign in with Google in seconds. No payment information needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
