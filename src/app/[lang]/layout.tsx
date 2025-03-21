import type { Metadata } from "next";
import { Cormorant, Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import I18nProvider from "../i18/provider";
import styles from "../styles/contact.module.css";
import ContactPage from "../components/ContactPage";
import Header from "../components/Header";

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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} ${cormorant.variable} antialiased`}
      >
        <I18nProvider>
        <Header />

          {children}
          <ContactPage />
        </I18nProvider>
      </body>
    </html>
  );
}
