import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MonsoonRoute",
  description:
    "Rain-aware route decision system — compare routes using forecast rain, waterlogging evidence, and travel-time trade-offs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("h-full", inter.className, "font-sans", geist.variable)}>
      <body className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
