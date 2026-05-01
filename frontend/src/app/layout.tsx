import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import '../styles/globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Yoyzie AI — Kenya's #1 AI Social Media Manager",
  description: 'AI-powered social media management, influencer marketing, and content creation platform built for Kenya.',
  keywords: 'social media management Kenya, AI content creation, influencer marketing Kenya, Yoyzie AI',
  icons: {
    icon: '/images/yoyzie-logo.jpg',
    apple: '/images/yoyzie-logo.jpg',
  },
  openGraph: {
    title: 'Yoyzie AI',
    description: "Kenya's most intelligent AI-powered social media platform",
    type: 'website',
    siteName: 'Yoyzie AI',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
