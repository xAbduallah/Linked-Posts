'use client'
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./(Global)/Navbar";
import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import AppInitializer from "@/Context/AppInitializer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {

  const queryClient = new QueryClient()

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider store={store}>
          <AppInitializer>
            <main className="dark min-h-screen">
              <QueryClientProvider client={queryClient}>
                <div className="mt-28">
                  <Navbar />
                  <AppRouterCacheProvider>
                    <div className="mx-[20%]">
                      {children}
                    </div>
                  </AppRouterCacheProvider>
                </div>
              </QueryClientProvider>
            </main>
          </AppInitializer>
        </Provider>
      </body>
    </html>
  );
}
