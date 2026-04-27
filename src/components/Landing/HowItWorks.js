import styles from './HowItWorks.module.scss';

const steps = [
  {
    number: '01',
    title: 'Connect & set up',
    description: 'Sign in with Google. Tell us about your brand — name, colors, audience, tone. One-time, two minutes.',
  },
  {
    number: '02',
    title: 'Analyze or create',
    description: 'Paste a reel link to get insights, or pick a template to generate professional posts. AI does the heavy lifting.',
  },
  {
    number: '03',
    title: 'Post & grow',
    description: 'Download high-quality posts, copy AI captions with hashtags, and watch your engagement compound over weeks.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>HOW IT WORKS</span>
          <h2 className={styles.title}>
            Three steps from
            <br />
            <span className={styles.gradient}>idea to viral</span>
            .
          </h2>
        </div>

        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.stepNumber}>
                <span>{step.number}</span>
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={styles.stepConnector} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12m-5-5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
