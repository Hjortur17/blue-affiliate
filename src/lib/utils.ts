import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number, withCurrency: boolean = true) => {
  const formatted = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return `${formatted} ${withCurrency ? "kr." : ""}`;
};

export const formatDate = (date: dayjs.Dayjs) => {
  return date.format("MMMM D, YYYY");
};
