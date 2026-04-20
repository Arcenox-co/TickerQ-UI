import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { Body } from './layout.client';

export const metadata: Metadata = {
  title: {
    default: 'TickerQ — Background jobs for .NET',
    template: '%s | TickerQ',
  },
  description:
    'Source-generated, Native AOT ready background job scheduler for .NET. Persist with EF Core or Redis, monitor with a real-time dashboard.',
  icons: {
    icon: '/tickerq-logo.svg',
  },
  metadataBase: new URL('https://tickerq.net'),
  openGraph: {
    title: 'TickerQ — Background jobs for .NET',
    description:
      'Source-generated, Native AOT ready background job scheduler for .NET.',
    url: 'https://tickerq.net',
    siteName: 'TickerQ',
    type: 'website',
  },
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <Body>
        <RootProvider theme={{ disableTransitionOnChange: false }}>
          {children}
        </RootProvider>
      </Body>
    </html>
  );
}
