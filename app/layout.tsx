import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/layout/footer";

const jgs7 = localFont({
  src: "../public/fonts/jgs7.woff2",
  variable: "--font-jgs7",
  display: "swap",
});

export const metadata: Metadata = {
  title: "U2 Gas",
  description: "U2 Oil and Gas Ltd",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("h-full antialiased", jgs7.variable)}>
      <body className="min-h-full flex flex-col bg-white text-foreground font-sans overflow-x-hidden">
        <div className="flex-1 flex flex-col items-center w-full">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
