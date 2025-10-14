import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components";
import { Footer } from "@/components";
import { ScrollProgress } from "@/components/scroll-progress";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YourApp - Modern SaaS Platform",
  description: "A modern, scalable platform that helps you build, manage, and grow your business with powerful tools and intuitive design.",
}; 


export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ScrollProgress />
          <Header />
            {children}     
          <Footer />    
        </Providers>
      </body>
    </html>
  );
}
