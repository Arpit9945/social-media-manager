import Link from 'next/link';
import Logo from '@/components/Logo/Logo';
import LoginForm from '@/components/Auth/LoginForm';
import styles from './login.module.scss';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to AI Social Media Assistant by Arpit. Access your dashboard, generate posts, and grow your Instagram with AI.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} aria-hidden="true"></div>
      
      <Link href="/" className={styles.logoLink}>
        <Logo size={32} textSize="md" />
      </Link>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>
              Sign in to continue growing your Instagram with AI
            </p>
          </div>

          <LoginForm />

          <div className={styles.footer}>
            <p className={styles.terms}>
              By continuing, you agree to our{' '}
              <Link href="/terms">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        <Link href="/" className={styles.backLink}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to home
        </Link>
      </main>
    </div>
  );
}
