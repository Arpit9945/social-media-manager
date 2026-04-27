'use client';

import { useEffect, useRef } from 'react';
import { getDefaultData } from './templates';
import styles from './TemplatePicker.module.scss';

function TemplateCard({ template, brandProfile, onPick }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = getDefaultData(template, brandProfile);

    // Render static preview at 80% progress (rich state)
    if (template.renderStatic) {
      template.renderStatic(ctx, data);
    } else {
      template.render(ctx, 360, 450, 0.8, data);
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
