// Template 6: Tip Card
// "DID YOU KNOW?" with reveal animation

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, fitText, drawWrappedText, drawRoundedRect, shadeColor,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'tipCard',
  name: 'Did You Know',
  description: 'Tip card with curiosity-driven reveal. Great for facts and insights.',
  category: 'educational',
  supportsStatic: true,
  defaults: {
    title: '93% of people scroll past good content',
    subtitle: 'Make yours stop the scroll',
    cta: 'Try this tip today',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;

    // Animated gradient bg
    drawGradientBg(ctx, primaryColor, shadeColor(primaryColor, -40), 135, progress * 0.2);

    // Lightbulb icon area at top - circle pulses
    const iconProgress = subProgress(progress, 0, 0.2, easing.easeOutBack);
    if (iconProgress > 0) {
      ctx.save();
      const iconY = REEL_HEIGHT * 0.25;
      const pulseScale = 1 + Math.sin(progress * Math.PI * 4) * 0.05;
      
      ctx.translate(REEL_WIDTH / 2, iconY);
      ctx.scale(iconProgress * pulseScale, iconProgress * pulseScale);
      
      // Glow
      const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 200);
      glowGrad.addColorStop(0, '#ffffff80');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(-200, -200, 400, 400);
      
      // Lightbulb emoji
      ctx.font = `120px Apple Color Emoji, Segoe UI Emoji, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💡', 0, 0);
      ctx.restore();
    }

    // "DID YOU KNOW?" header
    const headerProgress = subProgress(progress, 0.15, 0.3, easing.easeOutQuart);
    if (headerProgress > 0) {
      ctx.save();
      ctx.globalAlpha = headerProgress;
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 56px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Letter-by-letter spacing animation
      const text = 'DID YOU KNOW?';
      const spacing = 4 + (1 - headerProgress) * 16;
      ctx.letterSpacing = `${spacing}px`;
      ctx.fillText(text, REEL_WIDTH / 2, REEL_HEIGHT * 0.4);
      ctx.letterSpacing = '0px';
      ctx.restore();
    }

    // Main fact (big white card)
    const cardProgress = subProgress(progress, 0.3, 0.55, easing.easeOutBack);
    if (cardProgress > 0) {
      ctx.save();
      
      const cardW = REEL_WIDTH - 120;
      const cardH = 480;
      const cardX = 60;
      const cardY = REEL_HEIGHT * 0.5;
      
      ctx.translate(cardX + cardW / 2, cardY + cardH / 2);
      ctx.scale(cardProgress, cardProgress);
      ctx.translate(-(cardX + cardW / 2), -(cardY + cardH / 2));
      ctx.globalAlpha = cardProgress;

      // Card shadow
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 12;
      ctx.fillStyle = '#ffffff';
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Fact text
      ctx.fillStyle = '#0a0a0b';
      const titleSize = fitText(ctx, title, cardW - 100, 76, 44, 'Inter, sans-serif', '700');
      ctx.font = `700 ${titleSize}px Inter, sans-serif`;
      drawWrappedText(ctx, title, REEL_WIDTH / 2, cardY + cardH / 2, cardW - 100, titleSize * 1.2);
      
      ctx.restore();
    }

    // Subtitle below card
    const subProg = subProgress(progress, 0.6, 0.75, easing.easeOutQuad);
    if (subProg > 0 && subtitle) {
      ctx.save();
      ctx.globalAlpha = subProg;
      ctx.fillStyle = '#ffffff';
      ctx.font = `500 36px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawWrappedText(ctx, subtitle, REEL_WIDTH / 2, REEL_HEIGHT * 0.85, REEL_WIDTH - 200, 50);
      ctx.restore();
    }

    // CTA pill
    const ctaProgress = subProgress(progress, 0.78, 0.92, easing.easeOutBack);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      const ctaY = REEL_HEIGHT - 120;
      ctx.translate(REEL_WIDTH / 2, ctaY);
      ctx.scale(ctaProgress, ctaProgress);
      ctx.translate(-REEL_WIDTH / 2, -ctaY);

      ctx.font = `600 36px Inter, sans-serif`;
      const ctaWidth = ctx.measureText(cta).width;
      const padX = 48;
      
      ctx.fillStyle = '#0a0a0b';
      drawRoundedRect(ctx, (REEL_WIDTH - ctaWidth - padX * 2) / 2, ctaY - 32, ctaWidth + padX * 2, 72, 36);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
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
