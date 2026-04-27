import { Inter, Instrument_Serif } from 'next/font/google';
import '@/styles/main.scss';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
  style: ['normal', 'italic'],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'AI Social Media Assistant by Arpit | Grow Your Instagram with AI',
    template: '%s | AI Social Media Assistant by Arpit',
  },
  description:
    'AI Social Media Assistant by Arpit - Free AI-powered tool to analyze Instagram reels, generate viral captions, create professional posts, and grow your followers. Built for creators, businesses, and influencers.',
  applicationName: 'AI Social Media Assistant by Arpit',
  authors: [{ name: 'Arpit' }],
  generator: 'Next.js',
  keywords: [
    'AI social media assistant',
    'AI Social Media Assistant by Arpit',
    'Instagram AI tool',
    'Instagram analyzer',
    'Instagram reel analyzer',
    'AI caption generator',
    'Instagram hashtag generator',
    'social media post creator',
    'AI Instagram growth',
    'viral reel ideas',
    'Instagram marketing tool',
    'free AI social media tool',
    'Instagram followers growth',
    'AI content creator',
    'social media automation',
    'Instagram post generator',
    'AI marketing assistant',
    'Indian creator tool',
    'small business Instagram',
    'reel optimization AI',
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'Arpit',
  publisher: 'Arpit',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    title: 'AI Social Media Assistant by Arpit | Grow Your Instagram with AI',
    description: 'Free AI-powered Instagram growth tool. Analyze reels, generate viral captions, create professional posts.',
    siteName: 'AI Social Media Assistant by Arpit',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AI Social Media Assistant by Arpit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Social Media Assistant by Arpit',
    description: 'Free AI-powered Instagram growth tool. Analyze reels, generate viral captions, create posts.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/icon.svg',
  },
  manifest: '/manifest.json',
  alternates: { canonical: '/' },
  category: 'technology',
};

export const viewport = {
  themeColor: '#0a0a0b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.groq.com" />
        <link rel="dns-prefetch" href="https://generativelanguage.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'AI Social Media Assistant by Arpit',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
              creator: { '@type': 'Person', name: 'Arpit' },
              description: 'Free AI-powered Instagram growth tool. Analyze reels, generate viral captions, create professional posts.',
              aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '127' },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
