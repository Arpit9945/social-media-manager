'use client';

import styles from './Step.module.scss';

const TONES = [
  {
    id: 'casual',
    label: 'Casual & Friendly',
    description: 'Conversational, warm, like talking to a friend',
    example: '"Heyy! Just dropped these new pieces 🌸 Tell me what you think"',
  },
  {
    id: 'professional',
    label: 'Professional & Polished',
    description: 'Formal, expertise-driven, business tone',
    example: '"Introducing our latest collection — crafted with precision."',
  },
  {
    id: 'luxury',
    label: 'Luxury & Premium',
    description: 'Sophisticated, exclusive, high-end feel',
    example: '"An ode to timeless elegance. Available now, in limited numbers."',
  },
  {
    id: 'playful',
    label: 'Playful & Fun',
    description: 'Witty, humorous, meme-friendly',
    example: '"POV: you found the cutest pottery and now your bank account is crying"',
  },
  {
    id: 'inspiring',
    label: 'Inspiring & Bold',
    description: 'Motivational, empowering, action-driven',
    example: '"You don\'t need permission to start. Just begin."',
  },
];

export default function StepVoice({ data, updateData }) {
  return (
    <div className={styles.step}>
      <div className={styles.stepBadge}>Brand voice</div>
      <h1 className={styles.title}>How should AI sound?</h1>
      <p className={styles.description}>
        Pick the tone that matches your brand. Yeh voice har caption aur post mein use hogi.
      </p>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>
            Brand tone <span className={styles.required}>*</span>
          </label>
          <div className={styles.toneList}>
            {TONES.map((tone) => (
              <button
                key={tone.id}
                onClick={() => updateData({ brand_tone: tone.id })}
                className={`${styles.toneBtn} ${
                  data.brand_tone === tone.id ? styles.toneSelected : ''
                }`}
              >
                <div className={styles.toneHeader}>
                  <span className={styles.toneLabel}>{tone.label}</span>
                  <span className={styles.toneCheck}>
                    {data.brand_tone === tone.id && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </div>
                <p className={styles.toneDescription}>{tone.description}</p>
                <p className={styles.toneExample}>{tone.example}</p>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="instagram_handle" className={styles.label}>
            Instagram handle <span className={styles.optional}>(optional)</span>
          </label>
          <div className={styles.handleInput}>
            <span className={styles.handlePrefix}>@</span>
            <input
              id="instagram_handle"
              type="text"
              value={data.instagram_handle}
              onChange={(e) => updateData({ instagram_handle: e.target.value.replace(/^@/, '').replace(/[^a-zA-Z0-9._]/g, '') })}
              placeholder="yourbrand"
              className={styles.input}
              maxLength={30}
            />
          </div>
          <p className={styles.helpText}>
            Not required. Just helps personalize generated content with your handle.
          </p>
        </div>
      </div>

      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>You're all set!</h3>
        <p className={styles.summaryText}>
          Click "Complete setup" below and your dashboard will be ready.
        </p>
      </div>
    </div>
  );
}
