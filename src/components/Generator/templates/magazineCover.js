// Template 19: Magazine Cover
// Editorial fashion magazine layout with headlines

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, fitText, drawWrappedText, shadeColor,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'magazineCover',
  name: 'Magazine Cover',
  description: 'Editorial magazine-style layout with headlines and ticker. For lifestyle/fashion content.',
  category: 'branding',
  supportsStatic: true,
  defaults: {
    title: 'Issue No. 01',
    subtitle: 'The future of digital is here',
    cta: 'Read inside',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor, brandName } = data;

    // Cream colored bg
    drawSolidBg(ctx, '#f4f1ea');

    // Top decorative band
    const bandProgress = subProgress(progress, 0, 0.15, easing.easeOutQuart);
    if (bandProgress > 0) {
      ctx.fillStyle = primaryColor;
      ctx.fillRect(0, 0, REEL_WIDTH * bandProgress, 120);
      
      // Brand mark
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 56px Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '12px';
      ctx.fillText((brandName || 'BRAND').toUpperCase().substring(0, 12), REEL_WIDTH / 2, 60);
      ctx.letterSpacing = '0';
    }

    // Issue number (title)
    const issueProgress = subProgress(progress, 0.1, 0.3, easing.easeOutCubic);
    if (issueProgress > 0) {
      ctx.save();
      ctx.globalAlpha = issueProgress;
      ctx.fillStyle = secondaryColor;
      ctx.font = `600 italic 38px Georgia, serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, 80, 220);

      // Underline
      const lineWidth = ctx.measureText(title).width;
      ctx.fillRect(80, 250, lineWidth * issueProgress, 2);
      ctx.restore();
    }

    // Big editorial headline (subtitle)
    const headlineProgress = subProgress(progress, 0.2, 0.6, easing.easeOutQuart);
    if (headlineProgress > 0 && subtitle) {
      ctx.save();
      ctx.globalAlpha = headlineProgress;
      
      ctx.fillStyle = '#0a0a0b';
      const headlineSize = fitText(ctx, subtitle, REEL_WIDTH - 160, 200, 96, 'Georgia, serif', '900');
      ctx.font = `900 ${headlineSize}px Georgia, serif`;
      ctx.textAlign = 'left';
      drawWrappedText(ctx, subtitle, 80, REEL_HEIGHT * 0.5, REEL_WIDTH - 160, headlineSize * 1.05, { align: 'left' });
      ctx.restore();
    }

    // Decorative side bar
    const sideProgress = subProgress(progress, 0.4, 0.7, easing.easeOutQuart);
    if (sideProgress > 0) {
      const sideHeight = REEL_HEIGHT * 0.5 * sideProgress;
      ctx.fillStyle = primaryColor;
      ctx.fillRect(REEL_WIDTH - 30, REEL_HEIGHT * 0.3, 12, sideHeight);
    }

    // Ticker text bottom
    const tickerProgress = subProgress(progress, 0.6, 0.85, easing.easeOutQuad);
    if (tickerProgress > 0) {
      ctx.save();
      ctx.globalAlpha = tickerProgress;
      ctx.fillStyle = '#52525b';
      ctx.font = `500 28px Inter, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '4px';
      ctx.fillText('FEATURES   ·   INTERVIEWS   ·   TRENDS   ·   STORIES', 80, REEL_HEIGHT - 280);
      ctx.letterSpacing = '0';
      ctx.restore();
    }

    // CTA at bottom
    const ctaProgress = subProgress(progress, 0.7, 0.9, easing.easeOutBack);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      ctx.translate(80, REEL_HEIGHT - 180);
      ctx.scale(ctaProgress, ctaProgress);

      ctx.fillStyle = '#0a0a0b';
      ctx.font = `700 56px Georgia, serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(cta, 0, 0);
      
      // Arrow circle
      ctx.fillStyle = primaryColor;
      const ctaWidth = ctx.measureText(cta).width;
      ctx.beginPath();
      ctx.arc(ctaWidth + 50, 0, 30, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 32px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('→', ctaWidth + 50, 4);
      ctx.restore();
    }

    // Bottom decorative line
    const bottomProgress = subProgress(progress, 0.8, 0.95, easing.easeOutQuart);
    if (bottomProgress > 0) {
      ctx.fillStyle = '#0a0a0b';
      ctx.fillRect(80, REEL_HEIGHT - 80, (REEL_WIDTH - 160) * bottomProgress, 2);
    }
  },

  renderStatic(ctx, data) { this.render(ctx, 360, 450, 0.8, data); },
};
