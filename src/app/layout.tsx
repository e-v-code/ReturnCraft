import Providers from '@/components/Providers';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ReturnCraft",
  description: "ReturnCraft Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
