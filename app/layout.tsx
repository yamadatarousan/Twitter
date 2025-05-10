import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twitter Clone",
  description: "A Twitter clone built with Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionResult = await getServerSession(authOptions);

  const formattedSession = sessionResult && "user" in sessionResult ? {
    user: sessionResult.user,
    expires: sessionResult.expires || new Date(Date.now() + 3600 * 1000).toISOString(),
  } : null;

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={formattedSession}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
