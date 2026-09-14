import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  weight: ["400", "500", "700"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://misr-assistant.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "مساعد مصر — دليلك للخدمات الحكومية",
    template: "%s | مساعد مصر",
  },
  description:
    "منصة مصرية تبسّط وتجمّع المعلومات الحكومية الرسمية — المستندات، الخطوات، الرسوم، الأماكن، أرقام الطوارئ، ومساعد ذكي يفهم العامية.",
  keywords: [
    "مساعد مصر",
    "خدمات حكومية",
    "خدمات حكومية مصرية",
    "بطاقة الرقم القومي",
    "جواز سفر",
    "رخصة قيادة",
    "أرقام الطوارئ",
    "مصالح حكومية",
    "السجل المدني",
    "الشهر العقاري",
  ],
  authors: [{ name: "Misr Assistant" }],
  creator: "Misr Assistant",
  publisher: "Misr Assistant",
  category: "Government Services",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: SITE_URL,
    siteName: "مساعد مصر",
    title: "مساعد مصر — دليلك للخدمات الحكومية",
    description:
      "منصة مصرية تبسّط المعلومات الحكومية الرسمية — بحث ذكي، مصادر موثقة، ومساعد AI يفهم العامية.",
  },
  twitter: {
    card: "summary_large_image",
    title: "مساعد مصر — دليلك للخدمات الحكومية",
    description:
      "منصة مصرية تبسّط المعلومات الحكومية الرسمية — بحث ذكي، مصادر موثقة، ومساعد AI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable + " " + tajawal.variable}>
      <head>
        <meta name="theme-color" content="#ce1126" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="مساعد مصر" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <FloatingChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}