import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { CartBar } from '@/components/layout/CartBar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://hashtagprints.in'),
  title: {
    default: 'Hashtag - Custom Prints, T-Shirts, Notebooks & More | Salem',
    template: '%s | Hashtag Custom Prints',
  },
  description:
    "Hashtag is Salem's leading custom printing service. Order custom t-shirts, notebooks, mugs, photo prints, and business cards online. Fast delivery, premium quality, bulk discounts.",
  keywords: [
    'custom t-shirt printing Salem',
    'custom printing online India',
    'personalized notebook printing',
    'custom mug printing Salem',
    'photo printing online',
    'business card printing Salem',
    'bulk custom printing',
    'corporate custom printing Salem',
  ],
  icons: {
    icon: [
      { url: '/HP_Logo.png', type: 'image/png' },
    ],
    apple: '/HP_Logo.png',
    shortcut: '/HP_Logo.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Hashtag Custom Prints',
    locale: 'en_IN',
    images: [{ url: '/HP_Logo.png', width: 512, height: 512, alt: 'Hashtag Custom Prints' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/HP_Logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning translate="no" className="notranslate">
      <head>
        <link rel="icon" href="/HP_Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/HP_Logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload the splash video so it's ready instantly on mobile */}
        <link rel="preload" href="/logoanimation.mp4" as="video" type="video/mp4" />
      </head>
      <body className={`${inter.variable} antialiased flex flex-col min-h-dvh`}>
        <Providers>
          <Header />
          <main id="main-content" className="flex-1 pb-nav lg:pb-0">
            {children}
          </main>
          <Footer />
          <CartBar />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
