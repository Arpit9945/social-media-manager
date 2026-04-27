'use client';

import { useRef, useEffect, useState } from 'react';
import { TOTAL_FRAMES, FPS, renderFrame } from '@/lib/reel/canvasEngine';
import { useLogoPreload } from '@/lib/reel/useLogoPreload';
import styles from './ReelPreview.module.scss';

export default function ReelPreview({ template, data }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Preload logo before rendering
  const logoState = useLogoPreload(data?.showLogo ? data?.logoUrl : null);

  // Render specific frame
  const renderAt = (frame) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    renderFrame(ctx, template, frame, data);
  };

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    startTimeRef.current = performance.now() - (currentFrame / FPS) * 1000;

    const animate = (now) => {
      const elapsedMs = now - startTimeRef.current;
      const frame = Math.floor((elapsedMs / 1000) * FPS) % TOTAL_FRAMES;
      
      setCurrentFrame(frame);
      renderAt(frame);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, template, data]);

  // Re-render when data changes (even when paused)
  useEffect(() => {
    if (!isPlaying) {
      renderAt(currentFrame);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, template, logoState.ready]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const restart = () => {
    setCurrentFrame(0);
    startTimeRef.current = performance.now();
    renderAt(0);
    if (!isPlaying) setIsPlaying(true);
  };

  const seekTo = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const frame = Math.floor((x / rect.width) * TOTAL_FRAMES);
    setCurrentFrame(frame);
    renderAt(frame);
    setIsPlaying(false);
  };

  const progress = (currentFrame / TOTAL_FRAMES) * 100;
  const currentSec = (currentFrame / FPS).toFixed(1);

  return (
    <div className={styles.preview}>
      <div className={styles.phoneFrame}>
        <div className={styles.phoneNotch}></div>
        <div className={styles.canvasWrapper}>
          <canvas
            ref={canvasRef}
            width={1080}
            height={1920}
            className={styles.canvas}
          />
          <button onClick={togglePlay} className={styles.playOverlay}>
            {!isPlaying && (
              <div className={styles.playButton}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M11 8l13 8-13 8V8z" fill="currentColor" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlsRow}>
          <button onClick={togglePlay} className={styles.controlBtn} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="3" y="2" width="3" height="10" rx="1" fill="currentColor" />
                <rect x="8" y="2" width="3" height="10" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 2l8 5-8 5V2z" fill="currentColor" />
              </svg>
            )}
          </button>
          <button onClick={restart} className={styles.controlBtn} aria-label="Restart">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7a5 5 0 109-3M2 7l-1-3M2 7l3-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className={styles.timeDisplay}>
            {currentSec}s / 15.0s
          </span>
        </div>

        <div
          className={styles.progressTrack}
          onClick={seekTo}
          role="progressbar"
          aria-valuenow={currentFrame}
          aria-valuemin={0}
          aria-valuemax={TOTAL_FRAMES}
        >
          <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          <div className={styles.progressThumb} style={{ left: `${progress}%` }}></div>
        </div>
      </div>

      <div className={styles.previewMeta}>
        <span className={styles.metaItem}>1080×1920</span>
        <span className={styles.metaDivider}>•</span>
        <span className={styles.metaItem}>15s</span>
        <span className={styles.metaDivider}>•</span>
        <span className={styles.metaItem}>30 FPS</span>
      </div>
    </div>
  );
}
