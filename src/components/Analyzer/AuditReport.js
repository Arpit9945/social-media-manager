'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './AuditReport.module.scss';

export default function AuditReport({ audit, onNewAudit }) {
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

  if (!audit) return null;

  return (
    <div className={styles.report}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <span className={styles.label}>AUDIT COMPLETE</span>
            <h1 className={styles.title}>
              Niche: <span className={styles.gradient}>{audit.niche_identified}</span>
            </h1>
          </div>
          <div className={styles.scoreBadge}>
            <span className={styles.scoreNumber}>{audit.overall_score?.toFixed?.(1) || audit.overall_score}</span>
            <span className={styles.scoreOf}>/10</span>
          </div>
        </div>

        <div className={styles.positioningChip}>
          Positioning clarity: <strong>{audit.positioning_clarity}</strong>
        </div>

        <div className={styles.takeaway}>
          <span className={styles.takeawayLabel}>Key insight</span>
          <p className={styles.takeawayText}>{audit.key_takeaway}</p>
        </div>

        <div className={styles.actions}>
          <button onClick={onNewAudit} className={styles.actionBtn}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            New audit
          </button>
          <Link href="/analyzer/history" className={styles.actionBtn}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            History
          </Link>
        </div>
      </div>

      {/* Bio Analysis */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Bio Analysis</h2>
        <div className={styles.card}>
          <div className={styles.cardScore}>
            <span>Score</span>
            <strong>{audit.bio_analysis?.score}/10</strong>
          </div>
          
          <div className={styles.checks}>
            <div className={`${styles.check} ${audit.bio_analysis?.has_clear_value_prop ? styles.checkPass : styles.checkFail}`}>
              {audit.bio_analysis?.has_clear_value_prop ? '✓' : '✗'} Clear value proposition
            </div>
            <div className={`${styles.check} ${audit.bio_analysis?.has_cta ? styles.checkPass : styles.checkFail}`}>
              {audit.bio_analysis?.has_cta ? '✓' : '✗'} Has call-to-action
            </div>
          </div>

          {audit.bio_analysis?.issues?.length > 0 && (
            <div className={styles.issuesBlock}>
              <h4 className={styles.subTitle}>Issues to fix</h4>
              <ul className={styles.list}>
                {audit.bio_analysis.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.improvedBlock}>
            <div className={styles.improvedHeader}>
              <span className={styles.improvedLabel}>OPTIMIZED BIO</span>
              <button
                onClick={() => copyToClipboard(audit.bio_analysis?.improved_bio || '', 'bio')}
                className={styles.copyBtn}
              >
                {copiedField === 'bio' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className={styles.improvedText}>{audit.bio_analysis?.improved_bio}</p>
          </div>
        </div>
      </section>

      {/* Content Patterns */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Content Patterns</h2>
        <div className={styles.card}>
          <div className={styles.metaChips}>
            <span className={styles.chip}>
              Consistency: <strong>{audit.content_patterns?.consistency}</strong>
            </span>
            <span className={styles.chip}>
              Tone: <strong>{audit.content_patterns?.tone_consistency}</strong>
            </span>
          </div>

          {audit.content_patterns?.content_pillars_detected?.length > 0 && (
            <div className={styles.pillarsBlock}>
              <h4 className={styles.subTitle}>Detected content pillars</h4>
              <div className={styles.pillarsList}>
                {audit.content_patterns.content_pillars_detected.map((pillar, i) => (
                  <span key={i} className={styles.pillarChip}>{pillar}</span>
                ))}
              </div>
            </div>
          )}

          {audit.content_patterns?.common_themes?.length > 0 && (
            <div className={styles.pillarsBlock}>
              <h4 className={styles.subTitle}>Common themes</h4>
              <ul className={styles.list}>
                {audit.content_patterns.common_themes.map((theme, i) => (
                  <li key={i}>{theme}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Pillars */}
      {audit.recommended_pillars?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recommended Content Pillars</h2>
          <div className={styles.pillarsGrid}>
            {audit.recommended_pillars.map((pillar, i) => (
              <div key={i} className={styles.pillarCard}>
                <div className={styles.pillarHeader}>
                  <span className={styles.pillarNum}>{i + 1}</span>
                  <h3 className={styles.pillarName}>{pillar.name}</h3>
                </div>
                <p className={styles.pillarDesc}>{pillar.description}</p>
                {pillar.post_ideas?.length > 0 && (
                  <div className={styles.ideasBlock}>
                    <span className={styles.ideasLabel}>POST IDEAS</span>
                    <ul className={styles.list}>
                      {pillar.post_ideas.map((idea, j) => (
                        <li key={j}>{idea}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hashtag Strategy */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Hashtag Strategy</h2>
        <div className={styles.card}>
          <div className={styles.metaChips}>
            <span className={styles.chip}>
              Pool size: <strong>{audit.hashtag_strategy?.recommended_pool_size}</strong>
            </span>
            <span className={styles.chip}>
              Mix: <strong>{audit.hashtag_strategy?.mix_recommendation}</strong>
            </span>
          </div>

          <div className={styles.improvedBlock}>
            <div className={styles.improvedHeader}>
              <span className={styles.improvedLabel}>STARTER HASHTAGS</span>
              <button
                onClick={() => copyToClipboard(audit.hashtag_strategy?.starter_hashtags || '', 'hashtags')}
                className={styles.copyBtn}
              >
                {copiedField === 'hashtags' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className={styles.improvedText} style={{ wordBreak: 'break-word' }}>
              {audit.hashtag_strategy?.starter_hashtags}
            </p>
          </div>
        </div>
      </section>

      {/* Optimization Checklist */}
      {audit.optimization_checklist?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Optimization Checklist</h2>
          <div className={styles.checklist}>
            {audit.optimization_checklist.map((item, i) => (
              <div key={i} className={`${styles.checklistItem} ${styles[`priority_${item.priority}`]}`}>
                <span className={`${styles.priorityBadge} ${styles[`badge_${item.priority}`]}`}>
                  {item.priority}
                </span>
                <div>
                  <p className={styles.taskText}>{item.task}</p>
                  <p className={styles.whyText}>{item.why}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Growth Strategy */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Growth Strategy</h2>
        <div className={styles.card}>
          <div className={styles.focusBlock}>
            <span className={styles.focusLabel}>PRIMARY FOCUS</span>
            <p className={styles.focusText}>{audit.growth_strategy?.primary_focus}</p>
          </div>

          {audit.growth_strategy?.weekly_action_plan?.length > 0 && (
            <div className={styles.planBlock}>
              <h4 className={styles.subTitle}>Weekly action plan</h4>
              <div className={styles.planList}>
                {audit.growth_strategy.weekly_action_plan.map((action, i) => (
                  <div key={i} className={styles.planItem}>
                    <span className={styles.planNum}>{i + 1}</span>
                    <p>{action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {audit.growth_strategy?.expected_results_30_days && (
            <div className={styles.expectationBlock}>
              <span className={styles.expectationLabel}>EXPECTED RESULTS (30 DAYS)</span>
              <p className={styles.expectationText}>{audit.growth_strategy.expected_results_30_days}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
