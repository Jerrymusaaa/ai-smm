import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'SocialAI — AI-Powered Social Media Manager',
  description: 'Manage all your social media platforms with AI. Create content, schedule posts, run campaigns, and analyze performance — all from one conversational interface.',
  keywords: 'AI social media manager, social media automation, AI content creation, social media analytics',
  openGraph: {
    title: 'SocialAI — AI-Powered Social Media Manager',
    description: 'One conversational AI that manages all your social media.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}