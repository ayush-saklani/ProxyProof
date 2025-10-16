'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/header";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const pathname = usePathname();
  const hideHeaderRoutes = ['/signin', '/signup'];
  const hideHeader = hideHeaderRoutes.includes(pathname);

  useEffect(() => {
    const userexists = localStorage.getItem('user');
    if (userexists) {
      let role = JSON.parse(userexists).role;
      if (role === 'student' && !pathname.startsWith('/student')) {
        window.location.href = '/student';
      } else if ((role === 'faculty' || role === 'admin') && !pathname.startsWith('/faculty')) {
        window.location.href = '/faculty';
      }
    } else {
      if (!hideHeaderRoutes.includes(pathname)) {
        localStorage.clear();
        window.location.href = '/signin';
      }
    }
  }, []); //pathname add this at last
  return (
    <html lang="en">
      <head>
        <title>Proxyproof</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

        <link rel="icon" href="/image/logo.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {!hideHeader && <Header />}
        <Toaster
          position="bottom-right"
          reverseOrder={true}
        />
        {children}
      </body>
    </html>
  );
}