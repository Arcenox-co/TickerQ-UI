import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { Body } from './layout.client';
import { VersionedSearchDialog } from '@/components/docs/search-dialog';

export const metadata: Metadata = {
  title: {
    default: 'TickerQ — Background jobs for .NET',
    template: '%s | TickerQ',
  },
  description:
    'Schedule .NET jobs and workflows with a self-hosted dashboard, EF Core, MongoDB, Redis, and configurable alerts.',
  icons: {
    icon: '/tickerq-logo.svg',
  },
  metadataBase: new URL('https://tickerq.net'),
  openGraph: {
    title: 'TickerQ — Background jobs for .NET',
    description:
      'Background jobs, workflows, and monitoring for .NET.',
    url: 'https://tickerq.net',
    siteName: 'TickerQ',
    type: 'website',
  },
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <Body>
        <RootProvider theme={{ disableTransitionOnChange: false }} search={{ SearchDialog: VersionedSearchDialog }}>
          {children}
        </RootProvider>
      </Body>
    </html>
  );
}
