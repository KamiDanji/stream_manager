import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OBS Remote Micro-SaaS",
  description: "Mobile-first cloud-based remote control for OBS Studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-white font-sans antialiased">{children}</body>
    </html>
  );
}
