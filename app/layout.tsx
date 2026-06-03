import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import TweaksPanel from '@/components/TweaksPanel';

export const metadata: Metadata = {
  title: 'Blog Incrível Tech',
  description: 'Tecnologia, legalidade e crescimento em sorteios digitais.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-JYNLZLQPEE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JYNLZLQPEE');
          `}
        </Script>
      </head>
      <body>
        <ThemeProvider>
          {children}
          <TweaksPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}
