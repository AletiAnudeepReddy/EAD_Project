"use client"
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";
import "./globals.css";
import AdminNavbar from "@/components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  const pathname = usePathname();
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration (ms)
      once: true, // animation only once
      easing: "ease-out-cubic",
    });
  }, []);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {pathname == "/" && <AdminNavbar />}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
