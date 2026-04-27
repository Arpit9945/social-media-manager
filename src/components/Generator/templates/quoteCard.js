// Template 4: Quote Card
// Quote slides up, author appears with gradient sweep

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, fitText, drawWrappedText, shadeColor,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'quoteCard',
  name: 'Quote Card',
  description: 'Elegant quote presentation with attribution. Perfect for inspirational posts.',
  category: 'text',
  supportsStatic: true,
  defaults: {
    title: 'Success is not final. Failure is not fatal.',
    subtitle: 'Winston Churchill',
    cta: 'Save this for later',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;

    // Subtle gradient bg
    drawGradientBg(ctx, shadeColor(primaryColor, -60), '#0a0a0b', 135);

    // Decorative quote marks - top
    const quoteMarkProgress = subProgress(progress, 0, 0.15, easing.easeOutBack);
    if (quoteMarkProgress > 0) {
      ctx.save();
      ctx.globalAlpha = quoteMarkProgress * 0.3;
      ctx.fillStyle = primaryColor;
      ctx.font = `900 240px Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('"', REEL_WIDTH / 2 - 350, REEL_HEIGHT * 0.32);
      ctx.restore();
    }

    // Quote text - slides up
    const quoteProgress = subProgress(progress, 0.1, 0.45, easing.easeOutCubic);
    if (quoteProgress > 0) {
      ctx.save();
      ctx.globalAlpha = quoteProgress;
      const offsetY = (1 - quoteProgress) * 80;
      
      ctx.fillStyle = '#ffffff';
      const titleSize = fitText(ctx, title, REEL_WIDTH - 160, 80, 50, 'Georgia, serif', '500');
      ctx.font = `500 italic ${titleSize}px Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawWrappedText(ctx, title, REEL_WIDTH / 2, REEL_HEIGHT * 0.5 + offsetY, REEL_WIDTH - 160, titleSize * 1.4);
      ctx.restore();
    }

    // Gradient sweep line
    const sweepProgress = subProgress(progress, 0.45, 0.6, easing.easeOutQuart);
    if (sweepProgress > 0) {
      ctx.save();
      const lineY = REEL_HEIGHT * 0.7;
      const lineFullWidth = 200;
      const lineWidth = lineFullWidth * sweepProgress;
      
      const grad = ctx.createLinearGradient(REEL_WIDTH / 2 - lineFullWidth / 2, lineY, REEL_WIDTH / 2 + lineFullWidth / 2, lineY);
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(1, secondaryColor);
      ctx.fillStyle = grad;
      ctx.fillRect(REEL_WIDTH / 2 - lineWidth / 2, lineY, lineWidth, 4);
      ctx.restore();
    }

    // Author name
    const authorProgress = subProgress(progress, 0.55, 0.7, easing.easeOutQuad);
    if (authorProgress > 0 && subtitle) {
      ctx.save();
      ctx.globalAlpha = authorProgress;
      ctx.fillStyle = primaryColor;
      ctx.font = `600 40px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`— ${subtitle}`, REEL_WIDTH / 2, REEL_HEIGHT * 0.78);
      ctx.restore();
    }

    // CTA at bottom
    const ctaProgress = subProgress(progress, 0.75, 0.9, easing.easeOutQuad);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      ctx.globalAlpha = ctaProgress * 0.7;
      ctx.fillStyle = '#a1a1aa';
      ctx.font = `400 32px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cta, REEL_WIDTH / 2, REEL_HEIGHT * 0.92);
      ctx.restore();
    }

    // Bottom decorative quote mark
    if (quoteMarkProgress > 0) {
      ctx.save();
      ctx.globalAlpha = quoteMarkProgress * 0.3;
      ctx.fillStyle = secondaryColor;
      ctx.font = `900 240px Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('"', REEL_WIDTH / 2 + 350, REEL_HEIGHT * 0.68);
      ctx.restore();
    }
  },

  renderStatic(ctx, data) {
    this.render(ctx, 360, 450, 0.8, data);
  },
};
