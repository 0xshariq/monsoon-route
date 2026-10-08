import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MonsoonRoute",
  description:
    "Rain-aware route decision system — compare routes using forecast rain, waterlogging evidence, and travel-time trade-offs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
