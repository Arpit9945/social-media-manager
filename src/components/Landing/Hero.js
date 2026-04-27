import Link from 'next/link';
import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bgGrid} aria-hidden="true"></div>
      <div className={styles.bgGlow} aria-hidden="true"></div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            <span>100% Free • Built for Indian Creators</span>
          </div>

          <h1 className={styles.title}>
            Grow your Instagram with{' '}
            <span className={styles.italic}>intelligence</span>,
            not guesswork.
          </h1>

          <p className={styles.subtitle}>
            AI Social Media Assistant by Arpit analyzes your reels, generates viral captions,
            and creates professional posts — so you can focus on creating, not strategizing.
          </p>

          <div className={styles.actions}>
            <Link href="/login" className={styles.primaryCta}>
              Start free
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a href="#how-it-works" className={styles.secondaryCta}>
              See how it works
            </a>
          </div>

          <div className={styles.socialProof}>
            <div className={styles.avatars}>
              <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}></div>
              <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}></div>
              <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}></div>
              <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}></div>
            </div>
            <p className={styles.proofText}>
              Join <strong>2,500+ creators</strong> growing smarter
            </p>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.visualInner}>
            <div className={styles.phoneMockup}>
              <div className={styles.phoneNotch}></div>
              <div className={styles.phoneScreen}>
                <div className={styles.appHeader}>
                  <div className={styles.appLogo}>
                    <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
                      <rect width="40" height="40" rx="10" fill="url(#hero-grad)" />
                      <path d="M13 28L20 12L27 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <path d="M16 22L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <circle cx="29" cy="13" r="2" fill="white" />
                      <defs>
                        <linearGradient id="hero-grad" x1="0" y1="0" x2="40" y2="40">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>ASMA</span>
                  </div>
                </div>

                <div className={styles.analysisCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardLabel}>Reel Analysis</span>
                    <span className={styles.cardScore}>9.2</span>
                  </div>
                  <div className={styles.cardMetrics}>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Hook</span>
                      <div className={styles.metricBar}>
                        <div className={styles.metricFill} style={{ width: '92%', background: '#10b981' }}></div>
                      </div>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Caption</span>
                      <div className={styles.metricBar}>
                        <div className={styles.metricFill} style={{ width: '78%', background: '#8b5cf6' }}></div>
                      </div>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Tags</span>
                      <div className={styles.metricBar}>
                        <div className={styles.metricFill} style={{ width: '65%', background: '#f59e0b' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.captionCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardLabel}>Viral Caption</span>
                  </div>
                  <p className={styles.captionText}>
                    POV: You finally found the skincare that actually works
                  </p>
                  <div className={styles.tags}>
                    <span className={styles.tag}>#skincare</span>
                    <span className={styles.tag}>#glowup</span>
                    <span className={styles.tag}>#routine</span>
                  </div>
                </div>

                <div className={styles.suggestionCard}>
                  <div className={styles.suggestionDot}></div>
                  <div>
                    <p className={styles.suggestionTitle}>Best time: 7:30 PM</p>
                    <p className={styles.suggestionText}>+34% engagement</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.floatingCard1}>
              <div className={styles.floatingIcon} style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 12l3-3 3 3 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11 4h3v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className={styles.floatingTitle}>Followers</p>
                <p className={styles.floatingValue}>+312 this week</p>
              </div>
            </div>

            <div className={styles.floatingCard2}>
              <div className={styles.floatingIcon} style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1l1.5 4.5h4.5l-3.5 3 1.5 4.5L8 10.5l-4 2.5 1.5-4.5L2 5.5h4.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className={styles.floatingTitle}>Trending</p>
                <p className={styles.floatingValue}>5 new ideas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
