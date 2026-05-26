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
  title: "Yusuf Rahman",
  description:
    "Everything reduces to dust. Everything can be rebuilt.",
  openGraph: {
    title: "Yusuf Rahman",
    description: "Everything reduces to dust. Everything can be rebuilt.",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 675 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yusuf Rahman",
    description: "Everything reduces to dust. Everything can be rebuilt.",
    images: ["/og-image.jpg"],
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
