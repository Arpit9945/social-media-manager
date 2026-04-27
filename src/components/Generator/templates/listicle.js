// Template 17: Listicle (Top 5)
// Numbered list with sequential reveal

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, fitText, drawWrappedText, drawRoundedRect, shadeColor,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'listicle',
  name: 'Top 5 List',
  description: '5-item numbered list with countdown reveal. For "5 reasons" style content.',
  category: 'educational',
  supportsStatic: true,
  defaults: {
    title: '5 reasons to start today',
    subtitle: 'Save time\nMake money\nBuild skills\nGrow audience\nEnjoy life',
    cta: 'Save for later',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;

    // Dark gradient
    drawGradientBg(ctx, '#0f0f1a', shadeColor(primaryColor, -55), 180);

    // Header
    const titleProgress = subProgress(progress, 0, 0.12, easing.easeOutQuart);
    if (titleProgress > 0) {
      ctx.save();
      ctx.globalAlpha = titleProgress;
      ctx.fillStyle = primaryColor;
      ctx.font = `700 32px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '6px';
      ctx.fillText('TOP 5', REEL_WIDTH / 2, 200);
      ctx.letterSpacing = '0';

      ctx.fillStyle = '#ffffff';
      const titleSize = fitText(ctx, title, REEL_WIDTH - 160, 64, 40, 'Inter, sans-serif', '700');
      ctx.font = `700 ${titleSize}px Inter, sans-serif`;
      drawWrappedText(ctx, title, REEL_WIDTH / 2, 290, REEL_WIDTH - 160, titleSize * 1.2);
      ctx.restore();
    }

    // Parse list items (newline separated)
    const items = (subtitle || '').split('\n').map(s => s.trim()).filter(Boolean).slice(0, 5);
    while (items.length < 5) items.push(`Item ${items.length + 1}`);

    // List items - reveal in sequence
    const listStart = REEL_HEIGHT * 0.4;
    const itemHeight = 130;
    const itemGap = 20;
    
    // Each item gets ~0.1 of total time
    items.forEach((item, i) => {
      const itemStart = 0.15 + i * 0.13;
      const itemProgress = subProgress(progress, itemStart, itemStart + 0.15, easing.easeOutBack);
      if (itemProgress <= 0) return;

      ctx.save();
      const itemY = listStart + i * (itemHeight + itemGap);
      
      // Slide from right
      const offsetX = (1 - itemProgress) * 100;
      ctx.translate(offsetX, 0);
      ctx.globalAlpha = itemProgress;

      // Card
      const cardX = 80;
      const cardW = REEL_WIDTH - 160;
      ctx.fillStyle = shadeColor('#ffffff', -85);
      drawRoundedRect(ctx, cardX, itemY, cardW, itemHeight, 16);
      ctx.fill();

      // Number circle
      const numGrad = ctx.createLinearGradient(cardX + 30, itemY + 30, cardX + 100, itemY + 100);
      numGrad.addColorStop(0, primaryColor);
      numGrad.addColorStop(1, secondaryColor);
      ctx.fillStyle = numGrad;
      ctx.beginPath();
      ctx.arc(cardX + 70, itemY + itemHeight / 2, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = `900 44px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Reverse order for "countdown" feel: 5, 4, 3, 2, 1
      ctx.fillText(String(5 - i), cardX + 70, itemY + itemHeight / 2 + 2);

      // Item text
      ctx.fillStyle = '#ffffff';
      const itemSize = fitText(ctx, item, cardW - 180, 42, 28, 'Inter, sans-serif', '600');
      ctx.font = `600 ${itemSize}px Inter, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(item, cardX + 140, itemY + itemHeight / 2 + 2, cardW - 180);
      
      ctx.restore();
    });

    // CTA at bottom
    const ctaProgress = subProgress(progress, 0.85, 0.95, easing.easeOutQuad);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      ctx.globalAlpha = ctaProgress;
      ctx.fillStyle = primaryColor;
      ctx.font = `700 32px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`↓ ${cta} ↓`, REEL_WIDTH / 2, REEL_HEIGHT - 100);
      ctx.restore();
    }
  },

  renderStatic(ctx, data) { this.render(ctx, 380, 450, 0.85, data); },
};
