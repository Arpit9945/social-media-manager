// Template 1: Text Reveal
// Typewriter title appears, subtitle fades in, CTA pulses

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, fitText, drawWrappedText, drawRoundedRect,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'textReveal',
  name: 'Text Reveal',
  description: 'Clean typewriter title with fade-in subtitle. Great for announcements.',
  category: 'text',
  supportsStatic: true,
  defaults: {
    title: 'Big news today',
    subtitle: 'Something exciting is coming your way',
    cta: 'Stay tuned',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;
    const textColor = contrastColor(primaryColor);

    // Animated gradient background
    drawGradientBg(ctx, primaryColor, secondaryColor, 135, progress * 0.3);

    // Vertical accent line on left, animated
    const lineProgress = subProgress(progress, 0.05, 0.25, easing.easeOutQuart);
    ctx.fillStyle = textColor;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(80, REEL_HEIGHT * 0.3, 6, (REEL_HEIGHT * 0.4) * lineProgress);
    ctx.globalAlpha = 1;

    // Title - typewriter effect
    const titleProgress = subProgress(progress, 0.1, 0.5, easing.linear);
    const charsToShow = Math.floor(title.length * titleProgress);
    const visibleTitle = title.substring(0, charsToShow);

    ctx.fillStyle = textColor;
    const titleSize = fitText(ctx, title, REEL_WIDTH - 240, 130, 70, 'Inter, sans-serif', '700');
    ctx.font = `700 ${titleSize}px Inter, sans-serif`;
    drawWrappedText(ctx, visibleTitle, REEL_WIDTH / 2, REEL_HEIGHT * 0.42, REEL_WIDTH - 240, titleSize * 1.2, { align: 'center' });

    // Cursor blink during typing
    if (titleProgress > 0 && titleProgress < 1) {
      const cursorVisible = Math.floor(frame / 8) % 2 === 0;
      if (cursorVisible) {
        ctx.font = `700 ${titleSize}px Inter, sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillRect(REEL_WIDTH / 2 + ctx.measureText(visibleTitle).width / 2 + 8, REEL_HEIGHT * 0.42 - titleSize / 2, 4, titleSize);
      }
    }

    // Subtitle fades in
    const subProgress1 = subProgress(progress, 0.5, 0.7, easing.easeOutQuad);
    if (subProgress1 > 0) {
      ctx.globalAlpha = subProgress1;
      ctx.fillStyle = textColor;
      ctx.font = `400 44px Inter, sans-serif`;
      ctx.textAlign = 'center';
      drawWrappedText(ctx, subtitle, REEL_WIDTH / 2, REEL_HEIGHT * 0.58, REEL_WIDTH - 200, 60);
      ctx.globalAlpha = 1;
    }

    // CTA pill at bottom, pulses
    const ctaProgress = subProgress(progress, 0.7, 0.85, easing.easeOutBack);
    if (ctaProgress > 0 && cta) {
      const pulseScale = 1 + Math.sin(progress * Math.PI * 8) * 0.03;
      ctx.save();
      const ctaY = REEL_HEIGHT * 0.85;
      ctx.translate(REEL_WIDTH / 2, ctaY);
      ctx.scale(ctaProgress * pulseScale, ctaProgress * pulseScale);
      ctx.translate(-REEL_WIDTH / 2, -ctaY);

      ctx.font = `600 42px Inter, sans-serif`;
      const ctaWidth = ctx.measureText(cta).width;
      const padX = 60;
      const padY = 24;
      const pillX = (REEL_WIDTH - ctaWidth - padX * 2) / 2;
      const pillY = ctaY - 30;

      ctx.fillStyle = textColor;
      drawRoundedRect(ctx, pillX, pillY, ctaWidth + padX * 2, 88, 44);
      ctx.fill();

      ctx.fillStyle = primaryColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cta, REEL_WIDTH / 2, ctaY + 14);

      ctx.restore();
    }
  },

  // Static version: full state (final frame)
  renderStatic(ctx, data) {
    this.render(ctx, 360, 450, 0.8, data);
  },
};
