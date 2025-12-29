import type { Metadata } from "next";
import { Manrope, Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Abs0rb.me - Archive",
  description:
    "Archive of abs0rb.me, an online multiplayer game that ran from 2015 to 2025.",
};

const cloudflareWebAnalyticsToken = "d6d5e83ed9fa4c4e9fec1c59e7e7df18";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${roboto.variable} antialiased`}>
        {children}
        {cloudflareWebAnalyticsToken ? (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({
              token: cloudflareWebAnalyticsToken,
            })}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
