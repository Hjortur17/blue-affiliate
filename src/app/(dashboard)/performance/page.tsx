"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import PeriodFilter from "@/components/PeriodFilter";
import { getDefaultPeriod, formatShortDate, periodToMonthYear } from "@/lib/dates";
import { Heading1 } from "@/components/ui/typography";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import Banner from "@/components/Banner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import type { EngagementData, RentalsData } from "@/types/api";

const clicksConfig = {
  clicks: {
    label: "Clicks",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

const bookingsConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--color-secondary)",
  },
} satisfies ChartConfig;

const completedRentalsConfig = {
  rentals: {
    label: "Rentals",
    color: "var(--color-secondary)",
  },
} satisfies ChartConfig;

const upcomingRentalsConfig = {
  rentals: {
    label: "Rentals",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

function computeAxis(data: { value: number }[]): { domain: [number, number]; ticks: number[] } {
  if (data.length === 0) return { domain: [0, 10], ticks: [0, 5, 10] };
  const max = Math.max(...data.map((d) => d.value));
  const ceiling = Math.ceil(max * 1.2 / 5) * 5 || 10;
  const step = ceiling / 4;
  return {
    domain: [0, ceiling],
    ticks: [0, step, step * 2, step * 3, ceiling],
  };
}

export default function PerformancePage() {
  const [period, setPeriod] = useState(getDefaultPeriod());
  const [engagement, setEngagement] = useState<EngagementData | null>(null);
  const [rentals, setRentals] = useState<RentalsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async (p: string) => {
    setIsFetching(true);
    setError(null);
    try {
      const { month, year } = periodToMonthYear(p);
      const [engagementRes, rentalsRes] = await Promise.all([
        api.getEngagement(month, year),
        api.getRentals(month, year),
      ]);
      setEngagement(engagementRes);
      setRentals(rentalsRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load performance data");
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData(period);
  }, [period, fetchData]);

  const hasData = engagement && rentals;

  if (!hasData && isFetching) return <PerformanceSkeleton />;

  if (!hasData && error) {
    return (
      <Banner
        level="error"
        message={error}
        items={["Please try again or contact support if the issue persists."]}
      />
    );
  }

  if (!hasData) return null;

  const chartData = engagement.clicksPerDay.map((d) => ({ date: formatShortDate(d.date), clicks: d.value }));
  const bookingsData = engagement.bookingsPerDay.map((d) => ({ date: formatShortDate(d.date), bookings: d.value }));
  const upcomingRentalsData = rentals.upcomingByPickupDate.map((d) => ({
    date: formatShortDate(d.date),
    rentals: d.value,
  }));
  const completedRentalsData = rentals.completedByDropoffDate.map((d) => ({
    date: formatShortDate(d.date),
    rentals: d.value,
  }));

  const clicksAxis = computeAxis(engagement.clicksPerDay);
  const bookingsAxis = computeAxis(engagement.bookingsPerDay);
  const upcomingAxis = computeAxis(rentals.upcomingByPickupDate);
  const completedAxis = computeAxis(rentals.completedByDropoffDate);

  return (
    <Fragment>
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10.25">
          <Heading1 className="lg:min-w-109.25">Performance (Booking Date)</Heading1>

          <PeriodFilter value={period} onValueChange={setPeriod} inputClassName="h-9 hidden sm:flex" />

          <Badge variant="default" className="bg-primary text-white text-sm h-auto py-2.25 px-7 sm:ml-auto">
            Clicks + Bookings Created
          </Badge>
        </div>

        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <div className="bg-white border rounded-lg p-6">
            <p className="mb-1.25">Clicks per Day</p>
            <p className="text-[#6A7282] text-sm mb-5.25">Daily click traffic from affiliate links</p>
            <ChartContainer config={clicksConfig} className="lg:max-h-64 xl:max-h-80 w-full">
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} stroke="var(--color-light-gray)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#999", fontSize: 11 }}
                  padding={{ left: 0, right: 0 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#999", fontSize: 11 }}
                  domain={clicksAxis.domain}
                  ticks={clicksAxis.ticks}
                  width={32}
                />
                <Line type="monotone" dataKey="clicks" stroke="var(--color-clicks)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </div>
          <div className="bg-white border rounded-lg p-6">
            <p className="mb-1.25">Bookings Created per Day</p>
            <p className="text-[#6A7282] text-sm mb-5.25">New bookings generated through your affiliate links</p>
            <ChartContainer config={bookingsConfig} className="lg:max-h-64 xl:max-h-80 w-full">
              <LineChart data={bookingsData}>
                <CartesianGrid vertical={false} stroke="var(--color-light-gray)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#999", fontSize: 11 }}
                  padding={{ left: 0, right: 0 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#999", fontSize: 11 }}
                  domain={bookingsAxis.domain}
                  ticks={bookingsAxis.ticks}
                  width={32}
                />
                <Line type="monotone" dataKey="bookings" stroke="var(--color-bookings)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </div>
        </div>

        <Tabs defaultValue="clicks-per-day" className="w-full block sm:hidden">
          <div className="flex flex-col-reverse sm:flex-row gap-2 mb-4 sm:mb-8">
            <TabsList className="w-full">
              <TabsTrigger value="clicks-per-day">Clicks per Day</TabsTrigger>
              <TabsTrigger value="bookings-created">Bookings Created</TabsTrigger>
            </TabsList>

            <PeriodFilter value={period} onValueChange={setPeriod} />
          </div>

          <TabsContent value="clicks-per-day">
            <div className="bg-white border rounded-lg p-6">
              <p className="mb-1.25">Clicks per Day</p>
              <p className="text-[#6A7282] text-sm mb-5.25">Daily click traffic from affiliate links</p>
              <ChartContainer config={clicksConfig} className="lg:max-h-64 xl:max-h-80 w-full">
                <LineChart data={chartData}>
                  <CartesianGrid vertical={false} stroke="var(--color-light-gray)" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#999", fontSize: 11 }}
                    padding={{ left: 0, right: 0 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#999", fontSize: 11 }}
                    domain={clicksAxis.domain}
                    ticks={clicksAxis.ticks}
                    width={32}
                  />
                  <Line type="monotone" dataKey="clicks" stroke="var(--color-clicks)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </div>
          </TabsContent>
          <TabsContent value="bookings-created">
            <div className="bg-white border rounded-lg p-6">
              <p className="mb-1.25">Bookings Created per Day</p>
              <p className="text-[#6A7282] text-sm mb-5.25">New bookings generated through your affiliate links</p>
              <ChartContainer config={bookingsConfig} className="lg:max-h-64 xl:max-h-80 w-full">
                <LineChart data={bookingsData}>
                  <CartesianGrid vertical={false} stroke="var(--color-light-gray)" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#999", fontSize: 11 }}
                    padding={{ left: 0, right: 0 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#999", fontSize: 11 }}
                    domain={bookingsAxis.domain}
                    ticks={bookingsAxis.ticks}
                    width={32}
                  />
                  <Line type="monotone" dataKey="bookings" stroke="var(--color-bookings)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="mt-6 sm:mt-12.25 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Heading1 className="lg:min-w-109.25">Performance (Rental Date)</Heading1>

          <PeriodFilter value={period} onValueChange={setPeriod} inputClassName="hidden sm:flex h-9" />

          <Badge variant="default" color="secondary" className="text-sm h-auto py-2.25 px-7 sm:ml-auto">
            Clicks + Bookings Created
          </Badge>
        </div>

        <div className="hidden sm:block mb-6">
          <p className="mb-1.25">Commission Pipeline (Rental Date)</p>
          <p className="text-secondary">Upcoming + Completed Rentals</p>
        </div>

        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <div className="bg-white border rounded-lg p-6">
            <p className="mb-1.25">Upcoming Rentals by Pickup Date</p>
            <p className="text-[#6A7282] text-sm mb-5.25">Scheduled rentals in your commission pipeline</p>
            <ChartContainer config={upcomingRentalsConfig} className="lg:max-h-64 xl:max-h-80 w-full">
              <BarChart data={upcomingRentalsData}>
                <CartesianGrid vertical={false} stroke="var(--color-light-gray)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#999", fontSize: 11 }}
                  padding={{ left: 0, right: 0 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#999", fontSize: 11 }}
                  domain={upcomingAxis.domain}
                  ticks={upcomingAxis.ticks}
                  width={32}
                />
                <Bar dataKey="rentals" fill="var(--color-rentals)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="bg-white border rounded-lg p-6">
            <p className="mb-1.25">Completed Rentals by Dropoff Date</p>
            <p className="text-primary text-sm mb-5.25">Completed rentals = commission earned</p>
            <ChartContainer config={completedRentalsConfig} className="lg:max-h-64 xl:max-h-80 w-full">
              <LineChart data={completedRentalsData}>
                <CartesianGrid vertical={false} stroke="var(--color-light-gray)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#999", fontSize: 11 }}
                  padding={{ left: 0, right: 0 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#999", fontSize: 11 }}
                  domain={completedAxis.domain}
                  ticks={completedAxis.ticks}
                  width={32}
                />
                <Line type="monotone" dataKey="rentals" stroke="var(--color-rentals)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
      </section>

      <section className="sm:hidden mb-10">
        <div className="bg-card border rounded-lg p-5">
          <p className="text-lg font-medium text-foreground">Commission Pipeline (Rental Date)</p>
          <p className="text-sm text-secondary">Upcoming + Completed Rentals</p>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div className="bg-background rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Upcoming Rentals</p>
              <p className="text-2xl font-medium mt-1">
                {rentals.upcomingByPickupDate.reduce((sum, d) => sum + d.value, 0)}
              </p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Completed Rentals</p>
              <p className="text-2xl font-medium mt-1">
                {rentals.completedByDropoffDate.reduce((sum, d) => sum + d.value, 0)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-muted-foreground">Upcoming Rentals by Pickup Date</p>
            <p className="text-xs text-muted-foreground mt-1">Scheduled rentals in your commission pipeline</p>

            <div className="flex flex-col gap-2 mt-4">
              {upcomingRentalsData.map((row) => (
                <div key={row.date} className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm text-foreground">{row.date}</span>
                  <span className="bg-primary text-white text-sm font-medium rounded px-3 py-1">{row.rentals}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sm:hidden mb-10">
        <div className="bg-card border rounded-lg p-5">
          <p className="text-sm font-medium text-muted-foreground">Completed Rentals by Dropoff Date</p>
          <p className="text-xs text-secondary mt-1">Completed rentals = commission earned</p>

          <div className="flex flex-col gap-2 mt-4">
            {completedRentalsData.map((row) => (
              <div key={row.date} className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm text-foreground">{row.date}</span>
                <span className="text-sm font-medium text-secondary">{row.rentals}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Banner level="info" message="Number of bookings and revenue may change due to cancellations." />
    </Fragment>
  );
}

function PerformanceSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-white border rounded-lg w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6 h-72" />
        <div className="bg-white border rounded-lg p-6 h-72" />
      </div>
      <div className="h-10 bg-white border rounded-lg w-64 mt-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6 h-72" />
        <div className="bg-white border rounded-lg p-6 h-72" />
      </div>
    </div>
  );
}
