"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import PeriodFilter from "@/components/PeriodFilter";
import { getDefaultPeriod, formatShortDate, periodToDateRange } from "@/lib/dates";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import Banner from "@/components/Banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { downloadCsv } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconComponent } from "@/components/Icon";
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
  const ceiling = Math.max(Math.ceil((max * 1.2) / 5) * 5, 10);
  const step = ceiling / 4;
  return {
    domain: [0, ceiling],
    ticks: [0, step, step * 2, step * 3, ceiling].map(Math.round),
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
      const range = periodToDateRange(p);
      const [engagementRes, rentalsRes] = await Promise.all([api.getEngagement(range), api.getRentals(range)]);
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

  const isInitialLoad = !engagement && !rentals && !error;

  const chartData = engagement?.clicksPerDay.map((d) => ({ date: formatShortDate(d.date), clicks: d.value }));
  const bookingsData = engagement?.bookingsPerDay.map((d) => ({ date: formatShortDate(d.date), bookings: d.value }));
  const upcomingRentalsData = rentals?.upcomingByPickupDate.map((d) => ({
    date: formatShortDate(d.date),
    rentals: d.value,
  }));
  const completedRentalsData = rentals?.completedByDropoffDate.map((d) => ({
    date: formatShortDate(d.date),
    rentals: d.value,
  }));

  const clicksAxis = engagement ? computeAxis(engagement.clicksPerDay) : null;
  const bookingsAxis = engagement ? computeAxis(engagement.bookingsPerDay) : null;
  const upcomingAxis = rentals ? computeAxis(rentals.upcomingByPickupDate) : null;
  const completedAxis = rentals ? computeAxis(rentals.completedByDropoffDate) : null;

  return (
    <Fragment>
      {error && !engagement && (
        <div className="mb-6">
          <Banner
            level="error"
            message={error}
            items={["Please try again or contact support if the issue persists."]}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10.25">
        <h1 className="uppercase tracking-[-0.31px] font-heading text-2xl">Performance</h1>

        <PeriodFilter value={period} onValueChange={setPeriod} inputClassName="h-9 sm:ml-auto" />
      </div>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <p className="text-lg font-medium">Engagement (Booking Date)</p>

          {engagement && (
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 sm:ml-auto"
              onClick={() => {
                const rows = engagement.clicksPerDay.map((c, i) => ({
                  date: c.date,
                  clicks: c.value,
                  bookings: engagement.bookingsPerDay[i]?.value ?? 0,
                }));
                downloadCsv(rows, "engagement-data.csv");
              }}
            >
              <IconComponent icon="Download" className="size-4" />
              Export CSV
            </Button>
          )}
        </div>

        {/* Desktop engagement charts */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          {isInitialLoad ? (
            <>
              <ChartSkeleton title="Clicks per Day" subtitle="Daily click traffic from affiliate links" />
              <ChartSkeleton
                title="Bookings Created per Day"
                subtitle="New bookings generated through your affiliate links"
              />
            </>
          ) : chartData && bookingsData && clicksAxis && bookingsAxis ? (
            <>
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
                    <ChartTooltip content={<ChartTooltipContent />} />
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
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="var(--color-bookings)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </>
          ) : null}
        </div>

        {/* Mobile engagement tabs */}
        <Tabs defaultValue="clicks-per-day" className="w-full block sm:hidden">
          <div className="flex flex-col-reverse sm:flex-row gap-2 mb-4 sm:mb-8">
            <TabsList className="w-full">
              <TabsTrigger value="clicks-per-day">Clicks per Day</TabsTrigger>
              <TabsTrigger value="bookings-created">Bookings Created</TabsTrigger>
            </TabsList>
          </div>

          {isInitialLoad ? (
            <ChartSkeleton title="Loading..." subtitle="" />
          ) : chartData && bookingsData && clicksAxis && bookingsAxis ? (
            <>
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
                      <ChartTooltip content={<ChartTooltipContent />} />
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
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="bookings"
                        stroke="var(--color-bookings)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </TabsContent>
            </>
          ) : null}
        </Tabs>
      </section>

      <section className="mt-6 sm:mt-12.25 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="text-lg font-medium">Commission Pipeline (Rental Date)</p>

          {rentals && (
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 sm:ml-auto"
              onClick={() => {
                const rows = rentals.upcomingByPickupDate.map((u, i) => ({
                  date: u.date,
                  upcoming_rentals: u.value,
                  completed_rentals: rentals.completedByDropoffDate[i]?.value ?? 0,
                }));
                downloadCsv(rows, "rentals-data.csv");
              }}
            >
              <IconComponent icon="Download" className="size-4" />
              Export CSV
            </Button>
          )}
        </div>

        <div className="hidden sm:block mb-6">
          <p className="mb-1.25">Commission Pipeline (Rental Date)</p>
          <p className="text-secondary">Upcoming + Completed Rentals</p>
        </div>

        {/* Desktop rental charts */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          {isInitialLoad ? (
            <>
              <ChartSkeleton
                title="Upcoming Rentals by Pickup Date"
                subtitle="Scheduled rentals in your commission pipeline"
              />
              <ChartSkeleton
                title="Completed Rentals by Dropoff Date"
                subtitle="Completed rentals = commission earned"
              />
            </>
          ) : upcomingRentalsData && completedRentalsData && upcomingAxis && completedAxis ? (
            <>
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
                    <ChartTooltip content={<ChartTooltipContent />} />
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
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="rentals" stroke="var(--color-rentals)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* Mobile rental sections */}
      <section className="sm:hidden mb-10">
        <div className="bg-card border rounded-lg p-5">
          <p className="text-lg font-medium text-foreground">Commission Pipeline (Rental Date)</p>
          <p className="text-sm text-secondary">Upcoming + Completed Rentals</p>

          {isInitialLoad ? (
            <div className="animate-pulse mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-lg p-4 h-16" />
                <div className="bg-background rounded-lg p-4 h-16" />
              </div>
              <div className="h-40 bg-background rounded-lg" />
            </div>
          ) : rentals && upcomingRentalsData ? (
            <>
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
            </>
          ) : null}
        </div>
      </section>

      <section className="sm:hidden mb-10">
        <div className="bg-card border rounded-lg p-5">
          <p className="text-sm font-medium text-muted-foreground">Completed Rentals by Dropoff Date</p>
          <p className="text-xs text-secondary mt-1">Completed rentals = commission earned</p>

          {isInitialLoad ? (
            <div className="animate-pulse mt-4 h-40 bg-background rounded-lg" />
          ) : completedRentalsData ? (
            <div className="flex flex-col gap-2 mt-4">
              {completedRentalsData.map((row) => (
                <div key={row.date} className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm text-foreground">{row.date}</span>
                  <span className="text-sm font-medium text-secondary">{row.rentals}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <Banner level="info" message="Number of bookings and revenue may change due to cancellations." />
    </Fragment>
  );
}

function ChartSkeleton({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <p className="mb-1.25">{title}</p>
      {subtitle && <p className="text-[#6A7282] text-sm mb-5.25">{subtitle}</p>}
      <div className="flex aspect-video lg:max-h-64 xl:max-h-80 w-full">
        <div className="animate-pulse w-full h-full bg-background rounded-lg" />
      </div>
    </div>
  );
}
