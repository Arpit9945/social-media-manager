'use client';

import { useState } from 'react';
import ToolHeader from '@/components/Shared/ToolHeader';
import AnalysisReport from './AnalysisReport';
import styles from './ReelAnalyzer.module.scss';

export default function ReelAnalyzer({ user, profile }) {
  const [step, setStep] = useState('input'); // 'input' | 'analyzing' | 'result'
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [savedId, setSavedId] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    reel_url: '',
    caption: '',
    hashtags: '',
    metrics: {
      views: '',
      likes: '',
      comments: '',
      shares: '',
    },
  });

  // Try to auto-extract hashtags from caption when user pastes
  const extractHashtags = (text) => {
    const matches = text.match(/#[\w\u0900-\u097F]+/g);
    return matches ? matches.join(' ') : '';
  };

  const handleCaptionChange = (e) => {
    const newCaption = e.target.value;
    // Auto-extract hashtags only if hashtag field is empty
    const extracted = extractHashtags(newCaption);
    setFormData((prev) => ({
      ...prev,
      caption: newCaption,
      hashtags: prev.hashtags || extracted,
    }));
  };

  const handleAnalyze = async () => {
    if (!formData.caption.trim()) {
      setError('Caption zaruri hai analyze karne ke liye');
      return;
    }

    if (formData.caption.trim().length < 10) {
      setError('Caption thoda detail mein daalo (at least 10 characters)');
      return;
    }

    setError('');
    setStep('analyzing');

    try {
      const response = await fetch('/api/analyze-reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reel_url: formData.reel_url.trim() || null,
          caption: formData.caption.trim(),
          hashtags: formData.hashtags.trim(),
          metrics: {
            views: formData.metrics.views ? parseInt(formData.metrics.views) : undefined,
            likes: formData.metrics.likes ? parseInt(formData.metrics.likes) : undefined,
            comments: formData.metrics.comments ? parseInt(formData.metrics.comments) : undefined,
            shares: formData.metrics.shares ? parseInt(formData.metrics.shares) : undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysis(data.analysis);
      setSavedId(data.saved_id);
      setStep('result');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Kuch problem hui. Phir se try karo.');
      setStep('input');
    }
  };

  const handleNewAnalysis = () => {
    setStep('input');
    setAnalysis(null);
    setError('');
    setFormData({
      reel_url: '',
      caption: '',
      hashtags: '',
      metrics: { views: '', likes: '', comments: '', shares: '' },
    });
  };

  return (
    <div className={styles.page}>
      <ToolHeader
        user={user}
        profile={profile}
        breadcrumb={[
          { label: 'Analyzer', href: '/dashboard' },
          { label: 'Reel Analysis' },
        ]}
      />

      <main className={styles.main}>
        {step === 'input' && (
          <div className={styles.inputView}>
            <div className={styles.titleBlock}>
              <span className={styles.eyebrow}>REEL ANALYZER</span>
              <h1 className={styles.title}>
                Get AI insights on any <span className={styles.gradient}>Instagram reel</span>
              </h1>
              <p className={styles.subtitle}>
                Paste reel details below — get hook strength, caption analysis, hashtag quality,
                viral potential, and a rewritten improved version.
              </p>
            </div>

            <div className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="reel_url" className={styles.label}>
                  Reel URL <span className={styles.optional}>(optional)</span>
                </label>
                <input
                  id="reel_url"
                  type="url"
                  value={formData.reel_url}
                  onChange={(e) => setFormData({ ...formData, reel_url: e.target.value })}
                  placeholder="https://instagram.com/reel/..."
                  className={styles.input}
                />
                <p className={styles.helpText}>For your reference only — we don&apos;t fetch from Instagram</p>
              </div>

              <div className={styles.field}>
                <label htmlFor="caption" className={styles.label}>
                  Caption <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="caption"
                  value={formData.caption}
                  onChange={handleCaptionChange}
                  placeholder="Paste the full caption here. Hashtags will be auto-detected."
                  className={styles.textarea}
                  rows={6}
                  maxLength={2500}
                />
                <p className={styles.helpText}>
                  {formData.caption.length} / 2500 characters
                </p>
              </div>

              <div className={styles.field}>
                <label htmlFor="hashtags" className={styles.label}>
                  Hashtags <span className={styles.optional}>(auto-detected)</span>
                </label>
                <textarea
                  id="hashtags"
                  value={formData.hashtags}
                  onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                  placeholder="#hashtag1 #hashtag2 #hashtag3"
                  className={styles.textarea}
                  rows={2}
                  maxLength={1000}
                />
              </div>

              <details className={styles.advancedToggle}>
                <summary className={styles.advancedSummary}>
                  <span>Add metrics</span>
                  <span className={styles.summaryHelp}>(optional, for deeper analysis)</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.toggleIcon}>
                    <path d="M5 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>

                <div className={styles.metricsGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>Views</label>
                    <input
                      type="number"
                      value={formData.metrics.views}
                      onChange={(e) => setFormData({
                        ...formData,
                        metrics: { ...formData.metrics, views: e.target.value },
                      })}
                      placeholder="e.g., 12500"
                      className={styles.input}
                      min="0"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Likes</label>
                    <input
                      type="number"
                      value={formData.metrics.likes}
                      onChange={(e) => setFormData({
                        ...formData,
                        metrics: { ...formData.metrics, likes: e.target.value },
                      })}
                      placeholder="e.g., 850"
                      className={styles.input}
                      min="0"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Comments</label>
                    <input
                      type="number"
                      value={formData.metrics.comments}
                      onChange={(e) => setFormData({
                        ...formData,
                        metrics: { ...formData.metrics, comments: e.target.value },
                      })}
                      placeholder="e.g., 45"
                      className={styles.input}
                      min="0"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Shares</label>
                    <input
                      type="number"
                      value={formData.metrics.shares}
                      onChange={(e) => setFormData({
                        ...formData,
                        metrics: { ...formData.metrics, shares: e.target.value },
                      })}
                      placeholder="e.g., 12"
                      className={styles.input}
                      min="0"
                    />
                  </div>
                </div>
              </details>

              {error && (
                <div className={styles.error} role="alert">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 5v3m0 2v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {error}
                </div>
              )}

              <button onClick={handleAnalyze} className={styles.analyzeBtn}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8l3 3 9-9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Analyze with AI
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
                  <path d="M16 4l3 9h9l-7.5 5.5L23 28l-7-5.5L9 28l2.5-9.5L4 13h9z" stroke="url(#loading-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="loading-grad" x1="0" y1="0" x2="32" y2="32">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <h2 className={styles.loadingTitle}>Analyzing your reel...</h2>
            <p className={styles.loadingSteps}>
              <span className={styles.loadingStep}>Reading caption structure</span>
              <span className={styles.loadingStep}>Evaluating hook strength</span>
              <span className={styles.loadingStep}>Checking hashtag quality</span>
              <span className={styles.loadingStep}>Calculating viral potential</span>
              <span className={styles.loadingStep}>Generating improvements</span>
            </p>
          </div>
        )}

        {step === 'result' && analysis && (
          <AnalysisReport
            analysis={analysis}
            originalCaption={formData.caption}
            originalHashtags={formData.hashtags}
            onNewAnalysis={handleNewAnalysis}
          />
        )}
      </main>
    </div>
  );
}
