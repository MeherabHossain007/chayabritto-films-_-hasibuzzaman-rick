import type {Metadata} from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css'; // Global styles

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Hasibuzzaman Rick | Chayabritto Films',
  description: 'Professional photography and film portfolio for Hasibuzzaman Rick, Founder & CEO of Chayabritto Films. Specializing in Corporate, Wedding, and Cultural events in Dhaka, Bangladesh.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="font-sans bg-stone-50 text-stone-900 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
