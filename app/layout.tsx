import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import StyledComponentsRegistry from "./lib/registry";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "Track your job applications",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.className} h-full`}>
      <body className="min-h-full flex flex-col overflow-hidden">
        <StyledComponentsRegistry>
          <Providers>
            {children}
            {modal}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
