// Template 18: Event Announcement
// Date-prominent layout for events, launches, deadlines

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, fitText, drawWrappedText, drawRoundedRect, shadeColor,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'eventAnnouncement',
  name: 'Event Announcement',
  description: 'Event/launch announcement with prominent date/time. For workshops, drops, deadlines.',
  category: 'cta',
  supportsStatic: true,
  defaults: {
    title: 'Workshop launching',
    subtitle: '15 NOV',
    cta: 'Register now',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;

    // Bold dark gradient
    drawGradientBg(ctx, primaryColor, shadeColor(primaryColor, -50), 180);

    // Date card (subtitle goes here - format like "15 NOV")
    const cardProgress = subProgress(progress, 0.05, 0.3, easing.easeOutBack);
    if (cardProgress > 0 && subtitle) {
      ctx.save();
      const cardW = 480;
      const cardH = 580;
      const cardX = (REEL_WIDTH - cardW) / 2;
      const cardY = 350;
      
      ctx.translate(cardX + cardW / 2, cardY + cardH / 2);
      ctx.scale(cardProgress, cardProgress);
      ctx.translate(-(cardX + cardW / 2), -(cardY + cardH / 2));

      // Calendar-style card
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 12;
      ctx.fillStyle = '#ffffff';
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 24);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Top red strip (calendar style)
      ctx.fillStyle = secondaryColor;
      drawRoundedRect(ctx, cardX, cardY, cardW, 80, 24);
      ctx.fill();
      ctx.fillRect(cardX, cardY + 40, cardW, 40);

      // Calendar holes (decoration)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cardX + 80, cardY, 12, 0, Math.PI * 2);
      ctx.arc(cardX + cardW - 80, cardY, 12, 0, Math.PI * 2);
      ctx.fill();

      // Date components - try to parse
      const dateParts = subtitle.trim().split(/\s+/);
      const day = dateParts[0] || subtitle;
      const month = dateParts[1] || '';

      // Day - huge
      ctx.fillStyle = '#0a0a0b';
      const daySize = fitText(ctx, day, cardW - 80, 280, 180, 'Inter, sans-serif', '900');
      ctx.font = `900 ${daySize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(day, cardX + cardW / 2, cardY + cardH / 2 + 20);

      // Month
      if (month) {
        ctx.fillStyle = secondaryColor;
        ctx.font = `700 64px Inter, sans-serif`;
        ctx.letterSpacing = '8px';
        ctx.fillText(month.toUpperCase(), cardX + cardW / 2, cardY + cardH - 80);
        ctx.letterSpacing = '0';
      }
      
      ctx.restore();
    }

    // Title above card
    const titleProgress = subProgress(progress, 0.3, 0.55, easing.easeOutQuart);
    if (titleProgress > 0) {
      ctx.save();
      ctx.globalAlpha = titleProgress;
      ctx.translate(0, (1 - titleProgress) * -30);

      ctx.fillStyle = '#ffffff';
      ctx.font = `700 36px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '4px';
      ctx.fillText('SAVE THE DATE', REEL_WIDTH / 2, 240);
      ctx.letterSpacing = '0';

      ctx.fillStyle = '#ffffff';
      const titleSize = fitText(ctx, title, REEL_WIDTH - 100, 80, 50, 'Inter, sans-serif', '600');
      ctx.font = `600 ${titleSize}px Inter, sans-serif`;
      drawWrappedText(ctx, title, REEL_WIDTH / 2, 1010, REEL_WIDTH - 100, titleSize * 1.2);
      
      ctx.restore();
    }

    // Decoration: bottom corners
    const decoProgress = subProgress(progress, 0.4, 0.6, easing.easeOutQuart);
    if (decoProgress > 0) {
      ctx.save();
      ctx.globalAlpha = decoProgress * 0.5;
      ctx.fillStyle = '#ffffff';
      const lineWidth = 200 * decoProgress;
      ctx.fillRect(REEL_WIDTH / 2 - lineWidth / 2 - 320, 1100, lineWidth, 2);
      ctx.fillRect(REEL_WIDTH / 2 + 320 - lineWidth / 2, 1100, lineWidth, 2);
      ctx.restore();
    }

    // CTA pill
    const ctaProgress = subProgress(progress, 0.65, 0.85, easing.easeOutBack);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      const ctaY = REEL_HEIGHT - 220;
      const pulse = 1 + Math.sin(progress * Math.PI * 6) * 0.04;
      ctx.translate(REEL_WIDTH / 2, ctaY);
      ctx.scale(ctaProgress * pulse, ctaProgress * pulse);
      ctx.translate(-REEL_WIDTH / 2, -ctaY);

      ctx.font = `700 48px Inter, sans-serif`;
      const ctaWidth = ctx.measureText(cta).width;
      const padX = 80;
      const pillH = 96;
      
      ctx.fillStyle = '#ffffff';
      drawRoundedRect(ctx, (REEL_WIDTH - ctaWidth - padX * 2) / 2, ctaY - pillH / 2, ctaWidth + padX * 2, pillH, pillH / 2);
      ctx.fill();

      ctx.fillStyle = primaryColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cta, REEL_WIDTH / 2, ctaY + 4);
      ctx.restore();
    }
  },

  renderStatic(ctx, data) { this.render(ctx, 360, 450, 0.8, data); },
};
