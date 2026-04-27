'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo/Logo';
import styles from './Dashboard.module.scss';

export default function DashboardClient({ user, profile, stats }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'Creator';
  const userAvatar = user?.user_metadata?.avatar_url;

  // ANALYZER tools
  const analyzerTools = [
    {
      id: 'reel-analyzer',
      title: 'Reel Analyzer',
      description: 'Paste any reel — get hook, caption, hashtag, and viral potential analysis',
      href: '/analyzer/reel',
      color: 'violet',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 7h7v7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'profile-audit',
      title: 'Profile Audit',
      description: 'Strategic audit of your bio, content patterns, and growth strategy',
      href: '/analyzer/profile',
      color: 'pink',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  // GENERATOR tools
  const generatorTools = [
    {
      id: 'reel-generator',
      title: 'Mini Reel Generator',
      description: 'Create animated 15-second reels — pick template, edit text, download',
      href: '/generator/reel',
      color: 'violet',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'post-generator',
      title: 'Static Post Generator',
      description: 'Beautiful single-image posts. Same templates, instant download',
      href: '/generator/post',
      color: 'pink',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  const totalActivity = stats.totalAnalyses + stats.totalPosts;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/dashboard" className={styles.logoLink}>
            <Logo size={28} textSize="md" />
          </Link>

          <div className={styles.userMenu}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={styles.userButton}
              aria-label="Account menu"
            >
              {userAvatar ? (
                <img src={userAvatar} alt="" className={styles.avatar} referrerPolicy="no-referrer" />
              ) : (
                <div className={styles.avatarFallback}>
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userName}</span>
                <span className={styles.userEmail}>{user.email}</span>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className={`${styles.chevron} ${menuOpen ? styles.chevronOpen : ''}`}
              >
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {menuOpen && (
              <>
                <div className={styles.menuBackdrop} onClick={() => setMenuOpen(false)}></div>
                <div className={styles.menu}>
                  <Link href="/settings" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 1v2M8 13v2M15 8h-2M3 8H1M13.07 13.07l-1.41-1.41M4.34 4.34L2.93 2.93M13.07 2.93l-1.41 1.41M4.34 11.66l-1.41 1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Settings
                  </Link>
                  <button onClick={handleSignOut} className={styles.menuItem}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Welcome + stats */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>
              Welcome back, <span className={styles.welcomeName}>{userName}</span>
            </h1>
            <p className={styles.welcomeText}>
              {totalActivity === 0
                ? 'All tools are live. Pick one below and start growing your Instagram.'
                : `You've created ${totalActivity} thing${totalActivity !== 1 ? 's' : ''} so far. Keep going!`}
            </p>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stats.totalAnalyses}</span>
              <span className={styles.statLabel}>Analyses</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stats.totalPosts}</span>
              <span className={styles.statLabel}>Generated</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stats.reelsCount + stats.staticCount > 0 ? stats.reelsCount : '—'}</span>
              <span className={styles.statLabel}>Reels</span>
            </div>
          </div>
        </section>

        {/* Brand profile card */}
        <section className={styles.brandCard}>
          <div className={styles.brandHeader}>
            <div className={styles.brandLeft}>
              {profile?.logo_url ? (
                <img src={profile.logo_url} alt={profile.brand_name} className={styles.brandLogo} />
              ) : (
                <div
                  className={styles.brandLogoFallback}
                  style={{
                    background: `linear-gradient(135deg, ${profile?.primary_color || '#8b5cf6'}, ${profile?.secondary_color || '#ec4899'})`,
                  }}
                >
                  {(profile?.brand_name || 'B').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className={styles.brandLabel}>YOUR BRAND</p>
                <h2 className={styles.brandName}>{profile?.brand_name || 'Your Brand'}</h2>
                {profile?.brand_description && (
                  <p className={styles.brandDescription}>{profile.brand_description}</p>
                )}
              </div>
            </div>
            <Link href="/settings" className={styles.editLink}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2l3 3-7 7H2v-3l7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Edit
            </Link>
          </div>

          <div className={styles.brandMeta}>
            {profile?.product_category && (
              <span className={styles.metaChip}>
                <span className={styles.metaLabel}>Category</span>
                <span className={styles.metaValue}>
                  {profile.product_category.charAt(0).toUpperCase() + profile.product_category.slice(1)}
                </span>
              </span>
            )}
            {profile?.brand_tone && (
              <span className={styles.metaChip}>
                <span className={styles.metaLabel}>Voice</span>
                <span className={styles.metaValue}>
                  {profile.brand_tone.charAt(0).toUpperCase() + profile.brand_tone.slice(1)}
                </span>
              </span>
            )}
            {profile?.target_age_min && profile?.target_age_max && (
              <span className={styles.metaChip}>
                <span className={styles.metaLabel}>Audience</span>
                <span className={styles.metaValue}>
                  {profile.target_age_min}–{profile.target_age_max} yrs
                </span>
              </span>
            )}
            {profile?.instagram_handle && (
              <span className={styles.metaChip}>
                <span className={styles.metaLabel}>Instagram</span>
                <span className={styles.metaValue}>@{profile.instagram_handle}</span>
              </span>
            )}
          </div>
        </section>

        {/* Analyzer tools */}
        <section className={styles.toolsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Analyze content</h2>
            <p className={styles.sectionSubtitle}>
              Get AI insights on existing reels and your profile
            </p>
            {stats.totalAnalyses > 0 && (
              <Link href="/analyzer/history" className={styles.sectionLink}>
                View history ({stats.totalAnalyses})
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
          </div>

          <div className={styles.toolsGrid}>
            {analyzerTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className={`${styles.toolCard} ${styles[`tool_${tool.color}`]}`}
              >
                <div className={styles.toolIcon}>{tool.icon}</div>
                <h3 className={styles.toolTitle}>{tool.title}</h3>
                <p className={styles.toolDescription}>{tool.description}</p>
                <span className={styles.toolCta}>
                  Open
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Generator tools */}
        <section className={styles.toolsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Create content</h2>
            <p className={styles.sectionSubtitle}>
              Generate ready-to-post reels and static posts in seconds
            </p>
            {stats.totalPosts > 0 && (
              <Link href="/generator/library" className={styles.sectionLink}>
                My library ({stats.totalPosts})
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
          </div>

          <div className={styles.toolsGrid}>
            {generatorTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className={`${styles.toolCard} ${styles[`tool_${tool.color}`]}`}
              >
                <div className={styles.toolIcon}>{tool.icon}</div>
                <h3 className={styles.toolTitle}>{tool.title}</h3>
                <p className={styles.toolDescription}>{tool.description}</p>
                <span className={styles.toolCta}>
                  Open
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent activity */}
        {totalActivity > 0 && (
          <section className={styles.recentSection}>
            <h2 className={styles.sectionTitle}>Recent activity</h2>
            <div className={styles.recentGrid}>
              {stats.recentAnalyses.length > 0 && (
                <div className={styles.recentCol}>
                  <h3 className={styles.recentColTitle}>Latest analyses</h3>
                  <div className={styles.recentList}>
                    {stats.recentAnalyses.slice(0, 3).map((item) => (
                      <Link
                        key={item.id}
                        href="/analyzer/history"
                        className={styles.recentItem}
                      >
                        <div className={styles.recentDot} style={{
                          background: item.metrics?.type === 'profile_audit' ? '#ec4899' : '#8b5cf6'
                        }}></div>
                        <span className={styles.recentLabel}>
                          {item.metrics?.type === 'profile_audit' ? 'Profile audit' : 'Reel analysis'}
                        </span>
                        <span className={styles.recentScore}>{item.overall_score?.toFixed?.(1) || item.overall_score}/10</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {stats.recentPosts.length > 0 && (
                <div className={styles.recentCol}>
                  <h3 className={styles.recentColTitle}>Latest creations</h3>
                  <div className={styles.recentList}>
                    {stats.recentPosts.slice(0, 3).map((item) => (
                      <Link
                        key={item.id}
                        href="/generator/library"
                        className={styles.recentItem}
                      >
                        <div className={styles.recentDot} style={{
                          background: item.content_format === 'reel' ? '#8b5cf6' : '#ec4899'
                        }}></div>
                        <span className={styles.recentLabel}>
                          {item.content_format === 'reel' ? 'Reel' : 'Static post'}
                        </span>
                        <span className={styles.recentScore}>
                          {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
