// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

// Memperluas tipe User bawaan
declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    name: string;
    role: string; // Tambahkan role
  }

  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      role: string; // Tambahkan role
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    email: string;
    name: string;
    role: string; // Tambahkan role
  }
}