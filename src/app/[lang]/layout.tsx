import type { Metadata } from "next";
import { Cormorant, Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import I18nProvider from "../i18/provider";
import styles from "../styles/contact.module.css";
import ContactPage from "../components/ContactPage";
import Header from "../components/Header";
import StructuredData from "../components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});
const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'COCO - Премиальные сумки в Ташкенте | Интернет-магазин сумок',
    template: '%s | COCO'
  },
  description: 'Купить стильные и качественные сумки в Ташкенте. Широкий ассортимент женских сумок, рюкзаков и аксессуаров. Доставка по Узбекистану ✓ Выгодные цены ✓ Премиальное качество',
  keywords: 'сумки, женские сумки, купить сумку, сумки в Ташкенте, магазин сумок, брендовые сумки, рюкзаки, клатчи, аксессуары, COCO, сумки Узбекистан',
  authors: [{ name: 'COCO' }],
  creator: 'COCO',
  publisher: 'COCO',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://coco20.uz'),
  alternates: {
    canonical: '/',
    languages: {
      'ru-UZ': '/ru',
      'uz-UZ': '/uz',
    },
  },
  openGraph: {
    title: 'COCO - Премиальные сумки в Ташкенте',
    description: 'Купить стильные и качественные сумки в Ташкенте. Широкий ассортимент женских сумок, рюкзаков и аксессуаров.',
    url: 'https://coco20.uz',
    siteName: 'COCO',
    locale: 'ru_UZ',
    type: 'website',
    images: [
      {
        url: '/coco.png',
        width: 1200,
        height: 630,
        alt: 'COCO - Магазин премиальных сумок в Ташкенте',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
    yandex: 'your-yandex-verification-code', // Add your Yandex Webmaster verification code
  },
  category: 'shopping',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body

        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} ${cormorant.variable} antialiased`}
      >
        <link rel="icon" href="/logo-3.svg" />
        <I18nProvider>
          <Header />
          {children}
          <ContactPage />
        </I18nProvider>
      </body>
    </html>
  );
}
