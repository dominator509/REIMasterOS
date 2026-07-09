import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "REI-OS",
  description: "Real Estate Investor Operating System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
