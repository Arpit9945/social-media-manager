// Template 3: Product Showcase
// Brand name fades in → product name highlight → CTA

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, fitText, drawWrappedText, drawRoundedRect, shadeColor,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'productShowcase',
  name: 'Product Showcase',
  description: 'Sleek product reveal with brand name and CTA. Perfect for product launches.',
  category: 'product',
  supportsStatic: true,
  defaults: {
    title: 'Your Product Name',
    subtitle: 'The one thing you need',
    cta: 'Shop now • Link in bio',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, brandName, primaryColor, secondaryColor } = data;

    // Solid dark bg with subtle gradient
    drawSolidBg(ctx, '#0a0a0b');
    
    // Subtle radial accent
    const radialGrad = ctx.createRadialGradient(
      REEL_WIDTH / 2, REEL_HEIGHT / 2, 100,
      REEL_WIDTH / 2, REEL_HEIGHT / 2, 800
    );
    radialGrad.addColorStop(0, primaryColor + '33');
    radialGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, REEL_WIDTH, REEL_HEIGHT);

    // Phase 1 (0-25%): Brand name
    const brandPhase = subProgress(progress, 0.05, 0.25, easing.easeOutQuart);
    const brandFadeOut = subProgress(progress, 0.3, 0.4, easing.easeOutQuad);
    
    if (brandPhase > 0 && brandFadeOut < 1) {
      ctx.save();
      ctx.globalAlpha = brandPhase * (1 - brandFadeOut);
      ctx.fillStyle = '#ffffff';
      ctx.font = `400 36px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Animated horizontal lines around brand
      const lineWidth = 80 * brandPhase;
      ctx.fillRect(REEL_WIDTH / 2 - lineWidth - 20, REEL_HEIGHT / 2 - 1, lineWidth, 2);
      ctx.fillRect(REEL_WIDTH / 2 + 20, REEL_HEIGHT / 2 - 1, lineWidth, 2);
      
      ctx.fillStyle = primaryColor;
      ctx.font = `600 48px Inter, sans-serif`;
      ctx.fillText('PRESENTS', REEL_WIDTH / 2, REEL_HEIGHT / 2 - 80);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 72px Inter, sans-serif`;
      ctx.fillText(brandName, REEL_WIDTH / 2, REEL_HEIGHT / 2);
      ctx.restore();
    }

    // Phase 2 (40-70%): Product reveal
    const productPhase = subProgress(progress, 0.4, 0.6, easing.easeOutBack);
    const productFadeOut = subProgress(progress, 0.75, 0.85, easing.easeOutQuad);
    
    if (productPhase > 0 && productFadeOut < 1) {
      ctx.save();
      ctx.globalAlpha = productPhase * (1 - productFadeOut);
      
      // Product card
      const cardW = REEL_WIDTH - 160;
      const cardH = 600;
      const cardX = 80;
      const cardY = (REEL_HEIGHT - cardH) / 2;
      
      // Card scale-in
      ctx.translate(cardX + cardW / 2, cardY + cardH / 2);
      ctx.scale(productPhase, productPhase);
      ctx.translate(-(cardX + cardW / 2), -(cardY + cardH / 2));
      
      // Card with gradient border
      const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      cardGrad.addColorStop(0, primaryColor);
      cardGrad.addColorStop(1, secondaryColor);
      
      ctx.fillStyle = cardGrad;
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
      ctx.fill();
      
      // Inner card
      ctx.fillStyle = '#0a0a0b';
      drawRoundedRect(ctx, cardX + 4, cardY + 4, cardW - 8, cardH - 8, 28);
      ctx.fill();
      
      // Product label
      ctx.fillStyle = primaryColor;
      ctx.font = `600 32px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('NEW DROP', REEL_WIDTH / 2, cardY + 100);
      
      // Product name
      ctx.fillStyle = '#ffffff';
      const titleSize = fitText(ctx, title, cardW - 100, 100, 50, 'Inter, sans-serif', '700');
      ctx.font = `700 ${titleSize}px Inter, sans-serif`;
      drawWrappedText(ctx, title, REEL_WIDTH / 2, cardY + cardH / 2, cardW - 100, titleSize * 1.15);
      
      // Subtitle
      ctx.fillStyle = '#a1a1aa';
      ctx.font = `400 36px Inter, sans-serif`;
      drawWrappedText(ctx, subtitle, REEL_WIDTH / 2, cardY + cardH - 120, cardW - 100, 50);
      
      ctx.restore();
    }

    // Phase 3 (75-100%): CTA
    const ctaPhase = subProgress(progress, 0.75, 0.9, easing.easeOutBack);
    if (ctaPhase > 0 && cta) {
      ctx.save();
      const ctaY = REEL_HEIGHT / 2;
      ctx.translate(REEL_WIDTH / 2, ctaY);
      ctx.scale(ctaPhase, ctaPhase);
      ctx.translate(-REEL_WIDTH / 2, -ctaY);

      ctx.fillStyle = primaryColor;
      ctx.font = `600 32px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('AVAILABLE NOW', REEL_WIDTH / 2, ctaY - 200);

      // CTA pill
      ctx.font = `700 48px Inter, sans-serif`;
      const ctaWidth = ctx.measureText(cta).width;
      const padX = 80;
      
      const grad = ctx.createLinearGradient(0, ctaY - 40, REEL_WIDTH, ctaY + 40);
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(1, secondaryColor);
      ctx.fillStyle = grad;
      
      drawRoundedRect(ctx, (REEL_WIDTH - ctaWidth - padX * 2) / 2, ctaY - 50, ctaWidth + padX * 2, 100, 50);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.textBaseline = 'middle';
      ctx.fillText(cta, REEL_WIDTH / 2, ctaY + 4);
      
      ctx.restore();
    }
  },

  renderStatic(ctx, data) {
    this.render(ctx, 280, 450, 0.62, data);
  },
};
