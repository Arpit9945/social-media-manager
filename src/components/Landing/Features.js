import styles from './Features.module.scss';

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 7h7v7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Reel & Profile Analyzer',
    description: 'Paste any Instagram reel or profile link. Get AI-powered analysis on hooks, captions, hashtags, and what\'s actually working.',
    badge: 'Popular',
    color: 'violet',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'AI Post Generator',
    description: 'Professional posts for Diwali, Holi, sales, offers, and more. Pre-built templates + AI customization. Just upload your logo.',
    color: 'pink',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Viral Caption Writer',
    description: 'Get hook-driven captions tailored to your brand voice. Multiple variants to A/B test what works for your audience.',
    color: 'blue',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
    title: 'Smart Hashtag Mix',
    description: 'AI-curated hashtag sets with the perfect balance of high-volume, medium, and niche tags for maximum reach.',
    color: 'green',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
    title: 'Brand-Aware AI',
    description: 'Set up your brand once — colors, voice, audience. Every output is personalized to feel authentically yours.',
    color: 'orange',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Growth Insights',
    description: 'Connect your account to track which content drives followers. Pattern recognition, not just data dumps.',
    badge: 'New',
    color: 'cyan',
  },
];

export default function Features() {
  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>FEATURES</span>
          <h2 className={styles.title}>
            Everything you need.
            <br />
            <span className={styles.muted}>Nothing you don&apos;t.</span>
          </h2>
          <p className={styles.subtitle}>
            Six powerful tools, one focused mission: helping you grow on Instagram without the overwhelm.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`${styles.card} ${styles[`card_${feature.color}`]}`}
            >
              <div className={styles.cardIcon}>
                {feature.icon}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitleRow}>
                  <h3 className={styles.cardTitle}>{feature.title}</h3>
                  {feature.badge && (
                    <span className={styles.cardBadge}>{feature.badge}</span>
                  )}
                </div>
                <p className={styles.cardDescription}>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
