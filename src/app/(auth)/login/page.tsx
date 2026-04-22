"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiClientError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-[440px] max-w-full flex flex-col gap-8">
      <div className="bg-card rounded-2xl shadow-[0_25px_50px_0_rgba(0,0,0,0.25)] p-10">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-[32px] leading-[48px] uppercase text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to access your affiliate dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-[30px]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-card-foreground">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-lg border-light-gray text-[15px] placeholder:text-foreground/50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-card-foreground">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-lg border-light-gray pr-12 text-[15px] placeholder:text-foreground/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-sm text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 rounded border-light-gray accent-primary"
              />
              Remember me
            </label>
            <a href="#" className="font-medium text-primary">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-[52px] w-full rounded-lg text-base shadow-[0_10px_15px_0_rgba(0,0,0,0.1),0_4px_6px_0_rgba(0,0,0,0.1)]"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-[30px] pt-[25px] border-t border-light-gray text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <a
            href="https://bluecarrental.is/contact-us/affiliate-program"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-secondary"
          >
            Join the affiliate program
          </a>
        </div>
      </div>

      <p className="text-center text-[13px] text-card-foreground">© 2026 Blue Car Rental</p>
    </div>
  );
}
