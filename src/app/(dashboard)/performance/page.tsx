"use client";

import { Fragment, useState } from "react";
import PeriodFilter from "@/components/PeriodFilter";
import { getDefaultPeriod } from "@/lib/dates";
import { Heading1 } from "@/components/ui/typography";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import Banner from "@/components/Banner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const chartData = [
  { date: "Dec 21", clicks: 300 },
  { date: "Jan 2", clicks: 460 },
  { date: "Jan 4", clicks: 150 },
  { date: "Jan 6", clicks: 455 },
  { date: "Jan 8", clicks: 175 },
  { date: "Jan 10", clicks: 480 },
  { date: "Jan 14", clicks: 335 },
  { date: "Jan 18", clicks: 460 },
  { date: "Jan 22", clicks: 310 },
  { date: "Jan 26", clicks: 450 },
];
const clicksConfig = {
  clicks: {
    label: "Clicks",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

const bookingsData = [
  { date: "Jan 2", bookings: 14 },
  { date: "Jan 4", bookings: 30 },
  { date: "Jan 6", bookings: 31 },
  { date: "Jan 8", bookings: 25 },
  { date: "Jan 12", bookings: 17 },
  { date: "Jan 16", bookings: 33 },
  { date: "Jan 20", bookings: 16 },
  { date: "Jan 24", bookings: 43 },
  { date: "Jan 28", bookings: 38 },
];
const bookingsConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--color-secondary)",
  },
} satisfies ChartConfig;

const completedRentalsData = [
  { date: "Jan 2", rentals: 1 },
  { date: "Jan 4", rentals: 7 },
  { date: "Jan 6", rentals: 6 },
  { date: "Jan 8", rentals: 12 },
  { date: "Jan 12", rentals: 9 },
  { date: "Jan 16", rentals: 2.5 },
  { date: "Jan 20", rentals: 9 },
  { date: "Jan 24", rentals: 4 },
  { date: "Jan 28", rentals: 11 },
];
const completedRentalsConfig = {
  rentals: {
    label: "Rentals",
    color: "var(--color-secondary)",
  },
} satisfies ChartConfig;

const upcomingRentalsData = [
  { date: "Jan 29", rentals: 4 },
  { date: "Jan 30", rentals: 5 },
  { date: "Feb 1", rentals: 10 },
  { date: "Feb 2", rentals: 3 },
  { date: "Feb 3", rentals: 2 },
  { date: "Feb 4", rentals: 5 },
  { date: "Feb 5", rentals: 8 },
  { date: "Feb 6", rentals: 7.5 },
  { date: "Feb 7", rentals: 11 },
  { date: "Feb 8", rentals: 15 },
  { date: "Feb 9", rentals: 15 },
  { date: "Feb 10", rentals: 9.5 },
  { date: "Feb 11", rentals: 12 },
  { date: "Feb 12", rentals: 11 },
];
const upcomingRentalsConfig = {
  rentals: {
    label: "Rentals",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export default function Home() {
  const [period, setPeriod] = useState(getDefaultPeriod());

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
                  domain={[0, 600]}
                  ticks={[0, 150, 300, 450, 600]}
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
                  domain={[0, 60]}
                  ticks={[0, 15, 30, 45, 60]}
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
                    domain={[0, 600]}
                    ticks={[0, 150, 300, 450, 600]}
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
                    domain={[0, 60]}
                    ticks={[0, 15, 30, 45, 60]}
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
                  domain={[0, 16]}
                  ticks={[0, 4, 8, 12, 16]}
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
                  domain={[0, 12]}
                  ticks={[0, 3, 6, 9, 12]}
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
              <p className="text-2xl font-medium mt-1">44</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Commission Earned</p>
              <p className="text-2xl font-medium mt-1">28,400 Kr</p>
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
                <span className="text-sm font-medium text-secondary">{row.rentals} Kr</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Banner level="info" message="Number of bookings and revenue may change due to cancellations." />
    </Fragment>
  );
}
