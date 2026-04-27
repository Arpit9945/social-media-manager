// Template 15: Promo / Sale
// Bold flash-sale energy

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, fitText, drawWrappedText, drawRoundedRect,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'promoSale',
  name: 'Flash Sale',
  description: 'Discount/promo announcement with high-energy visuals.',
  category: 'cta',
  supportsStatic: true,
  defaults: {
    title: '50% OFF',
    subtitle: 'Limited time only',
    cta: 'Shop now • Link in bio',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;

    // Bright energetic gradient
    drawGradientBg(ctx, '#dc2626', '#ea580c', 135 + Math.sin(progress * Math.PI * 2) * 30);

    // Lightning bolt decorations
    const boltProgress = subProgress(progress, 0, 0.15, easing.easeOutQuart);
    if (boltProgress > 0) {
      ctx.save();
      ctx.globalAlpha = boltProgress * 0.25;
      ctx.fillStyle = '#ffffff';
      ctx.font = `200px Apple Color Emoji, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const float1 = Math.sin(progress * Math.PI * 4) * 15;
      const float2 = Math.cos(progress * Math.PI * 4) * 15;
      ctx.fillText('⚡', 200, 350 + float1);
      ctx.fillText('⚡', REEL_WIDTH - 200, REEL_HEIGHT - 400 + float2);
      ctx.restore();
    }

    // Top "FLASH SALE" tag
    const tagProgress = subProgress(progress, 0, 0.2, easing.easeOutBack);
    if (tagProgress > 0) {
      ctx.save();
      const tagY = REEL_HEIGHT * 0.25;
      ctx.translate(REEL_WIDTH / 2, tagY);
      ctx.scale(tagProgress, tagProgress);
      ctx.translate(-REEL_WIDTH / 2, -tagY);

      // Yellow strikethrough banner
      ctx.fillStyle = '#fbbf24';
      ctx.save();
      ctx.translate(REEL_WIDTH / 2, tagY);
      ctx.rotate(-0.05);
      ctx.fillRect(-REEL_WIDTH / 2 - 50, -50, REEL_WIDTH + 100, 100);
      ctx.fillStyle = '#0a0a0b';
      ctx.font = `900 64px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '4px';
      ctx.fillText('⚡ FLASH SALE ⚡', 0, 4);
      ctx.letterSpacing = '0';
      ctx.restore();
      ctx.restore();
    }

    // BIG DISCOUNT TEXT (title)
    const discountProgress = subProgress(progress, 0.2, 0.5, easing.easeOutBack);
    if (discountProgress > 0) {
      ctx.save();
      const pulse = 1 + Math.sin(progress * Math.PI * 6) * 0.04;
      ctx.translate(REEL_WIDTH / 2, REEL_HEIGHT * 0.5);
      ctx.scale(discountProgress * pulse, discountProgress * pulse);
      
      // Outline + fill
      ctx.fillStyle = '#ffffff';
      const titleSize = fitText(ctx, title, REEL_WIDTH - 100, 280, 160, 'Inter, sans-serif', '900');
      ctx.font = `900 ${titleSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, 0, 0);
      
      // Yellow underline
      const lineWidth = ctx.measureText(title).width * 0.8;
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-lineWidth / 2, titleSize / 2 + 20, lineWidth, 12);
      
      ctx.restore();
    }

    // Subtitle (urgency)
    const subProg = subProgress(progress, 0.5, 0.7, easing.easeOutCubic);
    if (subProg > 0 && subtitle) {
      ctx.save();
      ctx.globalAlpha = subProg;
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 italic 56px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawWrappedText(ctx, subtitle, REEL_WIDTH / 2, REEL_HEIGHT * 0.72, REEL_WIDTH - 160, 76);
      ctx.restore();
    }

    // CTA pill
    const ctaProgress = subProgress(progress, 0.7, 0.88, easing.easeOutBack);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      const ctaY = REEL_HEIGHT * 0.88;
      const pulse = 1 + Math.sin(progress * Math.PI * 8) * 0.03;
      ctx.translate(REEL_WIDTH / 2, ctaY);
      ctx.scale(ctaProgress * pulse, ctaProgress * pulse);
      ctx.translate(-REEL_WIDTH / 2, -ctaY);

      ctx.font = `800 44px Inter, sans-serif`;
      const ctaWidth = ctx.measureText(cta).width;
      const padX = 60;
      
      ctx.shadowColor = '#0a0a0b';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#0a0a0b';
      drawRoundedRect(ctx, (REEL_WIDTH - ctaWidth - padX * 2) / 2, ctaY - 40, ctaWidth + padX * 2, 90, 45);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#fbbf24';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cta, REEL_WIDTH / 2, ctaY + 4);
      ctx.restore();
    }
  },

  renderStatic(ctx, data) { this.render(ctx, 360, 450, 0.8, data); },
};
