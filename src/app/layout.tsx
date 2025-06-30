import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { WakaTimeStats } from "@/components/wakatime-stats";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QAnything Dashboard",
  description: "QAnything知识库和Agent管理平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50`}
      >
        <div className="flex min-h-screen">
          <main className="flex-1">{children}</main>
          <Navigation />
        </div>
        <WakaTimeStats />
      </body>
    </html>
  );
}
