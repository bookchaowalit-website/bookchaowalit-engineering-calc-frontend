import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Engineering Calculator", description: "An illustrative field instrument for beam-load checks." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
