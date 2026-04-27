// GIF Exporter using gif.js
// Renders frames at lower fps (15) and quality for smaller file size

import { TOTAL_FRAMES, FPS, renderFrame } from './canvasEngine';

const GIF_FPS = 15; // Half of video FPS for smaller GIF
const GIF_TOTAL_FRAMES = GIF_FPS * 15; // 225 frames

export async function exportGIF(canvas, template, data, onProgress) {
  // Dynamic import - gif.js is browser-only
  const GIF = (await import('gif.js')).default;

  const ctx = canvas.getContext('2d');

  // Use gif.js with web worker for non-blocking encoding
  const gif = new GIF({
    workers: 2,
    quality: 10, // 1-30, lower is better quality but larger file
    width: canvas.width,
    height: canvas.height,
    workerScript: '/gif.worker.js', // Will be served from public folder
    repeat: 0, // 0 = infinite loop
  });

  // Render each frame and add to GIF
  for (let i = 0; i < GIF_TOTAL_FRAMES; i++) {
    // Map GIF frame to video frame
    const videoFrame = Math.floor((i / GIF_TOTAL_FRAMES) * TOTAL_FRAMES);
    renderFrame(ctx, template, videoFrame, data);

    // Add frame to GIF (delay in ms)
    gif.addFrame(canvas, {
      copy: true,
      delay: 1000 / GIF_FPS,
    });

    // Progress: rendering is 70% of total work
    onProgress?.((i / GIF_TOTAL_FRAMES) * 0.7);

    // Yield to browser every few frames
    if (i % 10 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  return new Promise((resolve, reject) => {
    gif.on('progress', (p) => {
      // Encoding is final 30% of total work
      onProgress?.(0.7 + p * 0.3);
    });

    gif.on('finished', (blob) => {
      onProgress?.(1);
      resolve(blob);
    });

    gif.on('abort', () => reject(new Error('GIF encoding aborted')));

    gif.render();
  });
}

// Export single frame as PNG (for cover image)
export function exportPNG(canvas, template, data, frameNumber = 60) {
  const ctx = canvas.getContext('2d');
  // Render specific frame (e.g., 2 sec mark for cover)
  renderFrame(ctx, template, frameNumber, data);
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
  });
}
