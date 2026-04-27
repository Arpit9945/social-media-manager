import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Hero from '@/components/Landing/Hero';
import Features from '@/components/Landing/Features';
import HowItWorks from '@/components/Landing/HowItWorks';
import Pricing from '@/components/Landing/Pricing';
import FAQ from '@/components/Landing/FAQ';
import CTA from '@/components/Landing/CTA';

export const metadata = {
  title: 'AI Social Media Assistant by Arpit | Grow Your Instagram with AI',
  description:
    'Free AI tool for Instagram growth. Analyze reels, generate viral captions, create professional posts in seconds. No credit card required. Built by Arpit for creators and businesses in India.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
