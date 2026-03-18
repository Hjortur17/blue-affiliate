type StatCard = {
  label: string;
  value: string;
  subtext: string;
  subtextColor?: "green" | "muted";
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
        <div
          key={stat.label}
          className="bg-white border border-border rounded-lg px-6 pt-6 pb-px flex flex-col gap-2"
        >
          <p className="text-sm leading-5 text-muted-foreground">
            {stat.label}
          </p>
          <p className="text-base leading-6 text-foreground">
            {stat.value}
          </p>
          <p
            className={`text-sm leading-5 ${
              stat.subtextColor === "green" ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            {stat.subtext}
          </p>
        </div>
      ))}
    </div>
  );
}
