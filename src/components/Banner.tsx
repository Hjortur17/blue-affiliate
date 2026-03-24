import { cn } from "@/lib/utils";
import Icon, { IconComponent } from "./Icon";

export default function Banner({ level, message }: { level: "info" | "warning" | "error"; message: string }) {
  const iconMap: Record<"info" | "warning" | "error", keyof typeof Icon> = {
    info: "Information",
    warning: "Warning",
    error: "Error",
  };

  return (
    <div
      className={cn("flex items-center gap-3 border rounded-lg px-4 py-4", {
        "bg-[#EFF6FF] border-[#BEDBFF]": level === "info",
        "bg-yellow-50 border-yellow-600": level === "warning",
        "bg-[#fee2e2] border-[#fecaca]": level === "error",
      })}
    >
      <IconComponent
        icon={iconMap[level] as keyof typeof Icon}
        className={cn("size-5 shrink-0", {
          "text-primary": level === "info",
          "text-[#854d0e]": level === "warning",
          "text-[#991b1b]": level === "error",
        })}
      />
      <p
        className={cn("text-sm tracking-[-0.15px]", {
          "text-[#1c398e]": level === "info",
          "text-[#854d0e]": level === "warning",
          "text-[#991b1b]": level === "error",
        })}
      >
        <span className="font-bold">Note: </span>
        {message}
      </p>
    </div>
  );
}
