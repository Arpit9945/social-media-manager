// ASMA Canvas Animation Engine
// Renders 1080x1920 reel frames at 30fps
// All templates use this engine to draw frames

export const REEL_WIDTH = 1080;
export const REEL_HEIGHT = 1920;
export const FPS = 30;
export const DURATION_SECONDS = 15;
export const TOTAL_FRAMES = FPS * DURATION_SECONDS; // 450 frames

// =====================================
// EASING FUNCTIONS
// =====================================
export const easing = {
  linear: (t) => t,
  easeOutQuad: (t) => 1 - (1 - t) * (1 - t),
  easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
  easeOutBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

// =====================================
// HELPERS
// =====================================

// Convert hex color to RGB tuple
export function hexToRgb(hex) {
  const cleaned = hex.replace('#', '');
  const num = parseInt(cleaned.length === 3 ? cleaned.split('').map(c => c + c).join('') : cleaned, 16);
  return [
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255,
  ];
}

// Mix two hex colors with t (0-1)
export function mixColors(c1, c2, t) {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// Get a contrasting text color (white or black) for a given background
export function contrastColor(bgHex) {
  const [r, g, b] = hexToRgb(bgHex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#0a0a0b' : '#ffffff';
}

// Lighten/darken a hex color
export function shadeColor(hex, percent) {
  const [r, g, b] = hexToRgb(hex);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  return `rgb(${Math.round((t - r) * p + r)}, ${Math.round((t - g) * p + g)}, ${Math.round((t - b) * p + b)})`;
}

// Map progress 0-1 to a sub-range with easing
// e.g., subProgress(0.5, 0.2, 0.6) → returns 0.75 (50% through 0.2-0.6 range)
export function subProgress(t, start, end, ease = easing.easeOutCubic) {
  if (t < start) return 0;
  if (t > end) return 1;
  const local = (t - start) / (end - start);
  return ease(local);
}

// =====================================
// TEXT RENDERING HELPERS
// =====================================

// Draw text with auto word-wrap
export function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, opts = {}) {
  const { align = 'center', baseline = 'middle' } = opts;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;

  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  const totalHeight = lines.length * lineHeight;
  const startY = baseline === 'middle' ? y - totalHeight / 2 + lineHeight / 2 : y;

  lines.forEach((line, i) => {
    ctx.fillText(line, x, startY + i * lineHeight);
  });

  return { lines, totalHeight };
}

// Auto-fit font size to fit text in width
export function fitText(ctx, text, maxWidth, maxFontSize, minFontSize, fontFamily, fontWeight = '600') {
  let size = maxFontSize;
  while (size > minFontSize) {
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    const metrics = ctx.measureText(text);
    if (metrics.width <= maxWidth) break;
    size -= 4;
  }
  return size;
}

// =====================================
// BACKGROUND HELPERS
// =====================================
export function drawGradientBg(ctx, color1, color2, angle = 135, t = 0) {
  // Angle: 135deg = top-left to bottom-right
  // Optional t: shift gradient over time for animated bg
  const rad = (angle - 90) * (Math.PI / 180);
  const cx = REEL_WIDTH / 2;
  const cy = REEL_HEIGHT / 2;
  const len = Math.max(REEL_WIDTH, REEL_HEIGHT) * 1.2;
  
  const offsetX = Math.cos(t * Math.PI * 2) * 100;
  const offsetY = Math.sin(t * Math.PI * 2) * 100;
  
  const x1 = cx - Math.cos(rad) * len / 2 + offsetX;
  const y1 = cy - Math.sin(rad) * len / 2 + offsetY;
  const x2 = cx + Math.cos(rad) * len / 2 + offsetX;
  const y2 = cy + Math.sin(rad) * len / 2 + offsetY;

  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, REEL_WIDTH, REEL_HEIGHT);
}

export function drawSolidBg(ctx, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, REEL_WIDTH, REEL_HEIGHT);
}

// Add subtle noise/grain over background
export function drawNoise(ctx, opacity = 0.02) {
  const imageData = ctx.getImageData(0, 0, REEL_WIDTH, REEL_HEIGHT);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30 * opacity;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);
}

// =====================================
// SHAPE HELPERS
// =====================================
export function drawRoundedRect(ctx, x, y, w, h, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export function drawCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();
}

// =====================================
// MAIN RENDER FUNCTION
// =====================================
// Each template provides a render(ctx, frame, totalFrames, data) function
export function renderFrame(ctx, template, frame, data) {
  const progress = frame / TOTAL_FRAMES; // 0 to 1 over 15 sec
  template.render(ctx, frame, TOTAL_FRAMES, progress, data);
}
