import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { NetworkBanner } from "@/components/network-banner";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "Popper.fun — Ideas pop here",
    template: "%s · Popper.fun",
  },
  description:
    "Launch, collect, and be part of what's next. A playful Arc-native USDC token launchpad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("popper-theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} flex min-h-screen flex-col antialiased`}>
        <Providers>
          <Nav />
          <NetworkBanner />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
