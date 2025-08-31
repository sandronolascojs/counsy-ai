import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const InterFont = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://counsy.app"),
  title: {
    default: "Counsy AI – AI-first counseling assistant",
    template: "%s | Counsy AI",
  },
  description:
    "Counsy AI helps you simplify intake, triage, and communication with an AI-first counseling assistant. Coming soon.",
  keywords: [
    "counsy",
    "counseling",
    "therapy",
    "mental health",
    "AI assistant",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "https://counsy.app",
    title: "Counsy AI – AI-first counseling assistant",
    description:
      "Simplify intake, triage, and communication with Counsy AI. Coming soon.",
    siteName: "Counsy AI",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Counsy AI logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Counsy AI – AI-first counseling assistant",
    description:
      "Simplify intake, triage, and communication with Counsy AI. Coming soon.",
    images: ["/logo.svg"],
  },
  alternates: {
    canonical: "https://counsy.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${InterFont.variable} antialiased`}
      >
        <div className="mx-auto w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
