"use client";

import { AuthProvider } from "@/lib/auth";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex justify-center bg-background px-4 pt-[118px] pb-8">{children}</div>
    </AuthProvider>
  );
}
