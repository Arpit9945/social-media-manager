// WebM Video Exporter
// Records canvas frames using MediaRecorder API
// Returns Blob that can be downloaded as .webm

import { TOTAL_FRAMES, FPS, renderFrame } from './canvasEngine';

export function isWebMSupported() {
  return (
    typeof MediaRecorder !== 'undefined' &&
    (MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ||
      MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ||
      MediaRecorder.isTypeSupported('video/webm'))
  );
}

function getBestMimeType() {
  const types = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return 'video/webm';
}

// Export reel as WebM
// canvas: HTMLCanvasElement
// template: template module with render() function
// data: template data object
// onProgress: callback(progress 0-1)
export async function exportWebM(canvas, template, data, onProgress) {
  if (!isWebMSupported()) {
    throw new Error('WebM export not supported in this browser');
  }

  const ctx = canvas.getContext('2d');
  const stream = canvas.captureStream(FPS);
  const mimeType = getBestMimeType();
  
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 4_000_000, // 4 Mbps - good quality
  });

  const chunks = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve(blob);
    };

    recorder.onerror = (e) => reject(e);

    recorder.start();

    let frame = 0;
    const startTime = performance.now();

    const renderNextFrame = () => {
      if (frame >= TOTAL_FRAMES) {
        // Wait a tiny bit for final frame to be captured, then stop
        setTimeout(() => recorder.stop(), 100);
        return;
      }

      // Render current frame
      renderFrame(ctx, template, frame, data);

      onProgress?.(frame / TOTAL_FRAMES);

      frame++;

      // Pace at FPS - use elapsed time to keep accurate
      const elapsedMs = performance.now() - startTime;
      const targetMs = (frame / FPS) * 1000;
      const delay = Math.max(0, targetMs - elapsedMs);
      
      setTimeout(renderNextFrame, delay);
    };

    renderNextFrame();
  });
}
