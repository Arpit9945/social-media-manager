// Template 16: Testimonial / Review
// Customer review with star rating

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, contrastColor, fitText, drawWrappedText, drawRoundedRect, shadeColor,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'testimonial',
  name: 'Customer Review',
  description: 'Testimonial format with 5-star rating. For social proof posts.',
  category: 'product',
  supportsStatic: true,
  defaults: {
    title: 'Best decision ever made',
    subtitle: 'Priya, 28, Mumbai',
    cta: 'Read 1000+ reviews',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;

    // Soft gradient bg
    const bgGrad = ctx.createLinearGradient(0, 0, 0, REEL_HEIGHT);
    bgGrad.addColorStop(0, shadeColor(primaryColor, -55));
    bgGrad.addColorStop(1, '#0a0a0b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, REEL_WIDTH, REEL_HEIGHT);

    // Top label
    const labelProgress = subProgress(progress, 0, 0.15, easing.easeOutQuart);
    if (labelProgress > 0) {
      ctx.save();
      ctx.globalAlpha = labelProgress;
      ctx.fillStyle = '#a1a1aa';
      ctx.font = `600 32px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '8px';
      ctx.fillText('VERIFIED REVIEW', REEL_WIDTH / 2, REEL_HEIGHT * 0.18);
      ctx.letterSpacing = '0';
      ctx.restore();
    }

    // 5 stars (animated in sequence)
    const starsBaseProgress = subProgress(progress, 0.1, 0.35, easing.linear);
    if (starsBaseProgress > 0) {
      ctx.save();
      const starY = REEL_HEIGHT * 0.28;
      const starSize = 70;
      const starGap = 90;
      const totalStarsWidth = 5 * starGap;
      const startX = (REEL_WIDTH - totalStarsWidth) / 2 + starGap / 2;
      
      for (let i = 0; i < 5; i++) {
        const starProgress = subProgress(starsBaseProgress, i * 0.18, (i + 1) * 0.18, easing.easeOutBack);
        if (starProgress <= 0) continue;
        
        ctx.save();
        ctx.translate(startX + i * starGap, starY);
        ctx.scale(starProgress, starProgress);
        
        ctx.fillStyle = '#fbbf24';
        ctx.font = `${starSize}px Apple Color Emoji, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⭐', 0, 0);
        ctx.restore();
      }
      ctx.restore();
    }

    // Quote card
    const cardProgress = subProgress(progress, 0.3, 0.55, easing.easeOutBack);
    if (cardProgress > 0) {
      ctx.save();
      const cardW = REEL_WIDTH - 120;
      const cardH = 600;
      const cardX = 60;
      const cardY = REEL_HEIGHT * 0.4;
      
      ctx.translate(cardX + cardW / 2, cardY + cardH / 2);
      ctx.scale(cardProgress, cardProgress);
      ctx.translate(-(cardX + cardW / 2), -(cardY + cardH / 2));
      ctx.globalAlpha = cardProgress;

      // White card
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = '#ffffff';
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Big quote mark
      ctx.fillStyle = primaryColor;
      ctx.font = `900 200px Georgia, serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('"', cardX + 40, cardY + 20);

      // Review text
      ctx.fillStyle = '#0a0a0b';
      const titleSize = fitText(ctx, title, cardW - 120, 70, 42, 'Georgia, serif', '500');
      ctx.font = `500 italic ${titleSize}px Georgia, serif`;
      drawWrappedText(ctx, title, REEL_WIDTH / 2, cardY + cardH / 2, cardW - 120, titleSize * 1.3);

      // Author
      if (subtitle) {
        ctx.fillStyle = '#52525b';
        ctx.font = `600 32px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`— ${subtitle}`, REEL_WIDTH / 2, cardY + cardH - 80);
      }
      
      ctx.restore();
    }

    // CTA
    const ctaProgress = subProgress(progress, 0.7, 0.88, easing.easeOutQuad);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      ctx.globalAlpha = ctaProgress;
      ctx.fillStyle = '#ffffff';
      ctx.font = `600 36px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`→ ${cta}`, REEL_WIDTH / 2, REEL_HEIGHT - 140);
      ctx.restore();
    }
  },

  renderStatic(ctx, data) { this.render(ctx, 360, 450, 0.8, data); },
};
