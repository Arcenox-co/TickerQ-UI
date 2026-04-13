import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { Body } from './layout.client';

export const metadata: Metadata = {
  icons: {
    icon: '/tickerq-logo.svg',
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
