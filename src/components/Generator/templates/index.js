// Reel Generator Templates Registry
// Each template: { id, name, description, icon, category, supportsStatic, render(ctx, frame, totalFrames, progress, data) }

import textReveal from './textReveal';
import boldStatement from './boldStatement';
import productShowcase from './productShowcase';
import quoteCard from './quoteCard';
import tutorial from './tutorial';
import tipCard from './tipCard';
import statsBurst from './statsBurst';
import storyStyle from './storyStyle';
import brandReveal from './brandReveal';
import ctaPush from './ctaPush';

export const TEMPLATES = [
  textReveal,
  boldStatement,
  productShowcase,
  quoteCard,
  tutorial,
  tipCard,
  statsBurst,
  storyStyle,
  brandReveal,
  ctaPush,
];

export const TEMPLATES_BY_ID = TEMPLATES.reduce((acc, t) => {
  acc[t.id] = t;
  return acc;
}, {});

export function getTemplateById(id) {
  return TEMPLATES_BY_ID[id] || TEMPLATES[0];
}

// Default form data for a template
export function getDefaultData(template, brandProfile) {
  return {
    title: template.defaults?.title || '',
    subtitle: template.defaults?.subtitle || '',
    cta: template.defaults?.cta || '',
    extraText: template.defaults?.extraText || '',
    brandName: brandProfile?.brand_name || 'Your Brand',
    primaryColor: brandProfile?.primary_color || '#8b5cf6',
    secondaryColor: brandProfile?.secondary_color || '#ec4899',
    accentColor: brandProfile?.accent_color || '#0a0a0b',
  };
}
