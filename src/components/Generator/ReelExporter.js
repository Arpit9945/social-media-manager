'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { exportWebM, isWebMSupported } from '@/lib/reel/webmExporter';
import { exportGIF, exportPNG } from '@/lib/reel/gifExporter';
import { REEL_WIDTH, REEL_HEIGHT } from '@/lib/reel/canvasEngine';
import styles from './ReelExporter.module.scss';

const FORMATS = [
  {
    id: 'webm',
    name: 'Video (WebM)',
    description: 'Best quality, smaller file. Works in Chrome, Edge, Firefox.',
    icon: '🎬',
    badge: 'Recommended',
    estimatedSize: '~3-5 MB',
    estimatedTime: '~15-25s',
  },
  {
    id: 'gif',
    name: 'Animated GIF',
    description: 'Universal format, larger file. Works everywhere.',
    icon: '✨',
    badge: null,
    estimatedSize: '~8-15 MB',
    estimatedTime: '~30-60s',
  },
  {
    id: 'png',
    name: 'Cover image (PNG)',
    description: 'Single frame at 2 second mark. For thumbnails.',
    icon: '🖼️',
    badge: null,
    estimatedSize: '~1-2 MB',
    estimatedTime: '<1s',
  },
];

export default function ReelExporter({ template, data, user, onBack }) {
  const canvasRef = useRef(null);
  const [exportingFormat, setExportingFormat] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedExports, setCompletedExports] = useState({});
  const [error, setError] = useState('');

  const webmSupported = typeof window !== 'undefined' ? isWebMSupported() : true;

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const saveToLibrary = async (blob, format) => {
    try {
      const supabase = createClient();
      const filename = `reel-${Date.now()}.${format}`;
      const filePath = `${user.id}/${filename}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('generated-posts')
        .upload(filePath, blob, {
          contentType: blob.type,
          cacheControl: '3600',
        });

      if (uploadError) {
        console.warn('Storage upload failed (file size may be too large):', uploadError);
        // Don't fail the export - just skip saving
        return;
      }

      const { data: urlData } = supabase.storage
        .from('generated-posts')
        .getPublicUrl(filePath);

      // Save metadata to DB
      await supabase.from('generated_posts').insert({
        user_id: user.id,
        post_type: 'reel',
        content_format: 'reel',
        template_id: template.id,
        title: data.title,
        caption: data.subtitle,
        template_data: data,
        file_format: format,
        duration_seconds: format === 'png' ? null : 15,
        image_url: urlData?.publicUrl || null,
      });
    } catch (err) {
      console.warn('Library save failed:', err);
      // Don't block download even if save fails
    }
  };

  const handleExport = async (formatId) => {
    setError('');
    setExportingFormat(formatId);
    setProgress(0);

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not ready');

      // Guarantee logo is loaded BEFORE export starts — otherwise frames render
      // without the logo even if user uploaded one.
      if (data?.logoUrl && data?.showLogo !== false) {
        const { loadLogo } = await import('@/lib/reel/canvasEngine');
        await loadLogo(data.logoUrl);
      }

      let blob;
      let extension;

      if (formatId === 'webm') {
        if (!webmSupported) {
          throw new Error('WebM not supported in this browser. Try GIF instead.');
        }
        blob = await exportWebM(canvas, template, data, setProgress);
        extension = 'webm';
      } else if (formatId === 'gif') {
        blob = await exportGIF(canvas, template, data, setProgress);
        extension = 'gif';
      } else if (formatId === 'png') {
        blob = await exportPNG(canvas, template, data, 60); // 2-second mark
        setProgress(1);
        extension = 'png';
      }

      if (!blob) throw new Error('Export failed');

      // Generate filename
      const safeTitle = (data.title || 'reel').replace(/[^a-z0-9]/gi, '-').substring(0, 30).toLowerCase();
      const filename = `asma-${safeTitle}-${Date.now()}.${extension}`;

      // Download
      downloadBlob(blob, filename);

      // Save to library (non-blocking)
      saveToLibrary(blob, extension).catch(console.warn);

      // Mark as completed
      setCompletedExports((prev) => ({ ...prev, [formatId]: true }));
    } catch (err) {
      console.error('Export error:', err);
      setError(err.message || 'Export failed. Try again.');
    } finally {
      setExportingFormat(null);
      setProgress(0);
    }
  };

  return (
    <div className={styles.exporter}>
      <button onClick={onBack} className={styles.backBtn}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to editor
      </button>

      <div className={styles.titleBlock}>
        <span className={styles.eyebrow}>EXPORT YOUR REEL</span>
        <h1 className={styles.title}>Pick a format and download</h1>
        <p className={styles.subtitle}>
          Each export is rendered fresh from your latest changes. WebM is best for posting,
          GIF works everywhere.
        </p>
      </div>

      {/* Hidden canvas used for rendering */}
      <canvas
        ref={canvasRef}
        width={REEL_WIDTH}
        height={REEL_HEIGHT}
        style={{ display: 'none' }}
      />

      {error && (
        <div className={styles.error} role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v3m0 2v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {error}
        </div>
      )}

      <div className={styles.formatsGrid}>
        {FORMATS.map((format) => {
          const isExporting = exportingFormat === format.id;
          const isCompleted = completedExports[format.id];
          const isDisabled = format.id === 'webm' && !webmSupported;
          const isAnyExporting = exportingFormat !== null;

          return (
            <div
              key={format.id}
              className={`${styles.formatCard} ${isExporting ? styles.exporting : ''} ${isCompleted ? styles.completed : ''} ${isDisabled ? styles.disabled : ''}`}
            >
              <div className={styles.formatHeader}>
                <span className={styles.formatIcon}>{format.icon}</span>
                <div className={styles.formatTitles}>
                  <h3 className={styles.formatName}>{format.name}</h3>
                  {format.badge && (
                    <span className={styles.formatBadge}>{format.badge}</span>
                  )}
                </div>
              </div>

              <p className={styles.formatDesc}>{format.description}</p>

              <div className={styles.formatMeta}>
                <span className={styles.metaItem}>📦 {format.estimatedSize}</span>
                <span className={styles.metaItem}>⏱️ {format.estimatedTime}</span>
              </div>

              {isDisabled && (
                <p className={styles.disabledNote}>
                  Not supported in this browser
                </p>
              )}

              <button
                onClick={() => handleExport(format.id)}
                disabled={isDisabled || isAnyExporting}
                className={`${styles.exportBtn} ${isCompleted ? styles.exportBtnDone : ''}`}
              >
                {isExporting ? (
                  <>
                    <span className={styles.spinner}></span>
                    {Math.round(progress * 100)}% rendering...
                  </>
                ) : isCompleted ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Downloaded — Export again?
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1v9M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Download {format.name.split(' ')[0]}
                  </>
                )}
              </button>

              {isExporting && (
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${progress * 100}%` }}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.tipsBox}>
        <h3 className={styles.tipsTitle}>💡 Tips</h3>
        <ul className={styles.tipsList}>
          <li>Don&apos;t close this tab while exporting — it cancels the render.</li>
          <li>For Instagram, upload the WebM directly. For WhatsApp/Status, GIF works better.</li>
          <li>Each export saves to your library — access it from the dashboard anytime.</li>
        </ul>
      </div>
    </div>
  );
}
