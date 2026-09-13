import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "مساعد مصر — دليلك للخدمات الحكومية",
    template: "%s | مساعد مصر",
  },
  description:
    "منصة تبسيط وتجميع المعلومات الحكومية للمواطن المصري.",
  keywords: [
    "مساعد مصر",
    "خدمات حكومية",
    "أرقام الطوارئ",
  ],
  openGraph: {
    title: "مساعد مصر — دليلك للخدمات الحكومية",
    description: "منصة تبسيط وتجميع المعلومات الحكومية",
    type: "website",
    locale: "ar_EG",
    siteName: "Misr Assistant",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable + " " + tajawal.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
