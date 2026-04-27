'use client';

import { useEffect, useRef } from 'react';
import { renderStaticFrame, loadLogo } from '@/lib/reel/canvasEngine';
import { getDefaultData } from './templates';
import styles from './TemplatePicker.module.scss';

function TemplateCard({ template, brandProfile, onPick }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = getDefaultData(template, brandProfile);

    // Render once immediately (without logo, in case logo is slow/missing)
    renderStaticFrame(ctx, template, data);

    // If a logo is configured, preload it then re-render so it appears
    if (data.logoUrl && data.showLogo !== false) {
      let cancelled = false;
      loadLogo(data.logoUrl).then((img) => {
        if (cancelled || !img) return;
        // Re-render with logo now in cache
        renderStaticFrame(ctx, template, data);
      });
      return () => {
        cancelled = true;
      };
    }
  }, [template, brandProfile]);

  return (
    <button onClick={() => onPick(template)} className={styles.card}>
      <div className={styles.cardPreview}>
        <canvas
          ref={canvasRef}
          width={1080}
          height={1920}
          className={styles.canvas}
        />
        <div className={styles.cardOverlay}>
          <span className={styles.useBtn}>
            Use template
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>
      <div className={styles.cardInfo}>
        <span className={styles.cardCategory}>{template.category}</span>
        <h3 className={styles.cardName}>{template.name}</h3>
        <p className={styles.cardDesc}>{template.description}</p>
      </div>
    </button>
  );
}

export default function TemplatePicker({ templates, brandProfile, onPick }) {
  return (
    <div className={styles.grid}>
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          brandProfile={brandProfile}
          onPick={onPick}
        />
      ))}
    </div>
  );
}
