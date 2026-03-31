import type { DateRange } from "@/lib/api";

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

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function monthToRange(monthName: string, yearStr: string): DateRange {
  const month = MONTHS.indexOf(monthName) + 1;
  const year = Number.parseInt(yearStr, 10);
  return {
    from: `${year}-${pad(month)}-01`,
    to: `${year}-${pad(month)}-${pad(lastDayOfMonth(year, month))}`,
  };
}

export function periodToDateRange(period: string): DateRange {
  const now = new Date();

  switch (period) {
    case "Last 3 months": {
      const from = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        from: `${from.getFullYear()}-${pad(from.getMonth() + 1)}-01`,
        to: `${to.getFullYear()}-${pad(to.getMonth() + 1)}-${pad(to.getDate())}`,
      };
    }
    case "Year to date": {
      const today = now;
      return {
        from: `${now.getFullYear()}-01-01`,
        to: `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`,
      };
    }
    case "Last 12 months": {
      const from = new Date(now.getFullYear(), now.getMonth() - 12, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        from: `${from.getFullYear()}-${pad(from.getMonth() + 1)}-01`,
        to: `${to.getFullYear()}-${pad(to.getMonth() + 1)}-${pad(to.getDate())}`,
      };
    }
    default: {
      const [monthName, yearStr] = period.split(" ");
      return monthToRange(monthName, yearStr);
    }
  }
}

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
