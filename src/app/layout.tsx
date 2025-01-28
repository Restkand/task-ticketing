"use client";

import "./globals.css"; // Pastikan global CSS diimpor
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutLink from "@/components/logoutLink";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col min-h-screen">
        <SessionProvider>
          <InnerLayout>{children}</InnerLayout>
        </SessionProvider>
      </body>
    </html>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && (
        <header className="bg-blue-600 text-white p-4">
          <nav className="flex space-x-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {session?.user?.role === "Admin" && (
              <>
                <Link href="/tasks" className="hover:underline">
                  Tasks
                </Link>
                <Link href="/managements" className="hover:underline">
                  Managements
                </Link>
              </>
            )}
            <LogoutLink />
          </nav>
        </header>
      )}
      <main className="flex-grow">{children}</main>
      <footer className="p-4 text-center bg-gray-100">
        © 2025 Task Ticketing App
      </footer>
    </>
  );
}