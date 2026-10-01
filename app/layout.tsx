import type { Metadata } from "next";
import { SITE_URL } from "../lib/site";
import "./globals.css";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL), title: "Engineering Calculator", description: "An illustrative field instrument for beam-load checks." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
