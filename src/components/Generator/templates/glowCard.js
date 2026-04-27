// Template 20: Glow Card
// Dark moody background with glowing accent - tech/SaaS feel

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, contrastColor, fitText, drawWrappedText, drawRoundedRect, shadeColor,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'glowCard',
  name: 'Glow Card',
  description: 'Dark moody background with glowing accents. For tech, SaaS, premium products.',
  category: 'product',
  supportsStatic: true,
  defaults: {
    title: 'Built for creators',
    subtitle: 'Powerful tools, beautifully designed',
    cta: 'Try it free',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;

    // Pure black bg
    drawSolidBg(ctx, '#000000');

    // Animated glow orbs in background
    const glowProgress = subProgress(progress, 0, 0.3, easing.easeOutQuart);
    if (glowProgress > 0) {
      ctx.save();
      
      // Big primary glow
      const glow1 = ctx.createRadialGradient(
        REEL_WIDTH * 0.3, REEL_HEIGHT * 0.3, 0,
        REEL_WIDTH * 0.3, REEL_HEIGHT * 0.3, 600 * glowProgress
      );
      glow1.addColorStop(0, primaryColor + '60');
      glow1.addColorStop(1, 'transparent');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, REEL_WIDTH, REEL_HEIGHT);
      
      // Secondary glow
      const glow2 = ctx.createRadialGradient(
        REEL_WIDTH * 0.7, REEL_HEIGHT * 0.7, 0,
        REEL_WIDTH * 0.7, REEL_HEIGHT * 0.7, 600 * glowProgress
      );
      glow2.addColorStop(0, secondaryColor + '50');
      glow2.addColorStop(1, 'transparent');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, REEL_WIDTH, REEL_HEIGHT);
      
      ctx.restore();
    }

    // Animated stars
    const starsProgress = subProgress(progress, 0.05, 0.3, easing.easeOutQuad);
    if (starsProgress > 0) {
      ctx.save();
      ctx.globalAlpha = starsProgress;
      
      const stars = [
        { x: 200, y: 400, size: 4 },
        { x: 850, y: 300, size: 3 },
        { x: 600, y: 700, size: 5 },
        { x: 100, y: 1200, size: 3 },
        { x: 900, y: 1400, size: 4 },
        { x: 400, y: 1600, size: 3 },
      ];
      
      stars.forEach((star, i) => {
        const twinkle = Math.sin(progress * Math.PI * 4 + i) * 0.5 + 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = starsProgress * twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    // Glass card
    const cardProgress = subProgress(progress, 0.15, 0.45, easing.easeOutBack);
    if (cardProgress > 0) {
      ctx.save();
      const cardW = REEL_WIDTH - 160;
      const cardH = 900;
      const cardX = 80;
      const cardY = (REEL_HEIGHT - cardH) / 2;
      
      ctx.translate(cardX + cardW / 2, cardY + cardH / 2);
      ctx.scale(cardProgress, cardProgress);
      ctx.translate(-(cardX + cardW / 2), -(cardY + cardH / 2));
      ctx.globalAlpha = cardProgress;

      // Border glow
      const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      borderGrad.addColorStop(0, primaryColor);
      borderGrad.addColorStop(1, secondaryColor);
      ctx.fillStyle = borderGrad;
      drawRoundedRect(ctx, cardX - 2, cardY - 2, cardW + 4, cardH + 4, 34);
      ctx.fill();

      // Inner card (glass effect)
      ctx.fillStyle = 'rgba(15, 15, 25, 0.95)';
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
      ctx.fill();

      // Subtle inner gradient
      const innerGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
      innerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
      innerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = innerGrad;
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
      ctx.fill();

      // Top label
      ctx.fillStyle = primaryColor;
      ctx.font = `700 28px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '6px';
      ctx.fillText('● PRESENTING', cardX + cardW / 2, cardY + 80);
      ctx.letterSpacing = '0';

      // Title
      ctx.fillStyle = '#ffffff';
      const titleSize = fitText(ctx, title, cardW - 100, 110, 60, 'Inter, sans-serif', '700');
      ctx.font = `700 ${titleSize}px Inter, sans-serif`;
      drawWrappedText(ctx, title, cardX + cardW / 2, cardY + cardH * 0.4, cardW - 100, titleSize * 1.15);

      // Divider
      const divW = 60;
      const divGrad = ctx.createLinearGradient(cardX + cardW / 2 - divW / 2, 0, cardX + cardW / 2 + divW / 2, 0);
      divGrad.addColorStop(0, primaryColor);
      divGrad.addColorStop(1, secondaryColor);
      ctx.fillStyle = divGrad;
      ctx.fillRect(cardX + cardW / 2 - divW / 2, cardY + cardH * 0.55, divW, 3);

      // Subtitle
      if (subtitle) {
        ctx.fillStyle = '#a1a1aa';
        ctx.font = `400 38px Inter, sans-serif`;
        drawWrappedText(ctx, subtitle, cardX + cardW / 2, cardY + cardH * 0.65, cardW - 100, 52);
      }

      ctx.restore();
    }

    // CTA pill at bottom
    const ctaProgress = subProgress(progress, 0.55, 0.8, easing.easeOutBack);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      const ctaY = REEL_HEIGHT - 320;
      ctx.translate(REEL_WIDTH / 2, ctaY);
      ctx.scale(ctaProgress, ctaProgress);
      ctx.translate(-REEL_WIDTH / 2, -ctaY);

      ctx.font = `700 42px Inter, sans-serif`;
      const ctaWidth = ctx.measureText(cta).width;
      const padX = 70;
      const pillH = 84;
      
      // Glowing border pill
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 30;
      
      const grad = ctx.createLinearGradient(0, ctaY, REEL_WIDTH, ctaY);
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(1, secondaryColor);
      ctx.fillStyle = grad;
      drawRoundedRect(ctx, (REEL_WIDTH - ctaWidth - padX * 2) / 2, ctaY - pillH / 2, ctaWidth + padX * 2, pillH, pillH / 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cta + ' →', REEL_WIDTH / 2, ctaY + 4);
      ctx.restore();
    }
  },

  renderStatic(ctx, data) { this.render(ctx, 360, 450, 0.8, data); },
};
