import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpeakX · Confidence starts here",
  description: "Build your English confidence for everyday conversations, interviews, work, college, and travel with SpeakX.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async /></body>
    </html>
  );
}
