import { cn } from "@/lib/utils";

type StatCard = {
  label: string;
  value: string;
  subtext: string;
  subtextColor?: "green" | "red" | "muted";
};

const stats: StatCard[] = [
  {
    label: "Total Bookings",
    value: "234",
    subtext: "+12% from last month",
    subtextColor: "green",
  },
  {
    label: "Total Revenue",
    value: "1,245,000 Kr",
    subtext: "Excl. VAT",
  },
  {
    label: "Expected Commission",
    value: "62,250 Kr",
    subtext: "Excl. VAT",
  },
  {
    label: "Total Clicks",
    value: "3450",
    subtext: "Conversion: 6.8%",
  },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white border rounded-lg p-6 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p>{stat.value}</p>
          <p
            className={cn("text-sm", {
              "text-green-600": stat.subtextColor === "green",
              "text-red-600": stat.subtextColor === "red",
              "text-muted-foreground/70": stat.subtextColor !== "green" && stat.subtextColor !== "red",
            })}
          >
            {stat.subtext}
          </p>
        </div>
      ))}
    </div>
  );
}
