'use client';

import { useState } from 'react';
import styles from './FAQ.module.scss';

const faqs = [
  {
    q: 'Is this really 100% free?',
    a: 'Yes, completely. No credit card, no trial limit, no hidden tiers. Built using free AI APIs (Groq, Gemini) and free hosting (Vercel) — so it costs us nothing to run, and we pass that on to you.',
  },
  {
    q: 'Can it actually analyze any Instagram reel?',
    a: 'You paste the public reel link and AI analyzes the thumbnail, caption, and hashtags. For engagement metrics (views, likes), Instagram restricts public access — you can manually enter those numbers for deeper analysis. Profile audits work for any public account.',
  },
  {
    q: 'Will the generated posts look professional?',
    a: 'We use a hybrid approach: pre-built professional templates designed by humans + AI customization. Just upload your logo and product image. Output is ready-to-post, 1080x1080 or 1080x1350, optimized for Instagram.',
  },
  {
    q: 'How accurate is the viral prediction?',
    a: 'No tool can guarantee virality — anyone claiming so is lying. What ASMA does is analyze patterns from successful content and give you data-driven suggestions on hooks, hashtags, posting times, and content gaps. It improves your odds, not promises.',
  },
  {
    q: 'Will my data be safe?',
    a: 'Absolutely. We use Supabase for secure data storage with row-level security. Your brand info, generated posts, and analyses stay private to your account. We don\'t sell data or run ads.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes. The entire app is mobile-first. You can analyze reels, generate captions, and create posts directly from your phone — perfect for creators on the go.',
  },
  {
    q: 'Will it auto-post to my Instagram?',
    a: 'Not yet. Auto-posting requires Instagram\'s paid Business API approval. For now, you download the posts and copy captions to post manually. We\'re exploring this for a future update.',
  },
  {
    q: 'Who built this and why?',
    a: 'Built by Arpit, a developer passionate about helping creators and small businesses grow without expensive tools. The mission: democratize professional-grade social media tools for everyone.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>FAQ</span>
          <h2 className={styles.title}>
            Questions, <span className={styles.gradient}>answered</span>.
          </h2>
        </div>

        <div className={styles.list}>
          {faqs.map((faq, index) => (
            <div
              key={faq.q}
              className={`${styles.item} ${openIndex === index ? styles.itemOpen : ''}`}
            >
              <button
                className={styles.question}
                onClick={() => toggle(index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.q}</span>
                <span className={styles.icon} aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M5 7l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <div className={styles.answer}>
                <div className={styles.answerInner}>
                  <p>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
