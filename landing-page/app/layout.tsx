import type { Metadata } from 'next';
import { Space_Grotesk, Rajdhani, Inter } from 'next/font/google';
import './globals.css';
import { ScrollProvider } from '@/components/providers/ScrollProvider';
import { PLAUSIBLE_SCRIPT_URL } from '@/lib/plausible-events';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap'
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Energy Flow — Econometria para a Indústria Automotiva Brasileira',
  description: 'Modelagem econométrica de câmbio, supply chain e risco regulatório para decisões de capital na indústria automotiva brasileira.',
  openGraph: {
    title: 'Energy Flow — Econometria para a Indústria Automotiva Brasileira',
    description: 'A primeira volta é sua decisão.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${rajdhani.variable} ${inter.variable}`}>
      <head>
        <script async defer src={PLAUSIBLE_SCRIPT_URL} data-domain="energyflow.lab" />
      </head>
      <body>
        <ScrollProvider>{children}</ScrollProvider>
      </body>
    </html>
  );
}
