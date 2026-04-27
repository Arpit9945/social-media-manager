// Template 13: Comparison (This vs That)
// Two-column layout for comparisons

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, contrastColor, fitText, drawWrappedText, drawRoundedRect,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'comparison',
  name: 'This vs That',
  description: 'Side-by-side comparison. Use subtitle as: "Old way | New way".',
  category: 'educational',
  supportsStatic: true,
  defaults: {
    title: 'Old way vs New way',
    subtitle: 'Manual editing | AI in 30s',
    cta: 'Save 5 hours daily',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;

    // Dark bg
    drawSolidBg(ctx, '#0a0a0b');

    // Title at top
    const titleProgress = subProgress(progress, 0, 0.18, easing.easeOutQuart);
    if (titleProgress > 0) {
      ctx.save();
      ctx.globalAlpha = titleProgress;
      ctx.fillStyle = '#ffffff';
      const titleSize = fitText(ctx, title, REEL_WIDTH - 160, 80, 50, 'Inter, sans-serif', '700');
      ctx.font = `700 ${titleSize}px Inter, sans-serif`;
      drawWrappedText(ctx, title, REEL_WIDTH / 2, 280, REEL_WIDTH - 160, titleSize * 1.2);
      ctx.restore();
    }

    // Parse comparison: "Old | New"
    const parts = (subtitle || 'Before|After').split(/[|:]/).map(s => s.trim());
    const left = parts[0] || 'Old';
    const right = parts[1] || 'New';

    // Left card
    const leftProgress = subProgress(progress, 0.2, 0.45, easing.easeOutBack);
    if (leftProgress > 0) {
      ctx.save();
      const cardW = REEL_WIDTH * 0.4;
      const cardH = 700;
      const cardX = REEL_WIDTH * 0.05;
      const cardY = REEL_HEIGHT * 0.4;
      
      ctx.translate(cardX + cardW / 2, cardY + cardH / 2);
      ctx.scale(leftProgress, leftProgress);
      ctx.translate(-(cardX + cardW / 2), -(cardY + cardH / 2));

      // Card with red gradient
      const grad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      grad.addColorStop(0, '#dc2626');
      grad.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = grad;
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
      ctx.fill();

      // X mark
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 100px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✕', cardX + cardW / 2, cardY + 160);

      // Label "OLD" or "BEFORE"
      ctx.font = `700 32px Inter, sans-serif`;
      ctx.letterSpacing = '4px';
      ctx.fillText('BEFORE', cardX + cardW / 2, cardY + 280);
      ctx.letterSpacing = '0';

      // Text
      const leftSize = fitText(ctx, left, cardW - 60, 56, 32, 'Inter, sans-serif', '600');
      ctx.font = `600 ${leftSize}px Inter, sans-serif`;
      drawWrappedText(ctx, left, cardX + cardW / 2, cardY + cardH - 200, cardW - 60, leftSize * 1.2);
      
      ctx.restore();
    }

    // Right card
    const rightProgress = subProgress(progress, 0.35, 0.6, easing.easeOutBack);
    if (rightProgress > 0) {
      ctx.save();
      const cardW = REEL_WIDTH * 0.4;
      const cardH = 700;
      const cardX = REEL_WIDTH * 0.55;
      const cardY = REEL_HEIGHT * 0.4;
      
      ctx.translate(cardX + cardW / 2, cardY + cardH / 2);
      ctx.scale(rightProgress, rightProgress);
      ctx.translate(-(cardX + cardW / 2), -(cardY + cardH / 2));

      // Green gradient
      const grad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(1, secondaryColor);
      ctx.fillStyle = grad;
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
      ctx.fill();

      // Check mark
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 100px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓', cardX + cardW / 2, cardY + 160);

      // Label
      ctx.font = `700 32px Inter, sans-serif`;
      ctx.letterSpacing = '4px';
      ctx.fillText('AFTER', cardX + cardW / 2, cardY + 280);
      ctx.letterSpacing = '0';

      // Text
      const rightSize = fitText(ctx, right, cardW - 60, 56, 32, 'Inter, sans-serif', '600');
      ctx.font = `600 ${rightSize}px Inter, sans-serif`;
      drawWrappedText(ctx, right, cardX + cardW / 2, cardY + cardH - 200, cardW - 60, rightSize * 1.2);
      
      ctx.restore();
    }

    // VS divider
    const vsProgress = subProgress(progress, 0.55, 0.7, easing.easeOutBack);
    if (vsProgress > 0) {
      ctx.save();
      ctx.translate(REEL_WIDTH / 2, REEL_HEIGHT * 0.62);
      ctx.scale(vsProgress, vsProgress);
      
      // Glowing circle
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 30;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = '#0a0a0b';
      ctx.font = `900 36px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VS', 0, 4);
      ctx.restore();
    }

    // CTA
    const ctaProgress = subProgress(progress, 0.7, 0.85, easing.easeOutQuad);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      ctx.globalAlpha = ctaProgress;
      ctx.fillStyle = primaryColor;
      ctx.font = `700 40px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cta, REEL_WIDTH / 2, REEL_HEIGHT - 140);
      ctx.restore();
    }
  },

  renderStatic(ctx, data) { this.render(ctx, 360, 450, 0.8, data); },
};
