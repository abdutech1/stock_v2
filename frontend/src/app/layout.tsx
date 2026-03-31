import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { AppProvider } from "@/context/AppContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import ClientHydrationGuard from "@/components/ClientHydrationGuard"; // Import the guard
import "./globals.css";
import { OfflineStatusProvider } from "@/components/OfflineStatusProvider";

export const metadata: Metadata = {
  title: {
    default: "Vortex Stock | Management",
    template: "%s | Vortex Stock",
  },
  description: "Manage stock, sales, employees and reports",
  metadataBase: new URL("http://localhost:3000/"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vortex POS",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50/50 antialiased font-sans">
        <TooltipProvider>
          <ReactQueryProvider>
            <AppProvider>
              {/* This guard handles the "flicker-free" logic safely on the client */}
              <ClientHydrationGuard>
                <main>{children}</main>
              </ClientHydrationGuard>
              <OfflineStatusProvider/>
            </AppProvider>
            <Toaster position="top-right" />
          </ReactQueryProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}