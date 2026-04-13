import { Figtree } from 'next/font/google';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions, fdLayoutWidthStyle } from '@/lib/layout.shared';
import { cn } from '@/lib/cn';
import { LandingNavbar } from '@/app/(home)/_components/landing-navbar';

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  const options = baseOptions();
  return (
    <HomeLayout
      style={fdLayoutWidthStyle}
      className={cn(
        figtree.variable,
        'font-sans',
        '[--font-sans:var(--font-figtree),ui-sans-serif,system-ui,sans-serif]',
        'dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)] [--color-fd-primary:var(--color-brand)] [--color-fd-primary-foreground:var(--color-brand-foreground)]',
      )}
      {...options}
      slots={{ ...options.slots, header: LandingNavbar }}
    >
      {children}
    </HomeLayout>
  );
}
