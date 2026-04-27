// Template 14: Question Hook
// Question-style format that triggers curiosity

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, fitText, drawWrappedText, drawRoundedRect, shadeColor,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'questionHook',
  name: 'Question Hook',
  description: 'Curiosity-driving question format. Triggers comments and engagement.',
  category: 'engagement',
  supportsStatic: true,
  defaults: {
    title: 'Why are you still doing this?',
    subtitle: 'Most people get this completely wrong',
    cta: 'Comment your answer',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;

    // Dark navy bg with subtle pattern
    drawSolidBg(ctx, '#0f0f1a');

    // Floating question mark blobs
    const blobProgress = subProgress(progress, 0, 0.3, easing.easeOutQuart);
    if (blobProgress > 0) {
      ctx.save();
      ctx.globalAlpha = blobProgress * 0.15;
      ctx.fillStyle = primaryColor;
      
      const blobs = [
        { x: 150, y: 250, size: 180, delay: 0 },
        { x: REEL_WIDTH - 200, y: 600, size: 140, delay: 0.3 },
        { x: 200, y: REEL_HEIGHT - 350, size: 100, delay: 0.6 },
      ];
      
      blobs.forEach((blob) => {
        const float = Math.sin(progress * Math.PI * 2 + blob.delay) * 20;
        ctx.font = `900 ${blob.size}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', blob.x, blob.y + float);
      });
      ctx.restore();
    }

    // Top label
    const labelProgress = subProgress(progress, 0, 0.15, easing.easeOutQuart);
    if (labelProgress > 0) {
      ctx.save();
      ctx.globalAlpha = labelProgress;
      
      // Pill bg
      ctx.fillStyle = primaryColor;
      const pillW = 200;
      drawRoundedRect(ctx, (REEL_WIDTH - pillW) / 2, REEL_HEIGHT * 0.22 - 30, pillW, 60, 30);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 28px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '4px';
      ctx.fillText('QUESTION', REEL_WIDTH / 2, REEL_HEIGHT * 0.22);
      ctx.letterSpacing = '0';
      ctx.restore();
    }

    // Big question - words appear one by one
    const questionProgress = subProgress(progress, 0.15, 0.55, easing.linear);
    if (questionProgress > 0) {
      ctx.save();
      
      const words = title.split(' ');
      const visibleCount = Math.ceil(words.length * questionProgress);
      const visibleQuestion = words.slice(0, visibleCount).join(' ');
      
      ctx.fillStyle = '#ffffff';
      const titleSize = fitText(ctx, title, REEL_WIDTH - 120, 100, 60, 'Inter, sans-serif', '700');
      ctx.font = `700 ${titleSize}px Inter, sans-serif`;
      drawWrappedText(ctx, visibleQuestion, REEL_WIDTH / 2, REEL_HEIGHT * 0.45, REEL_WIDTH - 120, titleSize * 1.2);
      ctx.restore();
    }

    // Subtitle (the hook/answer tease)
    const subProg = subProgress(progress, 0.55, 0.75, easing.easeOutQuad);
    if (subProg > 0 && subtitle) {
      ctx.save();
      ctx.globalAlpha = subProg;
      ctx.translate(0, (1 - subProg) * 30);
      
      // Highlight bar
      ctx.fillStyle = primaryColor;
      ctx.fillRect(REEL_WIDTH * 0.1, REEL_HEIGHT * 0.65, (REEL_WIDTH * 0.8) * subProg, 4);
      
      ctx.fillStyle = secondaryColor;
      ctx.font = `500 italic 42px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawWrappedText(ctx, subtitle, REEL_WIDTH / 2, REEL_HEIGHT * 0.72, REEL_WIDTH - 160, 56);
      ctx.restore();
    }

    // CTA - "Comment below" style
    const ctaProgress = subProgress(progress, 0.75, 0.9, easing.easeOutBack);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      const ctaY = REEL_HEIGHT * 0.88;
      ctx.translate(REEL_WIDTH / 2, ctaY);
      ctx.scale(ctaProgress, ctaProgress);
      ctx.translate(-REEL_WIDTH / 2, -ctaY);

      // Comment icon
      ctx.fillStyle = primaryColor;
      ctx.font = `48px Apple Color Emoji, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💬', REEL_WIDTH / 2 - 200, ctaY);

      ctx.font = `700 44px Inter, sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(cta, REEL_WIDTH / 2 - 130, ctaY + 4);
      ctx.restore();
    }
  },

  renderStatic(ctx, data) { this.render(ctx, 360, 450, 0.8, data); },
};
