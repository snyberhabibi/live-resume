import type { Metadata } from "next";
import { El_Messiri, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const elMessiri = El_Messiri({
  variable: "--font-el-messiri",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yusuf Rahman — Sandbox",
  description:
    "Everything reduces to dust. Everything can be rebuilt. Interactive 3D resume.",
  openGraph: {
    title: "Yusuf Rahman — Sandbox",
    description: "Everything reduces to dust. Everything can be rebuilt.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${elMessiri.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
