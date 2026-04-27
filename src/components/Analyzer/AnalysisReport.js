'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './AnalysisReport.module.scss';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'hook', label: 'Hook' },
  { id: 'caption', label: 'Caption' },
  { id: 'hashtags', label: 'Hashtags' },
  { id: 'improved', label: 'Improved Version' },
  { id: 'actions', label: 'Action Items' },
];

function ScoreBadge({ score, size = 'md' }) {
  const getColor = (s) => {
    if (s >= 8) return 'green';
    if (s >= 6) return 'yellow';
    return 'red';
  };

  return (
    <div className={`${styles.scoreBadge} ${styles[`scoreBadge_${size}`]} ${styles[`score_${getColor(score)}`]}`}>
      <span className={styles.scoreNumber}>{score?.toFixed?.(1) || score}</span>
      <span className={styles.scoreOf}>/10</span>
    </div>
  );
}

function ScoreBar({ value, max = 10, color = 'violet' }) {
  const percent = (value / max) * 100;
  return (
    <div className={styles.scoreBar}>
      <div
        className={`${styles.scoreFill} ${styles[`fill_${color}`]}`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
}

export default function AnalysisReport({ analysis, originalCaption, originalHashtags, onNewAnalysis }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  if (!analysis) return null;

  return (
    <div className={styles.report}>
      {/* Header with overall score */}
      <div className={styles.reportHeader}>
        <div className={styles.headerTop}>
          <div>
            <span className={styles.reportLabel}>ANALYSIS COMPLETE</span>
            <h1 className={styles.reportTitle}>{analysis.verdict || 'Your reel analysis'}</h1>
          </div>
          <ScoreBadge score={analysis.overall_score} size="lg" />
        </div>

        <div className={styles.keyTakeaway}>
          <span className={styles.takeawayLabel}>Key takeaway</span>
          <p className={styles.takeawayText}>{analysis.key_takeaway}</p>
        </div>

        <div className={styles.reportActions}>
          <button onClick={onNewAnalysis} className={styles.newBtn}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            New analysis
          </button>
          <Link href="/analyzer/history" className={styles.historyBtn}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            View history
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsWrapper}>
        <nav className={styles.tabs} aria-label="Analysis sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.overviewTab}>
            <div className={styles.viralCard}>
              <div className={styles.viralHeader}>
                <div>
                  <span className={styles.cardLabel}>VIRAL POTENTIAL</span>
                  <h3 className={styles.cardTitle}>How likely is this to go viral?</h3>
                </div>
                <ScoreBadge score={analysis.viral_potential?.score || 0} />
              </div>
              <p className={styles.viralReasoning}>{analysis.viral_potential?.reasoning}</p>

              <div className={styles.factorsGrid}>
                {analysis.viral_potential?.factors && Object.entries(analysis.viral_potential.factors).map(([key, value]) => (
                  <div key={key} className={styles.factor}>
                    <div className={styles.factorHeader}>
                      <span className={styles.factorLabel}>
                        {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                      <span className={styles.factorValue}>{value}/10</span>
                    </div>
                    <ScoreBar value={value} color={value >= 7 ? 'green' : value >= 5 ? 'yellow' : 'red'} />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <span className={styles.summaryIcon}>🎯</span>
                <span className={styles.summaryLabel}>Hook</span>
                <span className={styles.summaryScore}>{analysis.hook_analysis?.score}/10</span>
                <span className={styles.summaryStatus}>{analysis.hook_analysis?.strength}</span>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.summaryIcon}>📝</span>
                <span className={styles.summaryLabel}>Caption</span>
                <span className={styles.summaryScore}>{analysis.caption_analysis?.score}/10</span>
                <span className={styles.summaryStatus}>{analysis.caption_analysis?.length_assessment}</span>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.summaryIcon}>#️⃣</span>
                <span className={styles.summaryLabel}>Hashtags</span>
                <span className={styles.summaryScore}>{analysis.hashtag_analysis?.score}/10</span>
                <span className={styles.summaryStatus}>{analysis.hashtag_analysis?.mix_quality}</span>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.summaryIcon}>⏰</span>
                <span className={styles.summaryLabel}>Best time</span>
                <span className={styles.summaryStatus} style={{ marginTop: '8px', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                  {analysis.best_time_suggestion}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hook' && (
          <div className={styles.detailTab}>
            <div className={styles.detailHeader}>
              <h3 className={styles.detailTitle}>Hook Analysis</h3>
              <ScoreBadge score={analysis.hook_analysis?.score || 0} />
            </div>
            <div className={styles.statusChip}>
              Strength: <strong>{analysis.hook_analysis?.strength}</strong>
            </div>
            <div className={styles.detailSection}>
              <h4 className={styles.detailSubtitle}>What works ✅</h4>
              <p className={styles.detailText}>{analysis.hook_analysis?.what_works}</p>
            </div>
            <div className={styles.detailSection}>
              <h4 className={styles.detailSubtitle}>What to improve 🎯</h4>
              <p className={styles.detailText}>{analysis.hook_analysis?.what_to_improve}</p>
            </div>
          </div>
        )}

        {activeTab === 'caption' && (
          <div className={styles.detailTab}>
            <div className={styles.detailHeader}>
              <h3 className={styles.detailTitle}>Caption Analysis</h3>
              <ScoreBadge score={analysis.caption_analysis?.score || 0} />
            </div>

            <div className={styles.metaChips}>
              <span className={styles.statusChip}>
                Length: <strong>{analysis.caption_analysis?.length_assessment}</strong>
              </span>
              <span className={styles.statusChip}>
                Emotional hook: <strong>{analysis.caption_analysis?.emotional_hook}</strong>
              </span>
              <span className={styles.statusChip}>
                CTA: <strong>{analysis.caption_analysis?.cta_present ? 'Present ✓' : 'Missing ✗'}</strong>
              </span>
            </div>

            {analysis.caption_analysis?.strengths?.length > 0 && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailSubtitle}>Strengths ✅</h4>
                <ul className={styles.bulletList}>
                  {analysis.caption_analysis.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.caption_analysis?.issues?.length > 0 && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailSubtitle}>Issues to fix ⚠️</h4>
                <ul className={styles.bulletList}>
                  {analysis.caption_analysis.issues.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hashtags' && (
          <div className={styles.detailTab}>
            <div className={styles.detailHeader}>
              <h3 className={styles.detailTitle}>Hashtag Analysis</h3>
              <ScoreBadge score={analysis.hashtag_analysis?.score || 0} />
            </div>

            <div className={styles.metaChips}>
              <span className={styles.statusChip}>
                Count: <strong>{analysis.hashtag_analysis?.count || 0}</strong>
              </span>
              <span className={styles.statusChip}>
                Mix quality: <strong>{analysis.hashtag_analysis?.mix_quality}</strong>
              </span>
            </div>

            {analysis.hashtag_analysis?.issues?.length > 0 && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailSubtitle}>Issues ⚠️</h4>
                <ul className={styles.bulletList}>
                  {analysis.hashtag_analysis.issues.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.hashtag_analysis?.suggestions?.length > 0 && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailSubtitle}>Better hashtag ideas 💡</h4>
                <ul className={styles.bulletList}>
                  {analysis.hashtag_analysis.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'improved' && (
          <div className={styles.detailTab}>
            <h3 className={styles.detailTitle}>Improved Version</h3>
            <p className={styles.detailDescription}>
              AI-rewritten version with stronger hook, clearer CTA, and better hashtag mix.
            </p>

            <div className={styles.improvedCard}>
              <div className={styles.improvedHeader}>
                <span className={styles.improvedLabel}>NEW CAPTION</span>
                <button
                  onClick={() => copyToClipboard(analysis.improved_caption, 'caption')}
                  className={styles.copyBtn}
                >
                  {copiedField === 'caption' ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
                        <path d="M5 1h6a2 2 0 012 2v6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className={styles.improvedText}>{analysis.improved_caption}</p>
            </div>

            <div className={styles.improvedCard}>
              <div className={styles.improvedHeader}>
                <span className={styles.improvedLabel}>NEW HASHTAGS</span>
                <button
                  onClick={() => copyToClipboard(analysis.improved_hashtags, 'hashtags')}
                  className={styles.copyBtn}
                >
                  {copiedField === 'hashtags' ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
                        <path d="M5 1h6a2 2 0 012 2v6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className={styles.improvedText} style={{ wordBreak: 'break-word' }}>
                {analysis.improved_hashtags}
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(`${analysis.improved_caption}\n\n${analysis.improved_hashtags}`, 'all')}
              className={styles.copyAllBtn}
            >
              {copiedField === 'all' ? '✓ Copied caption + hashtags' : 'Copy caption + hashtags together'}
            </button>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className={styles.detailTab}>
            <h3 className={styles.detailTitle}>Prioritized Action Items</h3>
            <p className={styles.detailDescription}>
              Specific things to do — sorted by priority.
            </p>

            <div className={styles.actionsList}>
              {analysis.improvements?.map((item, i) => (
                <div key={i} className={`${styles.actionCard} ${styles[`priority_${item.priority}`]}`}>
                  <div className={styles.actionHeader}>
                    <span className={`${styles.priorityBadge} ${styles[`badge_${item.priority}`]}`}>
                      {item.priority}
                    </span>
                    <span className={styles.actionArea}>{item.area?.replace(/_/g, ' ')}</span>
                  </div>
                  <p className={styles.actionText}>{item.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
