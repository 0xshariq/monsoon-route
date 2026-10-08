import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MonsoonRoute — Travel safer during monsoon",
  description:
    "Rain-aware route decision system — compare routes using forecast rain, waterlogging evidence, and travel-time trade-offs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-screen flex flex-col bg-[#06131c] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
