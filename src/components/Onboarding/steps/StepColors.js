'use client';

import styles from './Step.module.scss';

const PRESETS = [
  { name: 'Violet Pink', primary: '#8b5cf6', secondary: '#ec4899' },
  { name: 'Ocean Blue', primary: '#3b82f6', secondary: '#06b6d4' },
  { name: 'Forest Green', primary: '#10b981', secondary: '#14b8a6' },
  { name: 'Sunset', primary: '#f59e0b', secondary: '#ef4444' },
  { name: 'Royal Purple', primary: '#7c3aed', secondary: '#a855f7' },
  { name: 'Midnight', primary: '#1e293b', secondary: '#475569' },
  { name: 'Rose Gold', primary: '#f43f5e', secondary: '#fb923c' },
  { name: 'Mono Black', primary: '#171717', secondary: '#525252' },
];

export default function StepColors({ data, updateData }) {
  const selectPreset = (preset) => {
    updateData({
      primary_color: preset.primary,
      secondary_color: preset.secondary,
    });
  };

  return (
    <div className={styles.step}>
      <div className={styles.stepBadge}>Brand colors</div>
      <h1 className={styles.title}>Pick your brand colors</h1>
      <p className={styles.description}>
        Yeh colors generated posts mein use honge. Preset choose karo ya custom set karo.
      </p>

      <div className={styles.colorPreview}>
        <div className={styles.previewCard}>
          <div
            className={styles.previewBg}
            style={{
              background: `linear-gradient(135deg, ${data.primary_color}, ${data.secondary_color})`,
            }}
          ></div>
          <div className={styles.previewContent}>
            <p className={styles.previewLabel}>PREVIEW</p>
            <p className={styles.previewTitle}>{data.brand_name || 'Your Brand'}</p>
            <p className={styles.previewSubtitle}>Sample post will look like this</p>
          </div>
        </div>
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>Quick presets</label>
          <div className={styles.presetGrid}>
            {PRESETS.map((preset) => {
              const isSelected =
                data.primary_color === preset.primary &&
                data.secondary_color === preset.secondary;
              return (
                <button
                  key={preset.name}
                  onClick={() => selectPreset(preset)}
                  className={`${styles.presetBtn} ${isSelected ? styles.presetSelected : ''}`}
                >
                  <div
                    className={styles.presetSwatch}
                    style={{
                      background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                    }}
                  ></div>
                  <span className={styles.presetName}>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.colorRow}>
          <div className={styles.field}>
            <label htmlFor="primary_color" className={styles.label}>Primary color</label>
            <div className={styles.colorInputWrapper}>
              <input
                type="color"
                id="primary_color"
                value={data.primary_color}
                onChange={(e) => updateData({ primary_color: e.target.value })}
                className={styles.colorInput}
              />
              <input
                type="text"
                value={data.primary_color}
                onChange={(e) => updateData({ primary_color: e.target.value })}
                className={styles.colorHex}
                maxLength={7}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="secondary_color" className={styles.label}>Secondary color</label>
            <div className={styles.colorInputWrapper}>
              <input
                type="color"
                id="secondary_color"
                value={data.secondary_color}
                onChange={(e) => updateData({ secondary_color: e.target.value })}
                className={styles.colorInput}
              />
              <input
                type="text"
                value={data.secondary_color}
                onChange={(e) => updateData({ secondary_color: e.target.value })}
                className={styles.colorHex}
                maxLength={7}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
