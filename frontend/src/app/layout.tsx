import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { OfflineStatusProvider } from "@/components/OfflineStatusProvider";


export const metadata: Metadata = {
  title: {
    default: "Jemo Boutique | Management",
    template: "%s | Jemo Boutique",
  },
  description: "Manage stock, sales, employees and reports",
  metadataBase: new URL("http://localhost:3000/"),
  
  // Advanced Mobile App Settings
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jemo POS",
    startupImage: [
      {
        url: "/splash-640x1136.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/splash-1242x2688.png",
        media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
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
            <main>{children}</main>
            <Toaster position="top-right" />
            <OfflineStatusProvider/>
          </ReactQueryProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}