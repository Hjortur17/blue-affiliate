"use client";

import { AuthProvider } from "@/lib/auth";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">{children}</div>
    </AuthProvider>
  );
}
