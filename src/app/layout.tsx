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

const TITLE = "Hire Yusuf — Solutions Engineer";
const DESC =
  "Your search for talent ends here. A Solutions Engineer who turns complexity into clarity — never below 100% of quota across Cisco, HashiCorp & IBM. Give me 60 seconds.";

// Structured data so a recruiter's search/share surfaces the right person.
const PERSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Yusuf Rahman",
  jobTitle: "Solutions Engineer",
  email: "mailto:yusuf.arahman@outlook.com",
  url: "https://hireyusuf.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dallas",
    addressRegion: "TX",
    addressCountry: "US",
  },
  worksFor: { "@type": "Organization", name: "IBM" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "The University of Texas at Dallas" },
  sameAs: ["https://www.linkedin.com/in/yusufarahman/"],
  knowsAbout: [
    "Solutions Engineering",
    "Technical Pre-Sales",
    "Terraform",
    "HashiCorp Vault",
    "Kubernetes",
    "AWS",
    "Observability",
    "Site Reliability Engineering",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hireyusuf.com"),
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://hireyusuf.com" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://hireyusuf.com",
    siteName: "Hire Yusuf",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Yusuf Rahman — Solutions Engineer" }],
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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_LD) }}
        />
        {children}
      </body>
    </html>
  );
}
