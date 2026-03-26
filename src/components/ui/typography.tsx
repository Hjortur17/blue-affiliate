import { cn } from "@/lib/utils";

export function Heading1({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h1 className={cn("uppercase tracking-[-0.31px] font-heading", className)}>{children}</h1>;
}
