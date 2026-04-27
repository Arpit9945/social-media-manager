'use client';

import styles from './Step.module.scss';

const CATEGORIES = [
  { id: 'fashion', label: 'Fashion & Apparel', emoji: '👗' },
  { id: 'beauty', label: 'Beauty & Skincare', emoji: '💄' },
  { id: 'food', label: 'Food & Beverage', emoji: '🍽️' },
  { id: 'fitness', label: 'Fitness & Wellness', emoji: '💪' },
  { id: 'tech', label: 'Tech & Gadgets', emoji: '📱' },
  { id: 'education', label: 'Education & Coaching', emoji: '📚' },
  { id: 'travel', label: 'Travel & Hospitality', emoji: '✈️' },
  { id: 'home', label: 'Home & Decor', emoji: '🏠' },
  { id: 'finance', label: 'Finance & Business', emoji: '💼' },
  { id: 'creator', label: 'Personal Brand / Creator', emoji: '🎨' },
  { id: 'service', label: 'Local Services', emoji: '🛠️' },
  { id: 'other', label: 'Other', emoji: '📦' },
];

const GENDERS = [
  { id: 'all', label: 'Everyone' },
  { id: 'female', label: 'Mostly women' },
  { id: 'male', label: 'Mostly men' },
];

const LOCATIONS = [
  'India',
  'India + Global',
  'Global',
  'Specific city',
];

export default function StepAudience({ data, updateData }) {
  return (
    <div className={styles.step}>
      <div className={styles.stepBadge}>Target audience</div>
      <h1 className={styles.title}>Who are you creating for?</h1>
      <p className={styles.description}>
        AI uses this to write captions and pick hashtags that resonate with your audience.
      </p>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>
            What&apos;s your category? <span className={styles.required}>*</span>
          </label>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateData({ product_category: cat.id })}
                className={`${styles.categoryBtn} ${
                  data.product_category === cat.id ? styles.categorySelected : ''
                }`}
              >
                <span className={styles.categoryEmoji}>{cat.emoji}</span>
                <span className={styles.categoryLabel}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Age range <span className={styles.required}>*</span>
          </label>
          <div className={styles.ageRange}>
            <div className={styles.ageDisplay}>
              <span className={styles.ageValue}>{data.target_age_min}</span>
              <span className={styles.ageSeparator}>—</span>
              <span className={styles.ageValue}>{data.target_age_max}</span>
              <span className={styles.ageLabel}>years old</span>
            </div>
            <div className={styles.sliders}>
              <div className={styles.sliderRow}>
                <label className={styles.sliderLabel}>Min: {data.target_age_min}</label>
                <input
                  type="range"
                  min="13"
                  max="65"
                  value={data.target_age_min}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val < data.target_age_max) {
                      updateData({ target_age_min: val });
                    }
                  }}
                  className={styles.slider}
                />
              </div>
              <div className={styles.sliderRow}>
                <label className={styles.sliderLabel}>Max: {data.target_age_max}</label>
                <input
                  type="range"
                  min="13"
                  max="65"
                  value={data.target_age_max}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val > data.target_age_min) {
                      updateData({ target_age_max: val });
                    }
                  }}
                  className={styles.slider}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Primary audience <span className={styles.required}>*</span>
          </label>
          <div className={styles.optionRow}>
            {GENDERS.map((gen) => (
              <button
                key={gen.id}
                onClick={() => updateData({ target_gender: gen.id })}
                className={`${styles.optionBtn} ${
                  data.target_gender === gen.id ? styles.optionSelected : ''
                }`}
              >
                {gen.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="target_location" className={styles.label}>Location focus</label>
          <select
            id="target_location"
            value={data.target_location}
            onChange={(e) => updateData({ target_location: e.target.value })}
            className={styles.select}
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
