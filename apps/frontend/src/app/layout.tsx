import type { Metadata, Viewport } from "next";
import "./globals.css";
import App from "@/components/layout/app";
import { Sora, Inter } from "next/font/google";
import Script from "next/script";

// Font setup
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });
const fontClass = `${inter.variable} ${sora.variable}`;

export const revalidate = 3600; // Re-generate every hour

export const metadata: Metadata = {
  title:
    "Taskflow - Streamline Your Workflow with Our Advanced Task Management App",
  description:
    "Taskflow helps teams manage tasks, projects, and workflows efficiently. Create, assign, and track tasks with our intuitive platform.",

  alternates: {
    canonical: "https://www.taskflow.com",
  },

  keywords: [
    "Tasks Management",
    "professional task management",
    "home task management",
    "office task management",
    "5 star task management",
    "trusted task management",
    "Taskflow",
  ],

  // Open Graph (Facebook, LinkedIn, WhatsApp, etc.)
  openGraph: {
    title: "Taskflow - 5★ Rated Task Management App",
    description:
      "Rated 5 stars by over 1,000 satisfied clients — professional, affordable, and reliable task management for teams.",
    url: "https://www.taskflow.com",
    siteName: "Taskflow",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dxvf9uqwe/image/upload/v1756848808/Logo_qaj4rw.jpg",
        alt: "Taskflow Logo",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  // Theme + PWA manifest
  themeColor: "#ffffff",
  manifest: "/manifest.json",
};



// Organization Schema (with reviews & rating)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "Taskflow Management Services",
  logo: "https://res.cloudinary.com/dxvf9uqwe/image/upload/v1770028108/woldreamz_cover_j50v3r.jpg",
  description:
    "Rated 5 stars by over 1,000 happy customers — professional task management for teams.",
  telephone: "+44 079 3088 7488",
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@taskflow.com",
    contactType: "customer support",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "1000",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html suppressHydrationWarning lang="en" className={fontClass}>
      <head>
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K7GPQH3XTX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K7GPQH3XTX');
          `}
        </Script>

        {/* JSON-LD Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body>
        <App>{children}</App>
      </body>
    </html>
  );
}
