export function getDefaultPeriod(): string {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return lastMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function periodToMonthYear(period: string): { month: number; year: number } {
  const [monthName, yearStr] = period.split(" ");
  const month = MONTHS.indexOf(monthName) + 1;
  return { month, year: Number.parseInt(yearStr, 10) };
}

export function formatShortDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  const date = new Date(2000, Number.parseInt(month, 10) - 1, Number.parseInt(day, 10));
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
