import { Tooltip } from "@base-ui/react/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatCard } from "@/types/data";

export default function StatsGrid({ stats, loading }: { stats: StatCard[]; loading?: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card border rounded-lg p-6 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            {stat.info && (
              <Tooltip.Root>
                <Tooltip.Trigger
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`More info about ${stat.label}`}
                >
                  <Info className="size-3.5" />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Positioner sideOffset={6}>
                    <Tooltip.Popup className="max-w-xs rounded-md bg-[#101828] px-3 py-2 text-xs text-white shadow-md">
                      {stat.info}
                    </Tooltip.Popup>
                  </Tooltip.Positioner>
                </Tooltip.Portal>
              </Tooltip.Root>
            )}
          </div>
          {loading ? (
            <div className="animate-pulse h-6 w-20 bg-muted rounded" />
          ) : (
            <p>
              {stat.value}
              {stat.valueSuffix && <span className="ml-1 text-[10px] text-[#6a7282]">{stat.valueSuffix}</span>}
            </p>
          )}
          {loading ? (
            <div className="animate-pulse h-4 w-28 bg-muted rounded" />
          ) : (
            <p
              className={cn("text-sm", {
                "text-[#00a63e]": stat.subtextColor === "green",
                "text-red-600": stat.subtextColor === "red",
                "text-muted-foreground/70": stat.subtextColor !== "green" && stat.subtextColor !== "red",
              })}
            >
              {stat.subtext || " "}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
