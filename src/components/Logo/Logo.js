'use client';

import { useId } from 'react';

// Reusable ASMA Logo Component
// Use throughout the app for consistent branding
// Concept: Stylized "A" with crossbar + AI spark dot

export default function Logo({ size = 32, showText = true, textSize = 'md', className = '' }) {
  const textSizes = {
    sm: '1rem',
    md: '1.25rem',
    lg: '1.5rem',
    xl: '1.75rem',
  };

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}>
      <LogoMark size={size} />
      {showText && (
        <span
          style={{
            fontSize: textSizes[textSize] || textSizes.md,
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: 'currentColor',
            fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          ASMA
        </span>
      )}
    </span>
  );
}

export function LogoMark({ size = 32 }) {
  // useId() returns a stable ID that's the same on server and client
  // This prevents React hydration mismatch errors
  const reactId = useId();
  // Sanitize for use in SVG IDs (remove colons that React's useId adds)
  const id = reactId.replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ASMA logo"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
        </linearGradient>
      </defs>

      {/* Rounded square background with gradient */}
      <rect width="40" height="40" rx="10" fill={`url(#${id}-bg)`} />

      {/* Subtle inner shine for depth */}
      <rect width="40" height="40" rx="10" fill={`url(#${id}-shine)`} />

      {/* Stylized "A" - clean, modern, slightly geometric */}
      <path
        d="M13 28L20 12L27 28"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Crossbar of A */}
      <path
        d="M16 22L24 22"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* AI spark / growth signal - small dot */}
      <circle cx="29" cy="13" r="2" fill="white" />
    </svg>
  );
}
