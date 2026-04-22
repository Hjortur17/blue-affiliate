"use client";

import { AuthProvider } from "@/lib/auth";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div
        className="min-h-screen flex justify-center px-4 pt-[118px] pb-8"
        style={{
          backgroundImage: "url('/login-bg.svg'), linear-gradient(to bottom, #c3dcff 0%, #eef4ff 100%)",
          backgroundSize: "cover, auto",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      >
        {children}
      </div>
    </AuthProvider>
  );
}
