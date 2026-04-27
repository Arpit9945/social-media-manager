// Template 10: CTA Push
// Strong call-to-action with arrow animations

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, fitText, drawWrappedText, drawRoundedRect, shadeColor,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'ctaPush',
  name: 'CTA Push',
  description: 'High-conversion call-to-action with arrows and pulse. For landing-page reels.',
  category: 'cta',
  supportsStatic: true,
  defaults: {
    title: 'Link in bio',
    subtitle: 'Get yours before they run out',
    cta: 'Tap now ↑',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;
    const textColor = contrastColor(primaryColor);

    // Animated bg with sweep
    drawGradientBg(ctx, primaryColor, secondaryColor, 135 + progress * 30);

    // Diagonal stripes overlay (subtle)
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = textColor;
    const stripeOffset = (progress * 200) % 80;
    for (let x = -100 + stripeOffset; x < REEL_WIDTH + 100; x += 80) {
      ctx.save();
      ctx.translate(x, 0);
      ctx.rotate(-Math.PI / 6);
      ctx.fillRect(0, -REEL_HEIGHT, 30, REEL_HEIGHT * 3);
      ctx.restore();
    }
    ctx.restore();

    // ATTENTION ICON - bouncy entrance
    const iconProgress = subProgress(progress, 0, 0.15, easing.easeOutBack);
    if (iconProgress > 0) {
      ctx.save();
      const iconY = REEL_HEIGHT * 0.22;
      const bounce = Math.sin(progress * Math.PI * 6) * 8;
      ctx.translate(REEL_WIDTH / 2, iconY + bounce);
      ctx.scale(iconProgress, iconProgress);
      
      ctx.font = `120px Apple Color Emoji, Segoe UI Emoji, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👆', 0, 0);
      ctx.restore();
    }

    // SUBTITLE on top (urgency text)
    const subProg = subProgress(progress, 0.1, 0.25, easing.easeOutQuad);
    if (subProg > 0 && subtitle) {
      ctx.save();
      ctx.globalAlpha = subProg;
      ctx.fillStyle = textColor;
      ctx.font = `600 38px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawWrappedText(ctx, subtitle, REEL_WIDTH / 2, REEL_HEIGHT * 0.35, REEL_WIDTH - 160, 52);
      ctx.restore();
    }

    // BIG TITLE - explosive entry, pulsing
    const titleProgress = subProgress(progress, 0.2, 0.4, easing.easeOutBack);
    if (titleProgress > 0) {
      ctx.save();
      const pulse = 1 + Math.sin(progress * Math.PI * 4) * 0.04;
      ctx.translate(REEL_WIDTH / 2, REEL_HEIGHT * 0.5);
      ctx.scale(titleProgress * pulse, titleProgress * pulse);
      
      // Title bg pill
      ctx.fillStyle = textColor;
      const titleSize = fitText(ctx, title.toUpperCase(), REEL_WIDTH - 200, 140, 80, 'Inter, sans-serif', '900');
      ctx.font = `900 ${titleSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const titleWidth = ctx.measureText(title.toUpperCase()).width;
      const padX = 60;
      const padY = 30;
      
      drawRoundedRect(ctx, -titleWidth / 2 - padX, -titleSize / 2 - padY, titleWidth + padX * 2, titleSize + padY * 2, 24);
      ctx.fill();
      
      ctx.fillStyle = primaryColor;
      ctx.fillText(title.toUpperCase(), 0, 4);
      ctx.restore();
    }

    // Animated arrows (multiple, bouncy)
    const arrowsProgress = subProgress(progress, 0.4, 0.55, easing.easeOutQuad);
    if (arrowsProgress > 0) {
      ctx.save();
      ctx.globalAlpha = arrowsProgress;
      
      const arrowsY = REEL_HEIGHT * 0.7;
      const arrowSize = 60;
      
      // 3 arrows pointing up, staggered
      for (let i = 0; i < 3; i++) {
        const arrowX = REEL_WIDTH / 2 + (i - 1) * 80;
        const arrowOffset = Math.sin(progress * Math.PI * 4 - i * 0.5) * 16;
        const opacity = 0.4 + Math.sin(progress * Math.PI * 4 - i * 0.5) * 0.3;
        
        ctx.fillStyle = textColor;
        ctx.globalAlpha = opacity * arrowsProgress;
        
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowsY + arrowOffset);
        ctx.lineTo(arrowX - arrowSize / 2, arrowsY + arrowSize / 2 + arrowOffset);
        ctx.lineTo(arrowX + arrowSize / 2, arrowsY + arrowSize / 2 + arrowOffset);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // CTA at bottom - pulsing pill
    const ctaProgress = subProgress(progress, 0.55, 0.75, easing.easeOutBack);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      const ctaY = REEL_HEIGHT * 0.85;
      const pulse = 1 + Math.sin(progress * Math.PI * 6) * 0.03;
      
      ctx.translate(REEL_WIDTH / 2, ctaY);
      ctx.scale(ctaProgress * pulse, ctaProgress * pulse);
      ctx.translate(-REEL_WIDTH / 2, -ctaY);

      ctx.font = `700 56px Inter, sans-serif`;
      const ctaWidth = ctx.measureText(cta).width;
      const padX = 80;
      const pillHeight = 110;
      
      // Glowing pill
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 30;
      ctx.fillStyle = textColor;
      drawRoundedRect(ctx, (REEL_WIDTH - ctaWidth - padX * 2) / 2, ctaY - pillHeight / 2, ctaWidth + padX * 2, pillHeight, pillHeight / 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = primaryColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cta, REEL_WIDTH / 2, ctaY + 4);
      ctx.restore();
    }
  },

  renderStatic(ctx, data) {
    this.render(ctx, 360, 450, 0.8, data);
  },
};
