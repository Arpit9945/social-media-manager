// Template 11: Minimal Clean
// Editorial/typographic layout. Lots of whitespace.

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, contrastColor, fitText, drawWrappedText,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'minimalClean',
  name: 'Minimal Clean',
  description: 'Editorial whitespace-heavy layout. For premium, sophisticated brands.',
  category: 'text',
  supportsStatic: true,
  defaults: {
    title: 'Less, but better',
    subtitle: 'A philosophy worth living',
    cta: 'Continue reading',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor } = data;

    // Soft cream/white bg
    drawSolidBg(ctx, '#fafaf9');

    // Top thin line
    const lineProgress = subProgress(progress, 0, 0.15, easing.easeOutQuart);
    ctx.fillStyle = primaryColor;
    ctx.fillRect(REEL_WIDTH * 0.1, 250, (REEL_WIDTH * 0.15) * lineProgress, 2);

    // Eyebrow label - tracked out caps
    const eyebrowProgress = subProgress(progress, 0.05, 0.2, easing.easeOutQuad);
    if (eyebrowProgress > 0) {
      ctx.save();
      ctx.globalAlpha = eyebrowProgress;
      ctx.fillStyle = primaryColor;
      ctx.font = `600 28px Inter, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '8px';
      ctx.fillText('CHAPTER 01', REEL_WIDTH * 0.1, 320);
      ctx.letterSpacing = '0';
      ctx.restore();
    }

    // BIG title - serif for editorial feel
    const titleProgress = subProgress(progress, 0.1, 0.5, easing.easeOutCubic);
    if (titleProgress > 0) {
      ctx.save();
      ctx.globalAlpha = titleProgress;
      ctx.translate(0, (1 - titleProgress) * 30);
      
      ctx.fillStyle = '#0a0a0b';
      const titleSize = fitText(ctx, title, REEL_WIDTH * 0.8, 140, 80, 'Georgia, serif', '400');
      ctx.font = `400 ${titleSize}px Georgia, serif`;
      ctx.textAlign = 'left';
      drawWrappedText(ctx, title, REEL_WIDTH * 0.1, REEL_HEIGHT * 0.5, REEL_WIDTH * 0.8, titleSize * 1.1, { align: 'left' });
      ctx.restore();
    }

    // Subtitle italic
    const subProg = subProgress(progress, 0.5, 0.7, easing.easeOutQuad);
    if (subProg > 0 && subtitle) {
      ctx.save();
      ctx.globalAlpha = subProg;
      ctx.fillStyle = '#52525b';
      ctx.font = `400 italic 38px Georgia, serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      drawWrappedText(ctx, subtitle, REEL_WIDTH * 0.1, REEL_HEIGHT * 0.72, REEL_WIDTH * 0.8, 56, { align: 'left' });
      ctx.restore();
    }

    // Bottom line + CTA
    const ctaProgress = subProgress(progress, 0.7, 0.85, easing.easeOutQuad);
    if (ctaProgress > 0) {
      ctx.save();
      ctx.globalAlpha = ctaProgress;
      
      // Bottom line
      ctx.fillStyle = primaryColor;
      ctx.fillRect(REEL_WIDTH * 0.1, REEL_HEIGHT * 0.86, (REEL_WIDTH * 0.15) * ctaProgress, 2);

      if (cta) {
        ctx.fillStyle = primaryColor;
        ctx.font = `600 28px Inter, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.letterSpacing = '4px';
        ctx.fillText(cta.toUpperCase(), REEL_WIDTH * 0.1, REEL_HEIGHT * 0.9);
        ctx.letterSpacing = '0';
      }
      ctx.restore();
    }
  },

  renderStatic(ctx, data) { this.render(ctx, 360, 450, 0.8, data); },
};
