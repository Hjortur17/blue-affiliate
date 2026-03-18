import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blue Affiliate",
  description:
    "Blue Affiliate is a platform for creating and managing affiliate programs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("bg-background", "font-sans", hostGrotesk.variable)}
    >
      <body className="antialiased p-8">
        <Navbar />

        <div className="mt-10 grid grid-cols-12 gap-14">
          <Sidebar />

          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
