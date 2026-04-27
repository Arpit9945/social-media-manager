import Link from 'next/link';
import Logo from '@/components/Logo/Logo';
import styles from './Footer.module.scss';

export default function Footer() {
  const year = new Date().getFullYear();

  const sections = [
    {
      title: 'Product',
      links: [
        { href: '#features', label: 'Features' },
        { href: '#how-it-works', label: 'How it works' },
        { href: '#pricing', label: 'Pricing' },
        { href: '/login', label: 'Get started' },
      ],
    },
    {
      title: 'Tools',
      links: [
        { href: '/login', label: 'Reel Analyzer' },
        { href: '/login', label: 'Post Generator' },
        { href: '/login', label: 'Caption Generator' },
        { href: '/login', label: 'Hashtag Finder' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { href: '#faq', label: 'FAQ' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/contact', label: 'Contact' },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink}>
              <Logo size={32} textSize="lg" />
            </Link>
            <p className={styles.tagline}>
              AI Social Media Assistant by Arpit. Free AI-powered tools to grow your Instagram presence.
            </p>
          </div>

          <div className={styles.linksGrid}>
            {sections.map((section) => (
              <div key={section.title} className={styles.linkColumn}>
                <h3 className={styles.columnTitle}>{section.title}</h3>
                <ul className={styles.linkList}>
                  {section.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className={styles.link}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} AI Social Media Assistant by Arpit. All rights reserved.
          </p>
          <p className={styles.madeWith}>
            Made with <span className={styles.heart}>♥</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
