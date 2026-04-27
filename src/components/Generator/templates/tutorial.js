// Template 5: Tutorial / Steps
// 3 sequential steps with numbered cards

import {
  REEL_WIDTH, REEL_HEIGHT, easing, subProgress,
  drawSolidBg, drawGradientBg, contrastColor, drawWrappedText, drawRoundedRect, shadeColor, fitText,
} from '@/lib/reel/canvasEngine';

export default {
  id: 'tutorial',
  name: 'Tutorial Steps',
  description: '3-step process reveal. Perfect for how-to and educational content.',
  category: 'educational',
  supportsStatic: true,
  defaults: {
    title: 'How to grow on Instagram',
    subtitle: 'Be consistent\nPost daily content\nEngage with audience',
    cta: 'Save & follow for more',
  },

  render(ctx, frame, totalFrames, progress, data) {
    const { title, subtitle, cta, primaryColor, secondaryColor } = data;

    // Dark bg
    drawSolidBg(ctx, '#0a0a0b');
    
    // Subtle accent at top
    const headerGrad = ctx.createLinearGradient(0, 0, REEL_WIDTH, 0);
    headerGrad.addColorStop(0, primaryColor);
    headerGrad.addColorStop(1, secondaryColor);
    ctx.fillStyle = headerGrad;
    ctx.fillRect(0, 0, REEL_WIDTH, 12);

    // Title at top - slides down
    const titleProgress = subProgress(progress, 0, 0.12, easing.easeOutQuart);
    if (titleProgress > 0) {
      ctx.save();
      ctx.globalAlpha = titleProgress;
      ctx.translate(0, (1 - titleProgress) * -40);
      
      ctx.fillStyle = primaryColor;
      ctx.font = `600 32px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TUTORIAL', REEL_WIDTH / 2, 200);
      
      ctx.fillStyle = '#ffffff';
      const titleSize = fitText(ctx, title, REEL_WIDTH - 160, 72, 48, 'Inter, sans-serif', '700');
      ctx.font = `700 ${titleSize}px Inter, sans-serif`;
      drawWrappedText(ctx, title, REEL_WIDTH / 2, 320, REEL_WIDTH - 160, titleSize * 1.2);
      ctx.restore();
    }

    // Parse steps from subtitle (newline-separated)
    const steps = (subtitle || '').split('\n').map(s => s.trim()).filter(Boolean).slice(0, 3);
    if (steps.length < 3) {
      while (steps.length < 3) steps.push('Step ' + (steps.length + 1));
    }

    // Each step appears in sequence: 0.15-0.35, 0.35-0.55, 0.55-0.75
    const stepStartTimes = [0.18, 0.36, 0.54];
    const stepDuration = 0.18;

    const stepBaseY = REEL_HEIGHT * 0.5;
    const stepGap = 240;

    steps.forEach((stepText, i) => {
      const stepProgress = subProgress(progress, stepStartTimes[i], stepStartTimes[i] + stepDuration, easing.easeOutBack);
      if (stepProgress <= 0) return;

      ctx.save();
      
      const cardY = stepBaseY + (i - 1) * stepGap;
      ctx.translate(REEL_WIDTH / 2, cardY);
      ctx.scale(stepProgress, stepProgress);
      ctx.translate(-REEL_WIDTH / 2, -cardY);
      ctx.globalAlpha = stepProgress;

      const cardW = REEL_WIDTH - 160;
      const cardH = 180;
      const cardX = 80;
      const cardTop = cardY - cardH / 2;

      // Card bg
      ctx.fillStyle = shadeColor('#0a0a0b', 8);
      drawRoundedRect(ctx, cardX, cardTop, cardW, cardH, 24);
      ctx.fill();
      
      // Border accent
      ctx.strokeStyle = primaryColor + '40';
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, cardX, cardTop, cardW, cardH, 24);
      ctx.stroke();

      // Step number circle
      const circleX = cardX + 100;
      const circleY = cardY;
      const circleGrad = ctx.createLinearGradient(circleX - 50, circleY - 50, circleX + 50, circleY + 50);
      circleGrad.addColorStop(0, primaryColor);
      circleGrad.addColorStop(1, secondaryColor);
      ctx.fillStyle = circleGrad;
      ctx.beginPath();
      ctx.arc(circleX, circleY, 50, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 56px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i + 1), circleX, circleY + 4);

      // Step text
      ctx.fillStyle = '#ffffff';
      const textSize = fitText(ctx, stepText, cardW - 240, 48, 32, 'Inter, sans-serif', '600');
      ctx.font = `600 ${textSize}px Inter, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      
      const maxTextWidth = cardW - 240;
      const wrappedLines = [];
      const words = stepText.split(' ');
      let line = '';
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxTextWidth && line) {
          wrappedLines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) wrappedLines.push(line);
      
      const lineHeight = textSize * 1.2;
      const totalHeight = wrappedLines.length * lineHeight;
      const startY = cardY - totalHeight / 2 + lineHeight / 2;
      wrappedLines.forEach((l, lineIdx) => {
        ctx.fillText(l, circleX + 100, startY + lineIdx * lineHeight);
      });

      ctx.restore();
    });

    // CTA at bottom
    const ctaProgress = subProgress(progress, 0.78, 0.92, easing.easeOutQuad);
    if (ctaProgress > 0 && cta) {
      ctx.save();
      ctx.globalAlpha = ctaProgress;
      ctx.fillStyle = primaryColor;
      ctx.font = `600 40px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cta, REEL_WIDTH / 2, REEL_HEIGHT - 140);
      ctx.restore();
    }
  },

  renderStatic(ctx, data) {
    this.render(ctx, 360, 450, 0.8, data);
  },
};
