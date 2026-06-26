import type { Metadata, Viewport } from "next";
import { Sora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const TITLE = "Yusuf Rahman — Solutions Engineer";
const DESC =
  "Solutions Engineer who turns complexity into clarity. Never below 100% of quota — renewals and net-new ACV alike. JPMorgan · Cisco · HashiCorp · IBM.";

export const metadata: Metadata = {
  metadataBase: new URL("https://yusufrahman.com"),
  title: TITLE,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 675 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#eef0f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
