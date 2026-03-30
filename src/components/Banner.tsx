import { cn } from "@/lib/utils";
import Icon, { IconComponent } from "./Icon";

export default function Banner({
  level,
  message,
  items,
}: {
  level: "info" | "warning" | "error";
  message?: string;
  items?: string[];
}) {
  const iconMap: Record<"info" | "warning" | "error", string> = {
    info: "Info",
    warning: "TriangleAlert",
    error: "OctagonX",
  };

  const textClass = cn("text-sm tracking-[-0.15px]", {
    "text-[#1c398e]": level === "info",
    "text-[#854d0e]": level === "warning",
    "text-[#991b1b]": level === "error",
  });

  return (
    <div
      className={cn("flex gap-3 border rounded-lg px-4 py-4", {
        "items-start": !!items,
        "items-center": !items,
        "bg-[#EFF6FF] border-[#BEDBFF]": level === "info",
        "bg-yellow-50 border-yellow-600": level === "warning",
        "bg-[#fee2e2] border-[#fecaca]": level === "error",
      })}
    >
      <IconComponent
        icon={iconMap[level]}
        className={cn("shrink-0", items && "mt-0.5", {
          "text-primary": level === "info",
          "text-[#854d0e]": level === "warning",
          "text-[#991b1b]": level === "error",
        })}
      />
      <div className={cn(!items && "contents")}>
        {message && (
          <p className={textClass}>
            <span className="font-bold">Note: </span>
            {message}
          </p>
        )}
        {items && (
          <ul className={cn("list-none pl-4 flex flex-col gap-1 mt-2", textClass)}>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
