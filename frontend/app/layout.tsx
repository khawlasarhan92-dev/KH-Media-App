import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ClientProvider from "@/HOC/ClientProvider";

const font = Roboto({
  weight: ["100",'300',"400","500", "700","900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A Social media App",
  description: " Social media App built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased bg-background text-foreground transition-colors duration-500 min-h-screen dark:bg-background`}
        suppressHydrationWarning
      >
        <ClientProvider>
          {children}
          <Toaster />
        </ClientProvider>
      </body>
    </html>
  );
}
