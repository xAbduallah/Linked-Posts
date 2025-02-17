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

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {

  const queryClient = new QueryClient()

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AppInitializer>
            <main className="min-h-screen">
              <QueryClientProvider client={queryClient}>
                <div className="mt-28">
                  <Navbar />
                  <AppRouterCacheProvider>
                    {children}
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
