// Reel Generator Templates Registry — 20 templates total

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
// New in 3.5
import minimalClean from './minimalClean';
import boldNumbers from './boldNumbers';
import comparison from './comparison';
import questionHook from './questionHook';
import promoSale from './promoSale';
import testimonial from './testimonial';
import listicle from './listicle';
import eventAnnouncement from './eventAnnouncement';
import magazineCover from './magazineCover';
import glowCard from './glowCard';

export const TEMPLATES = [
  // Hooks & openers
  boldStatement,
  questionHook,
  textReveal,
  storyStyle,
  // Educational
  tutorial,
  tipCard,
  listicle,
  comparison,
  // Data & social proof
  statsBurst,
  boldNumbers,
  testimonial,
  // Branding
  brandReveal,
  magazineCover,
  glowCard,
  // Product
  productShowcase,
  // Engagement & CTAs
  promoSale,
  eventAnnouncement,
  ctaPush,
  // Quote / sophisticated
  quoteCard,
  minimalClean,
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
    // Logo settings
    logoUrl: brandProfile?.logo_url || null,
    showLogo: !!brandProfile?.logo_url,
    logoPosition: 'top-right',
    logoSize: 110,
    logoOpacity: 1,
    logoBackground: 'pill', // 'pill' | 'circle' | 'none'
  };
}
