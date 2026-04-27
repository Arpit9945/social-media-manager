'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import styles from './LogoControls.module.scss';

const POSITIONS = [
  { id: 'top-left', label: 'TL' },
  { id: 'top-center', label: 'TC' },
  { id: 'top-right', label: 'TR' },
  { id: 'bottom-left', label: 'BL' },
  { id: 'bottom-center', label: 'BC' },
  { id: 'bottom-right', label: 'BR' },
];

const BACKGROUNDS = [
  { id: 'pill', label: 'Rounded' },
  { id: 'circle', label: 'Circle' },
  { id: 'none', label: 'None' },
];

// Convert any image to PNG via canvas (preserves transparency, resizes if huge)
async function processImageFile(file, maxDim = 512) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        // Resize if needed
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Conversion failed'));
        }, 'image/png', 0.92);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function LogoControls({ user, formData, onChange }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const update = (patch) => onChange({ ...formData, ...patch });

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Sirf image files (PNG, JPG, SVG, WebP) allowed hain');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Logo 5MB se chhota hona chahiye');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Convert + resize locally first
      const blob = await processImageFile(file, 512);

      // INSTANT FEEDBACK: show local blob URL immediately so the canvas updates
      // while the cloud upload happens in parallel.
      const localPreviewUrl = URL.createObjectURL(blob);
      update({ logoUrl: localPreviewUrl, showLogo: true });

      // Upload to Supabase storage (logos bucket) in parallel
      const supabase = createClient();
      const ext = 'png';
      const filename = `template-logo-${Date.now()}.${ext}`;
      const filePath = `${user.id}/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, blob, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) throw new Error('URL nahi mil saka');

      // Swap blob URL with the permanent public URL (so it persists across reloads + can be saved)
      update({
        logoUrl: urlData.publicUrl,
        showLogo: true,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Upload nahi ho saka. Phir try karo.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    update({ logoUrl: null, showLogo: false });
  };

  return (
    <details className={styles.section}>
      <summary className={styles.summary}>
        <span className={styles.summaryLeft}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.25" />
            <path d="M14 11l-3-3-7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Brand logo</span>
          {formData?.logoUrl && formData?.showLogo && (
            <span className={styles.activeChip}>ON</span>
          )}
        </span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.toggleIcon}>
          <path d="M5 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      <div className={styles.body}>
        {/* Upload area */}
        <div className={styles.uploadArea}>
          {formData?.logoUrl ? (
            <div className={styles.preview}>
              <img src={formData.logoUrl} alt="Logo" className={styles.previewImg} referrerPolicy="no-referrer" />
              <div className={styles.previewActions}>
                <button onClick={() => fileInputRef.current?.click()} className={styles.changeBtn}>
                  Change
                </button>
                <button onClick={handleRemove} className={styles.removeBtn}>
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={styles.uploadBtn}
            >
              {uploading ? (
                <>
                  <span className={styles.spinner}></span>
                  Uploading...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 14V6M6 10l4-4 4 4M3 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Upload logo
                  <span className={styles.uploadHint}>PNG, JPG, SVG • Max 5MB</span>
                </>
              )}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className={styles.fileInput}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {/* Show controls only if logo is set */}
        {formData?.logoUrl && (
          <>
            {/* Toggle on/off */}
            <label className={styles.toggleRow}>
              <span className={styles.toggleLabel}>Show on this template</span>
              <input
                type="checkbox"
                checked={formData?.showLogo !== false}
                onChange={(e) => update({ showLogo: e.target.checked })}
                className={styles.checkbox}
              />
              <span className={styles.toggleSwitch}></span>
            </label>

            {formData?.showLogo && (
              <>
                {/* Position picker */}
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Position</label>
                  <div className={styles.positionGrid}>
                    {POSITIONS.map((pos) => (
                      <button
                        key={pos.id}
                        onClick={() => update({ logoPosition: pos.id })}
                        className={`${styles.posBtn} ${formData?.logoPosition === pos.id ? styles.posActive : ''}`}
                        aria-label={pos.id}
                      >
                        <span>{pos.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size slider */}
                <div className={styles.field}>
                  <div className={styles.sliderHeader}>
                    <label className={styles.fieldLabel}>Size</label>
                    <span className={styles.sliderValue}>{formData?.logoSize || 110}px</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="220"
                    step="10"
                    value={formData?.logoSize || 110}
                    onChange={(e) => update({ logoSize: parseInt(e.target.value) })}
                    className={styles.slider}
                  />
                </div>

                {/* Background picker */}
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Background style</label>
                  <div className={styles.bgGrid}>
                    {BACKGROUNDS.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => update({ logoBackground: bg.id })}
                        className={`${styles.bgBtn} ${(formData?.logoBackground || 'pill') === bg.id ? styles.bgActive : ''}`}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </details>
  );
}
