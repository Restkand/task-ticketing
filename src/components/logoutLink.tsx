"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function LogoutLink() {
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah navigasi default Link
    await signOut({ callbackUrl: "/login" }); // Optional: Set the callback URL after logout
  };

  return (
    <Link
      href="/login"
      onClick={handleLogout}
      className="hover:underline"
    >
      Logout
    </Link>
  );
}