// Template 9: Brand Reveal
// Logo/initial zoom + brand name animation

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, fitText, drawWrappedText, drawRoundedRect, shadeColor,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'brandReveal',
  name: 'Brand Reveal',
  description: 'Cinematic brand intro with logo and tagline. Perfect for branding reels.',
  category: 'branding',
  supportsStatic: true,
  defaults: {
    title: 'Your Brand',
    subtitle: 'Crafted with passion',
    cta: 'Follow our journey',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, brandName, primaryColor, secondaryColor } = data;

    // Solid bg with subtle gradient on edges
    drawSolidBg(ctx, '#0a0a0b');
    
    // Vignette
    const vignette = ctx.createRadialGradient(
      REEL_WIDTH / 2, REEL_HEIGHT / 2, 400,
      REEL_WIDTH / 2, REEL_HEIGHT / 2, 1200
    );
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, primaryColor + '40');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, REEL_WIDTH, REEL_HEIGHT);

    const displayName = title || brandName || 'Your Brand';
    const initial = displayName.charAt(0).toUpperCase();

    // PHASE 1: Logo circle zooms in (0 - 0.3)
    const logoEnter = subProgress(progress, 0, 0.2, easing.easeOutBack);
    const logoMove = subProgress(progress, 0.3, 0.45, easing.easeOutCubic);
    
    if (logoEnter > 0) {
      ctx.save();
      
      // Logo position: starts center, then moves up to make room for name
      const centerX = REEL_WIDTH / 2;
      const centerY = REEL_HEIGHT / 2 - logoMove * 220;
      const logoSize = 200 - logoMove * 60;
      
      ctx.translate(centerX, centerY);
      ctx.scale(logoEnter, logoEnter);
      
      // Glow ring
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 40;
      
      // Outer ring
      const ringGrad = ctx.createLinearGradient(-logoSize, -logoSize, logoSize, logoSize);
      ringGrad.addColorStop(0, primaryColor);
      ringGrad.addColorStop(1, secondaryColor);
      ctx.fillStyle = ringGrad;
      ctx.beginPath();
      ctx.arc(0, 0, logoSize, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      
      // Inner circle
      ctx.fillStyle = '#0a0a0b';
      ctx.beginPath();
      ctx.arc(0, 0, logoSize - 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Initial letter
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${logoSize * 1.1}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initial, 0, logoSize * 0.05);
      
      ctx.restore();
    }

    // PHASE 2: Brand name appears (letter-by-letter)
    const nameProgress = subProgress(progress, 0.4, 0.65, easing.linear);
    if (nameProgress > 0) {
      ctx.save();
      
      ctx.fillStyle = '#ffffff';
      const nameSize = fitText(ctx, displayName, REEL_WIDTH - 200, 120, 72, 'Inter, sans-serif', '700');
      ctx.font = `700 ${nameSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const charsToShow = Math.floor(displayName.length * nameProgress);
      const visibleName = displayName.substring(0, charsToShow);
      ctx.fillText(visibleName, REEL_WIDTH / 2, REEL_HEIGHT / 2 + 40);
      
      ctx.restore();
    }

    // PHASE 3: Tagline + decorative line (0.65 - 0.85)
    const taglineProgress = subProgress(progress, 0.65, 0.8, easing.easeOutQuad);
    if (taglineProgress > 0 && subtitle) {
      ctx.save();
      ctx.globalAlpha = taglineProgress;
      
      // Decorative line
      const lineFullWidth = 200;
      const lineWidth = lineFullWidth * taglineProgress;
      const lineY = REEL_HEIGHT / 2 + 140;
      
      const lineGrad = ctx.createLinearGradient(0, lineY, REEL_WIDTH, lineY);
      lineGrad.addColorStop(0, primaryColor);
      lineGrad.addColorStop(1, secondaryColor);
      ctx.fillStyle = lineGrad;
      ctx.fillRect((REEL_WIDTH - lineWidth) / 2, lineY, lineWidth, 4);
      
      // Tagline
      ctx.fillStyle = '#a1a1aa';
      ctx.font = `400 italic 40px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawWrappedText(ctx, subtitle, REEL_WIDTH / 2, REEL_HEIGHT / 2 + 220, REEL_WIDTH - 200, 56);
      ctx.restore();
    }

    // PHASE 4: CTA (0.8 - 1.0)
    const ctaProgress = subProgress(progress, 0.78, 0.92, easing.easeOutBack);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      const ctaY = REEL_HEIGHT - 200;
      ctx.translate(REEL_WIDTH / 2, ctaY);
      ctx.scale(ctaProgress, ctaProgress);
      ctx.translate(-REEL_WIDTH / 2, -ctaY);

      ctx.font = `600 38px Inter, sans-serif`;
      const ctaWidth = ctx.measureText(cta).width;
      const padX = 56;
      
      // Border pill
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      drawRoundedRect(ctx, (REEL_WIDTH - ctaWidth - padX * 2) / 2, ctaY - 36, ctaWidth + padX * 2, 80, 40);
      ctx.stroke();
      
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
