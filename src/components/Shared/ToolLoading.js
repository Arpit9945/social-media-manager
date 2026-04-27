'use client';

import styles from './ToolLoading.module.scss';

export default function ToolLoading({ variant = 'editor' }) {
  return (
    <div className={styles.page}>
      {/* Header skeleton */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.skelLogo}></div>
        </div>
        <div className={styles.skelAvatar}></div>
      </div>

      {/* Content skeleton */}
      <div className={styles.main}>
        <div className={styles.titleBlock}>
          <div className={styles.skelEyebrow}></div>
          <div className={styles.skelTitle}></div>
          <div className={styles.skelSubtitle}></div>
        </div>

        {variant === 'grid' && (
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skelCard} style={{ animationDelay: `${i * 60}ms` }}>
                <div className={styles.skelImage}></div>
                <div className={styles.skelLine}></div>
                <div className={styles.skelLineShort}></div>
              </div>
            ))}
          </div>
        )}

        {variant === 'editor' && (
          <div className={styles.editorGrid}>
            <div className={styles.formCol}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={styles.skelField} style={{ animationDelay: `${i * 80}ms` }}>
                  <div className={styles.skelLabel}></div>
                  <div className={styles.skelInput}></div>
                </div>
              ))}
            </div>
            <div className={styles.previewCol}>
              <div className={styles.skelPreview}></div>
            </div>
          </div>
        )}

        {variant === 'list' && (
          <div className={styles.list}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.skelRow} style={{ animationDelay: `${i * 60}ms` }}>
                <div className={styles.skelRowLeft}>
                  <div className={styles.skelTag}></div>
                  <div className={styles.skelLines}>
                    <div className={styles.skelLine}></div>
                    <div className={styles.skelLineShort}></div>
                  </div>
                </div>
                <div className={styles.skelChip}></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
