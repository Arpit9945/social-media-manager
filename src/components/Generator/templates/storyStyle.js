// Template 8: Story Style
// Kinetic full-screen text that changes phrase by phrase

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, fitText, drawWrappedText, shadeColor,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'storyStyle',
  name: 'Story Style',
  description: 'Multi-phrase kinetic text. Phrases build a story with timing.',
  category: 'text',
  supportsStatic: true,
  defaults: {
    title: 'You scrolled past 10 reels',
    subtitle: 'But this one stopped you',
    cta: 'Want to know why?\nFollow for more',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;
    const textColor = contrastColor(primaryColor);

    // Bg color shifts subtly
    const bgT = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
    const bg1 = shadeColor(primaryColor, -30);
    const bg2 = shadeColor(secondaryColor, -40);
    drawGradientBg(ctx, bg1, bg2, 135 + progress * 60);

    // PHASE 1: Title (0 - 0.35) — text scales in, then shrinks slightly + moves up
    const titleEnter = subProgress(progress, 0, 0.15, easing.easeOutBack);
    const titleExit = subProgress(progress, 0.35, 0.45, easing.easeOutQuad);
    
    if (titleEnter > 0 && titleExit < 1) {
      ctx.save();
      const opacity = titleEnter * (1 - titleExit);
      ctx.globalAlpha = opacity;
      
      // During exit: shrink and move up
      const yOffset = titleExit * -200;
      const scale = 1 - titleExit * 0.5;
      
      ctx.translate(REEL_WIDTH / 2, REEL_HEIGHT * 0.5 + yOffset);
      ctx.scale(scale * titleEnter, scale * titleEnter);
      
      ctx.fillStyle = textColor;
      const titleSize = fitText(ctx, title, REEL_WIDTH - 100, 110, 64, 'Inter, sans-serif', '800');
      ctx.font = `800 ${titleSize}px Inter, sans-serif`;
      drawWrappedText(ctx, title, 0, 0, REEL_WIDTH - 100, titleSize * 1.15);
      ctx.restore();
    }

    // PHASE 2: Subtitle (0.4 - 0.7) — Different position, dramatic entry
    const subEnter = subProgress(progress, 0.4, 0.55, easing.easeOutBack);
    const subExit = subProgress(progress, 0.68, 0.78, easing.easeOutQuad);
    
    if (subEnter > 0 && subExit < 1 && subtitle) {
      ctx.save();
      ctx.globalAlpha = subEnter * (1 - subExit);
      
      const yOffset = subExit * -200;
      ctx.translate(REEL_WIDTH / 2, REEL_HEIGHT * 0.45 + yOffset);
      
      // Slide from right
      const xOffset = (1 - subEnter) * 200;
      ctx.translate(xOffset, 0);
      
      ctx.fillStyle = primaryColor;
      ctx.font = `700 56px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('BUT...', 0, -120);
      
      ctx.fillStyle = textColor;
      const subSize = fitText(ctx, subtitle, REEL_WIDTH - 100, 110, 64, 'Inter, sans-serif', '800');
      ctx.font = `800 ${subSize}px Inter, sans-serif`;
      drawWrappedText(ctx, subtitle, 0, 60, REEL_WIDTH - 100, subSize * 1.15);
      ctx.restore();
    }

    // PHASE 3: CTA (0.75 - 1.0) — Final reveal
    const ctaEnter = subProgress(progress, 0.72, 0.88, easing.easeOutCubic);
    if (ctaEnter > 0 && cta) {
      ctx.save();
      ctx.globalAlpha = ctaEnter;
      
      // Two-line CTA support
      const ctaLines = cta.split('\n');
      const yBase = REEL_HEIGHT * 0.5;
      const lineGap = 90;
      
      ctaLines.forEach((line, i) => {
        const lineY = yBase + (i - (ctaLines.length - 1) / 2) * lineGap;
        const slideOffset = (1 - ctaEnter) * 60 * (i % 2 === 0 ? 1 : -1);
        
        ctx.fillStyle = i === 0 ? textColor : primaryColor;
        ctx.font = i === 0 ? `800 76px Inter, sans-serif` : `600 56px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(line, REEL_WIDTH / 2 + slideOffset, lineY);
      });
      ctx.restore();
    }

    // Progress dots at bottom
    const dotsProg = subProgress(progress, 0.05, 0.1, easing.easeOutQuad);
    if (dotsProg > 0) {
      ctx.save();
      ctx.globalAlpha = dotsProg;
      const phases = 3;
      const dotSize = 12;
      const dotGap = 24;
      const totalWidth = phases * dotSize + (phases - 1) * dotGap;
      const startX = (REEL_WIDTH - totalWidth) / 2;
      const dotY = REEL_HEIGHT - 100;
      
      const activePhase = progress < 0.4 ? 0 : progress < 0.72 ? 1 : 2;
      
      for (let i = 0; i < phases; i++) {
        ctx.fillStyle = i <= activePhase ? textColor : textColor + '40';
        ctx.beginPath();
        ctx.arc(startX + i * (dotSize + dotGap) + dotSize / 2, dotY, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  },

  renderStatic(ctx, data) {
    // Render middle phase for static
    this.render(ctx, 220, 450, 0.49, data);
  },
};
