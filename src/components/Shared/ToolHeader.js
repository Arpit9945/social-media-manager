'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo/Logo';
import styles from './ToolHeader.module.scss';

export default function ToolHeader({ user, profile, breadcrumb = [] }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.left}>
          <Link href="/dashboard" className={styles.logoLink}>
            <Logo size={26} textSize="md" />
          </Link>

          {breadcrumb.length > 0 && (
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <span className={styles.breadcrumbSep}>/</span>
              {breadcrumb.map((item, i) => (
                <span key={i} className={styles.breadcrumbItem}>
                  {item.href ? (
                    <Link href={item.href}>{item.label}</Link>
                  ) : (
                    <span className={styles.breadcrumbCurrent}>{item.label}</span>
                  )}
                  {i < breadcrumb.length - 1 && <span className={styles.breadcrumbSep}>/</span>}
                </span>
              ))}
            </nav>
          )}
        </div>

        <div className={styles.userMenu}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={styles.userButton}
            aria-label="Account menu"
          >
            {userAvatar ? (
              <img src={userAvatar} alt="" className={styles.avatar} referrerPolicy="no-referrer" />
            ) : (
              <div className={styles.avatarFallback}>{userName.charAt(0).toUpperCase()}</div>
            )}
          </button>

          {menuOpen && (
            <>
              <div className={styles.menuBackdrop} onClick={() => setMenuOpen(false)}></div>
              <div className={styles.menu}>
                <div className={styles.menuHeader}>
                  <p className={styles.menuName}>{userName}</p>
                  <p className={styles.menuEmail}>{user?.email}</p>
                </div>
                <Link href="/dashboard" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  Dashboard
                </Link>
                <Link href="/settings" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 1v2M8 13v2M15 8h-2M3 8H1M13.07 13.07l-1.41-1.41M4.34 4.34L2.93 2.93M13.07 2.93l-1.41 1.41M4.34 11.66l-1.41 1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Settings
                </Link>
                <div className={styles.menuDivider}></div>
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
  );
}
