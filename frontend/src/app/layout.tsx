import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NexusVault // Autonomous Yield & DeFAI Protocol",
  description: "Secure, guardian-bounded autonomous yield routing and cryptographically proven AI strategies on the 0G Network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link href="https://db.onlinewebfonts.com/c/9d4d074c9335825a23cce178ee03b498?family=P22+Mackinac+W01+Book" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-[#191919] font-sans antialiased overflow-x-hidden min-h-screen flex flex-col">
        <Providers>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
