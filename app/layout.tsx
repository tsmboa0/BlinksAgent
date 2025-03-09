import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WalletContextProvider from "@/walletProvider";
import "@dialectlabs/blinks/index.css";
import ConnectWalletButton from "@/components/connectWalletButton";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blinks Agent",
  description: "Summon a Blink to perfom solana transactions on X by calling @blinksAgent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="home"
      >
        <WalletContextProvider>
          <nav className="home__nav" style={{backgroundColor:""}}>
            <div className="logo_text">Blinks <span style={{color:"whitesmoke"}}>Agent</span></div>
            <div className="nav__links">
              <Link href={"/register"}>Register</Link>
              <Link href={"/generate-sales-blink"}>Generate</Link>
              <ConnectWalletButton />
            </div>
          </nav>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
