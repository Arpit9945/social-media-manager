// Template 2: Bold Statement
// Large kinetic text that scales in dramatically

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawGradientBg, contrastColor, fitText, drawWrappedText,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'boldStatement',
  name: 'Bold Statement',
  description: 'Massive impactful text with dramatic entrance. For powerful messages.',
  category: 'text',
  supportsStatic: true,
  defaults: {
    title: 'Stop scrolling',
    subtitle: 'You needed to see this',
    cta: 'Save this post',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;
    const textColor = contrastColor(primaryColor);

    // Animated diagonal gradient bg
    const angle = 135 + Math.sin(progress * Math.PI * 2) * 20;
    drawGradientBg(ctx, primaryColor, secondaryColor, angle);

    // Big circular accent that pulses
    const pulseScale = 1 + Math.sin(progress * Math.PI * 4) * 0.05;
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = textColor;
    ctx.beginPath();
    ctx.arc(REEL_WIDTH / 2, REEL_HEIGHT / 2, 500 * pulseScale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // TITLE - explosive entrance + scaling pulse
    const titleEnter = subProgress(progress, 0, 0.25, easing.easeOutBack);
    const titlePulse = 1 + Math.sin(progress * Math.PI * 6) * 0.02;
    
    if (titleEnter > 0) {
      ctx.save();
      const titleSize = fitText(ctx, title.toUpperCase(), REEL_WIDTH - 120, 200, 100, 'Inter, sans-serif', '900');
      ctx.font = `900 ${titleSize}px Inter, sans-serif`;
      
      ctx.translate(REEL_WIDTH / 2, REEL_HEIGHT * 0.45);
      ctx.scale(titleEnter * titlePulse, titleEnter * titlePulse);
      
      ctx.fillStyle = textColor;
      drawWrappedText(ctx, title.toUpperCase(), 0, 0, REEL_WIDTH - 120, titleSize * 1.05);
      ctx.restore();
    }

    // Subtitle slides up from below
    const subEnter = subProgress(progress, 0.3, 0.5, easing.easeOutCubic);
    if (subEnter > 0 && subtitle) {
      ctx.save();
      ctx.globalAlpha = subEnter;
      const offsetY = (1 - subEnter) * 60;
      ctx.fillStyle = textColor;
      ctx.font = `500 48px Inter, sans-serif`;
      drawWrappedText(ctx, subtitle, REEL_WIDTH / 2, REEL_HEIGHT * 0.62 + offsetY, REEL_WIDTH - 200, 64);
      ctx.restore();
    }

    // CTA - underlined sliding text at bottom
    const ctaEnter = subProgress(progress, 0.55, 0.75, easing.easeOutQuart);
    if (ctaEnter > 0 && cta) {
      ctx.save();
      const ctaY = REEL_HEIGHT * 0.85;
      ctx.fillStyle = textColor;
      ctx.font = `700 56px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const ctaWidth = ctx.measureText(cta).width;
      ctx.fillText(cta, REEL_WIDTH / 2, ctaY);
      
      // Animated underline
      const underlineWidth = ctaWidth * ctaEnter;
      ctx.fillRect((REEL_WIDTH - underlineWidth) / 2, ctaY + 50, underlineWidth, 6);
      ctx.restore();
    }
  },

  renderStatic(ctx, data) {
    this.render(ctx, 360, 450, 0.8, data);
  },
};
