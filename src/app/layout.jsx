import { Inter } from 'next/font/google';
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import Logger from '@/lib/logger';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "DSWD Social Welfare Capital Fund",
  description:
    "SLP-DSWD-AURORA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}