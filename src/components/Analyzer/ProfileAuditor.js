'use client';

import { useState } from 'react';
import ToolHeader from '@/components/Shared/ToolHeader';
import AuditReport from './AuditReport';
import styles from './ProfileAuditor.module.scss';

export default function ProfileAuditor({ user, profile }) {
  const [step, setStep] = useState('input');
  const [error, setError] = useState('');
  const [audit, setAudit] = useState(null);

  const [formData, setFormData] = useState({
    handle: profile?.instagram_handle || '',
    bio: '',
    captions: ['', '', ''],
  });

  const updateCaption = (index, value) => {
    const newCaptions = [...formData.captions];
    newCaptions[index] = value;
    setFormData({ ...formData, captions: newCaptions });
  };

  const addCaption = () => {
    if (formData.captions.length < 8) {
      setFormData({ ...formData, captions: [...formData.captions, ''] });
    }
  };

  const removeCaption = (index) => {
    if (formData.captions.length > 1) {
      setFormData({
        ...formData,
        captions: formData.captions.filter((_, i) => i !== index),
      });
    }
  };

  const handleAudit = async () => {
    if (!formData.bio.trim()) {
      setError('Bio zaruri hai audit ke liye');
      return;
    }

    if (formData.bio.trim().length < 20) {
      setError('Bio thoda detail mein paste karo');
      return;
    }

    setError('');
    setStep('analyzing');

    try {
      const response = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: formData.handle.trim(),
          bio: formData.bio.trim(),
          recentCaptions: formData.captions.filter((c) => c.trim()),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Audit failed');
      }

      setAudit(data.audit);
      setStep('result');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Kuch problem hui. Phir se try karo.');
      setStep('input');
    }
  };

  const handleNewAudit = () => {
    setStep('input');
    setAudit(null);
    setError('');
    setFormData({
      handle: profile?.instagram_handle || '',
      bio: '',
      captions: ['', '', ''],
    });
  };

  return (
    <div className={styles.page}>
      <ToolHeader
        user={user}
        profile={profile}
        breadcrumb={[
          { label: 'Analyzer', href: '/dashboard' },
          { label: 'Profile Audit' },
        ]}
      />

      <main className={styles.main}>
        {step === 'input' && (
          <div className={styles.inputView}>
            <div className={styles.titleBlock}>
              <span className={styles.eyebrow}>PROFILE AUDIT</span>
              <h1 className={styles.title}>
                Strategic insights for your <span className={styles.gradient}>Instagram profile</span>
              </h1>
              <p className={styles.subtitle}>
                Paste your bio + 3-5 recent captions. Get positioning analysis, content pillar
                suggestions, and a personalized growth plan.
              </p>
            </div>

            <div className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="handle" className={styles.label}>
                  Instagram handle <span className={styles.optional}>(optional)</span>
                </label>
                <div className={styles.handleInput}>
                  <span className={styles.handlePrefix}>@</span>
                  <input
                    id="handle"
                    type="text"
                    value={formData.handle}
                    onChange={(e) => setFormData({
                      ...formData,
                      handle: e.target.value.replace(/^@/, '').replace(/[^a-zA-Z0-9._]/g, ''),
                    })}
                    placeholder="yourbrand"
                    className={styles.input}
                    maxLength={30}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="bio" className={styles.label}>
                  Profile bio <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Paste your full Instagram bio here, including emojis and links..."
                  className={styles.textarea}
                  rows={5}
                  maxLength={500}
                />
                <p className={styles.helpText}>
                  {formData.bio.length} / 500 characters
                </p>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Recent captions <span className={styles.optional}>(at least 3 recommended)</span>
                </label>
                <p className={styles.helpText} style={{ marginBottom: '8px' }}>
                  Paste 3-5 of your recent post captions for content pattern analysis.
                </p>

                <div className={styles.captionsList}>
                  {formData.captions.map((caption, index) => (
                    <div key={index} className={styles.captionRow}>
                      <span className={styles.captionNumber}>#{index + 1}</span>
                      <textarea
                        value={caption}
                        onChange={(e) => updateCaption(index, e.target.value)}
                        placeholder={`Caption ${index + 1}...`}
                        className={styles.captionTextarea}
                        rows={3}
                        maxLength={1500}
                      />
                      {formData.captions.length > 1 && (
                        <button
                          onClick={() => removeCaption(index)}
                          className={styles.removeBtn}
                          aria-label="Remove caption"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {formData.captions.length < 8 && (
                  <button onClick={addCaption} className={styles.addBtn}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                    Add another caption
                  </button>
                )}
              </div>

              {error && (
                <div className={styles.error} role="alert">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 5v3m0 2v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {error}
                </div>
              )}

              <button onClick={handleAudit} className={styles.auditBtn}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8l3 3 9-9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Run profile audit
              </button>
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className={styles.loadingView}>
            <div className={styles.loadingAnimation}>
              <div className={styles.pulseRing}></div>
              <div className={styles.pulseRing}></div>
              <div className={styles.pulseRing}></div>
              <div className={styles.loadingCore}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="12" stroke="url(#audit-grad)" strokeWidth="2" />
                  <path d="M11 16l4 4 8-8" stroke="url(#audit-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="audit-grad" x1="0" y1="0" x2="32" y2="32">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <h2 className={styles.loadingTitle}>Auditing your profile...</h2>
            <p className={styles.loadingSteps}>
              <span className={styles.loadingStep}>Analyzing bio positioning</span>
              <span className={styles.loadingStep}>Detecting content patterns</span>
              <span className={styles.loadingStep}>Identifying niche</span>
              <span className={styles.loadingStep}>Building growth strategy</span>
              <span className={styles.loadingStep}>Generating action plan</span>
            </p>
          </div>
        )}

        {step === 'result' && audit && (
          <AuditReport audit={audit} onNewAudit={handleNewAudit} />
        )}
      </main>
    </div>
  );
}
