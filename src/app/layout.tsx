import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "@/components/ui/sonner";
import { InsforgeProvider } from "@/components/providers/InsforgeProvider";
import { getAuthFromCookies } from "@insforge/nextjs";
import {
  SignedIn,
  SignedOut,
} from '@insforge/nextjs';


const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Ivoire Bar VIP",
  description: "Gestion d'excellence pour bars et maquis en Côte d'Ivoire",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialAuth = await getAuthFromCookies();

  return (
    <html
      lang="fr"
      className={`${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <InsforgeProvider initialState={initialAuth}>
          <AppProvider>
            {children}
            <Toaster position="top-right" expand={true} richColors theme="dark" />
          </AppProvider>
        </InsforgeProvider>
      </body>
    </html>
  );
}
