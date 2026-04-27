// Template 12: Bold Numbers
// Giant left-aligned percent/numeric statement

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, fitText, drawWrappedText, shadeColor,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'boldNumbers',
  name: 'Bold Numbers',
  description: 'Massive number with statement. For percentages, rankings, comparisons.',
  category: 'data',
  supportsStatic: true,
  defaults: {
    title: '99%',
    subtitle: 'of brands fail at consistency',
    cta: 'Be the 1%',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;

    // Half/half background split
    const splitProgress = subProgress(progress, 0, 0.2, easing.easeOutQuart);
    
    // Top half - dark
    ctx.fillStyle = '#0a0a0b';
    ctx.fillRect(0, 0, REEL_WIDTH, REEL_HEIGHT * (0.55 + splitProgress * 0));

    // Bottom half - color
    const bottomGrad = ctx.createLinearGradient(0, REEL_HEIGHT * 0.55, 0, REEL_HEIGHT);
    bottomGrad.addColorStop(0, primaryColor);
    bottomGrad.addColorStop(1, secondaryColor);
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, REEL_HEIGHT * 0.55, REEL_WIDTH, REEL_HEIGHT * 0.45);

    // Top: Big number
    const numberProgress = subProgress(progress, 0.05, 0.4, easing.easeOutBack);
    if (numberProgress > 0) {
      ctx.save();
      
      // Detect numeric for count-up
      const numericMatch = title.match(/^(\d+)([\D\s]*)$/);
      let displayValue = title;
      if (numericMatch && numberProgress < 1) {
        const targetNum = parseInt(numericMatch[1]);
        const suffix = numericMatch[2] || '';
        displayValue = Math.floor(targetNum * numberProgress).toLocaleString('en-IN') + suffix;
      }

      ctx.fillStyle = '#ffffff';
      const numSize = fitText(ctx, displayValue, REEL_WIDTH - 100, 380, 200, 'Inter, sans-serif', '900');
      ctx.font = `900 ${numSize}px Inter, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      
      const offsetX = (1 - numberProgress) * -50;
      ctx.fillText(displayValue, 80 + offsetX, REEL_HEIGHT * 0.32);
      
      // Decorative colored slash
      ctx.fillStyle = primaryColor;
      const slashWidth = 200 * numberProgress;
      ctx.fillRect(80, REEL_HEIGHT * 0.45, slashWidth, 12);
      
      ctx.restore();
    }

    // Bottom: Statement
    const statementProgress = subProgress(progress, 0.35, 0.7, easing.easeOutCubic);
    if (statementProgress > 0 && subtitle) {
      ctx.save();
      ctx.globalAlpha = statementProgress;
      ctx.translate(0, (1 - statementProgress) * 40);
      
      ctx.fillStyle = '#ffffff';
      const subSize = fitText(ctx, subtitle, REEL_WIDTH - 160, 80, 50, 'Inter, sans-serif', '700');
      ctx.font = `700 ${subSize}px Inter, sans-serif`;
      ctx.textAlign = 'left';
      drawWrappedText(ctx, subtitle, 80, REEL_HEIGHT * 0.7, REEL_WIDTH - 160, subSize * 1.2, { align: 'left' });
      ctx.restore();
    }

    // CTA at bottom
    const ctaProgress = subProgress(progress, 0.7, 0.88, easing.easeOutBack);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      ctx.translate(80, REEL_HEIGHT * 0.9);
      ctx.scale(ctaProgress, ctaProgress);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 44px Inter, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`→ ${cta}`, 0, 0);
      ctx.restore();
    }
  },

  renderStatic(ctx, data) { this.render(ctx, 360, 450, 0.8, data); },
};
