import { cn } from "@/lib/utils";
import type { StatCard } from "@/types/data";

export default function StatsGrid({ stats, loading }: { stats: StatCard[]; loading?: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white border rounded-lg p-6 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          {loading ? (
            <div className="animate-pulse h-6 w-20 bg-muted rounded" />
          ) : (
            <p>{stat.value}</p>
          )}
          {loading ? (
            <div className="animate-pulse h-4 w-28 bg-muted rounded" />
          ) : (
            <p
              className={cn("text-sm", {
                "text-green-600": stat.subtextColor === "green",
                "text-red-600": stat.subtextColor === "red",
                "text-muted-foreground/70": stat.subtextColor !== "green" && stat.subtextColor !== "red",
              })}
            >
              {stat.subtext}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
