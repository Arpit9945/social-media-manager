'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import styles from './Step.module.scss';

// Convert any image to WebP using browser canvas
// Returns a Blob that can be uploaded
async function convertToWebP(file, quality = 0.9, maxDimension = 800) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate new dimensions (resize if too large)
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      // Draw to canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Better quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to WebP
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('WebP conversion failed'));
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load failed'));
    };

    img.src = url;
  });
}

export default function StepIdentity({ data, updateData, userId }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setUploadError('Sirf image files allowed hain');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image 5MB se chhoti honi chahiye');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');

      // Convert to WebP first (smaller size, better quality)
      const webpBlob = await convertToWebP(file, 0.9, 800);

      const supabase = createClient();
      // Path format: {userId}/logo-{timestamp}.webp
      // userId folder is required for RLS policy
      const fileName = `${userId}/logo-${Date.now()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, webpBlob, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (uploadError) {
        // RLS policy error
        if (uploadError.message?.includes('row-level security') || uploadError.message?.includes('policy')) {
          setUploadError(
            'Storage permission missing. Supabase mein logos bucket ki RLS policy set karo (instructions in setup guide).'
          );
        } else {
          setUploadError(`Upload failed: ${uploadError.message}`);
        }
        return;
      }

      const { data: urlData } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      updateData({ logo_url: urlData.publicUrl });
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Logo upload nahi ho saka. Phir se try karo.');
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = () => {
    updateData({ logo_url: '' });
    setUploadError('');
  };

  return (
    <div className={styles.step}>
      <div className={styles.stepBadge}>Brand identity</div>
      <h1 className={styles.title}>Tell us about your brand</h1>
      <p className={styles.description}>
        Yeh basic info se AI ko pata chalega ki content kiske liye banana hai.
      </p>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="brand_name" className={styles.label}>
            Brand or business name <span className={styles.required}>*</span>
          </label>
          <input
            id="brand_name"
            type="text"
            value={data.brand_name}
            onChange={(e) => updateData({ brand_name: e.target.value })}
            placeholder="e.g., Glow Skincare, Arpit's Studio"
            className={styles.input}
            maxLength={60}
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Logo <span className={styles.optional}>(optional)</span>
          </label>
          
          {data.logo_url ? (
            <div className={styles.logoPreview}>
              <img src={data.logo_url} alt="Logo preview" className={styles.logoImage} />
              <button onClick={removeLogo} className={styles.removeLogoBtn}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
                Remove
              </button>
            </div>
          ) : (
            <label className={`${styles.uploadBox} ${uploading ? styles.uploading : ''}`}>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleLogoUpload}
                disabled={uploading}
                className={styles.fileInput}
              />
              {uploading ? (
                <>
                  <span className={styles.spinner}></span>
                  <span>Converting & uploading...</span>
                </>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 16V4M12 4L7 9M12 4l5 5M4 18h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <p className={styles.uploadTitle}>Click to upload logo</p>
                    <p className={styles.uploadSubtitle}>PNG, JPG or WebP — auto-optimized to WebP, max 5MB</p>
                  </div>
                </>
              )}
            </label>
          )}

          {uploadError && (
            <p className={styles.fieldError}>{uploadError}</p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="brand_description" className={styles.label}>
            What does your brand do? <span className={styles.optional}>(optional)</span>
          </label>
          <textarea
            id="brand_description"
            value={data.brand_description}
            onChange={(e) => updateData({ brand_description: e.target.value })}
            placeholder="e.g., We sell handmade ceramic pottery for modern homes."
            className={styles.textarea}
            rows={3}
            maxLength={200}
          />
          <p className={styles.helpText}>
            One line is enough. Helps AI write better captions.
          </p>
        </div>
      </div>
    </div>
  );
}
