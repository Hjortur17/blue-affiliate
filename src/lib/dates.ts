export function getDefaultPeriod(): string {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return lastMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
