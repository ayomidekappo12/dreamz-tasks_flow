import "./globals.css";
import App from "@/components/layout/app";
import { Sora, Inter } from "next/font/google";
import Script from "next/script";

// Font setup
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });
const fontClass = `${inter.variable} ${sora.variable}`;

export const revalidate = 3600; // Re-generate every hour


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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html suppressHydrationWarning lang="en" className={fontClass}>
      <head>
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
