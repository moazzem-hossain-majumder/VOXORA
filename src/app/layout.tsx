import type { Metadata, Viewport } from 'next';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jet-brains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VOXORA — Your AI English Speaking Companion',
  description:
    'Stop translating in your head. Start speaking naturally. An immersive AI English-speaking companion with real-time conversations, voice interaction, and structured pedagogical feedback.',
  keywords: [
    'English speaking practice',
    'AI speaking companion',
    'IELTS speaking simulator',
    'English teacher AI',
    'interview coach',
    'pronunciation practice',
    'VOXORA',
  ],
  authors: [{ name: 'VOXORA Team' }],
};

export const viewport: Viewport = {
  themeColor: '#0A0C10',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0A0C10] text-[#F4F4F6] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
