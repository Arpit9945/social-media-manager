// Template 7: Stats Burst
// Big number counts up dramatically, label reveals

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, fitText, drawWrappedText, drawRoundedRect, shadeColor,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'statsBurst',
  name: 'Stats Burst',
  description: 'Animated number reveal with count-up effect. Perfect for impressive metrics.',
  category: 'data',
  supportsStatic: true,
  defaults: {
    title: '10000+',
    subtitle: 'Customers served',
    cta: 'And counting...',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;
    const textColor = contrastColor(primaryColor);

    // Animated radial gradient bg
    const radialGrad = ctx.createRadialGradient(
      REEL_WIDTH / 2, REEL_HEIGHT / 2, 100,
      REEL_WIDTH / 2, REEL_HEIGHT / 2, 1200
    );
    radialGrad.addColorStop(0, primaryColor);
    radialGrad.addColorStop(1, shadeColor(primaryColor, -50));
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, REEL_WIDTH, REEL_HEIGHT);

    // Decorative bursts (animated rays)
    const burstProgress = subProgress(progress, 0, 0.4, easing.easeOutQuart);
    if (burstProgress > 0) {
      ctx.save();
      ctx.translate(REEL_WIDTH / 2, REEL_HEIGHT * 0.45);
      ctx.rotate(progress * Math.PI * 0.3);
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = textColor;
      
      for (let i = 0; i < 12; i++) {
        ctx.save();
        ctx.rotate((i / 12) * Math.PI * 2);
        ctx.fillRect(-4, -800 * burstProgress, 8, 600);
        ctx.restore();
      }
      ctx.restore();
    }

    // Top label
    const labelProgress = subProgress(progress, 0, 0.15, easing.easeOutQuart);
    if (labelProgress > 0) {
      ctx.save();
      ctx.globalAlpha = labelProgress;
      ctx.fillStyle = textColor;
      ctx.font = `600 36px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '8px';
      ctx.fillText('THE NUMBERS', REEL_WIDTH / 2, REEL_HEIGHT * 0.22);
      ctx.letterSpacing = '0';
      ctx.restore();
    }

    // BIG NUMBER - count up effect
    const numberProgress = subProgress(progress, 0.15, 0.55, easing.easeOutQuart);
    if (numberProgress > 0) {
      ctx.save();
      
      // Try to detect if title is numeric for count-up effect
      const numericMatch = title.match(/^(\d+)([\D\s]*)$/);
      let displayValue = title;
      
      if (numericMatch) {
        const targetNum = parseInt(numericMatch[1]);
        const suffix = numericMatch[2] || '';
        const currentNum = Math.floor(targetNum * numberProgress);
        // Format with commas
        displayValue = currentNum.toLocaleString('en-IN') + suffix;
      }

      // Scale + bounce
      const scale = 0.5 + numberProgress * 0.5;
      const bounceScale = numberProgress > 0.95 ? 1 + Math.sin((numberProgress - 0.95) * Math.PI * 20) * 0.04 : 1;
      
      ctx.translate(REEL_WIDTH / 2, REEL_HEIGHT * 0.45);
      ctx.scale(scale * bounceScale, scale * bounceScale);
      ctx.translate(-REEL_WIDTH / 2, -REEL_HEIGHT * 0.45);
      
      ctx.fillStyle = textColor;
      const numSize = fitText(ctx, displayValue, REEL_WIDTH - 120, 280, 140, 'Inter, sans-serif', '900');
      ctx.font = `900 ${numSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayValue, REEL_WIDTH / 2, REEL_HEIGHT * 0.45);
      ctx.restore();
    }

    // Underline
    const underlineProgress = subProgress(progress, 0.55, 0.65, easing.easeOutQuart);
    if (underlineProgress > 0) {
      const lineWidth = 240 * underlineProgress;
      ctx.fillStyle = textColor;
      ctx.fillRect((REEL_WIDTH - lineWidth) / 2, REEL_HEIGHT * 0.6, lineWidth, 6);
    }

    // Subtitle / label
    const subProg = subProgress(progress, 0.6, 0.75, easing.easeOutQuad);
    if (subProg > 0 && subtitle) {
      ctx.save();
      ctx.globalAlpha = subProg;
      ctx.fillStyle = textColor;
      ctx.font = `500 56px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawWrappedText(ctx, subtitle, REEL_WIDTH / 2, REEL_HEIGHT * 0.7, REEL_WIDTH - 160, 70);
      ctx.restore();
    }

    // CTA at bottom
    const ctaProgress = subProgress(progress, 0.78, 0.9, easing.easeOutQuad);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      ctx.globalAlpha = ctaProgress * 0.8;
      ctx.fillStyle = textColor;
      ctx.font = `400 italic 36px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cta, REEL_WIDTH / 2, REEL_HEIGHT * 0.85);
      ctx.restore();
    }
  },

  renderStatic(ctx, data) {
    this.render(ctx, 360, 450, 0.8, data);
  },
};
