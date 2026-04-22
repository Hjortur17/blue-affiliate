"use client";

import { useCallback, useEffect, useState } from "react";
import Banner from "@/components/Banner";
import BookingTypesDistribution from "@/components/BookingTypesDistribution";
import { IconComponent } from "@/components/Icon";
import PeriodFilter from "@/components/PeriodFilter";
import StatsGrid from "@/components/StatsGrid";
import Table, { type Column } from "@/components/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { getDefaultPeriod, periodToDateRange } from "@/lib/dates";
import { formatPrice } from "@/lib/utils";
import type { DashboardSummary } from "@/types/api";
import type { StatCard } from "@/types/data";

interface TopCarRow {
  rank: number;
  model: string;
}

const topCarsColumns: Column<TopCarRow>[] = [
  {
    id: "rank",
    header: "Rank",
    render: (row) => (
      <span className="inline-flex items-center justify-center size-8 rounded-full bg-secondary-muted text-secondary">
        {row.rank}
      </span>
    ),
  },
  { id: "model", header: "Car Model", accessor: "model" },
];

function changeSubtext(changePercent: number | undefined): { subtext: string; subtextColor: "green" | "red" } {
  const pct = changePercent ?? 0;
  const sign = pct >= 0 ? "+" : "";
  return {
    subtext: `${sign}${pct}% from last month`,
    subtextColor: pct >= 0 ? "green" : "red",
  };
}

function buildBookingStats(data: DashboardSummary): StatCard[] {
  const bookingsChange = changeSubtext(data.totalBookings.changePercent);
  const revenueChange = changeSubtext(data.totalRevenue.changePercent);
  const commissionChange = changeSubtext(data.expectedCommission.changePercent);
  const clicksChange = changeSubtext(data.totalClicks.changePercent);

  return [
    {
      label: "Total Bookings",
      value: data.totalBookings.value.toLocaleString(),
      subtext: bookingsChange.subtext,
      subtextColor: bookingsChange.subtextColor,
    },
    {
      label: "Total Revenue",
      value: formatPrice(data.totalRevenue.value),
      subtext: revenueChange.subtext,
      subtextColor: revenueChange.subtextColor,
    },
    {
      label: "Expected Commission",
      value: formatPrice(data.expectedCommission.value),
      valueSuffix: "Excl. VAT",
      subtext: commissionChange.subtext,
      subtextColor: commissionChange.subtextColor,
      info: "Your projected commission based on confirmed bookings in the selected period. Final amounts are confirmed once all deliveries are closed.",
    },
    {
      label: "Total Clicks",
      value: data.totalClicks.value.toLocaleString(),
      subtext: clicksChange.subtext,
      subtextColor: clicksChange.subtextColor,
    },
  ];
}

function buildDeliveryStats(data: DashboardSummary): StatCard[] {
  const bookingsChange = changeSubtext(data.totalBookings.changePercent);
  const revenueChange = changeSubtext(data.totalRevenue.changePercent);
  const commissionChange = changeSubtext(data.expectedCommission.changePercent);

  return [
    {
      label: "Total Deliveries",
      value: data.totalBookings.value.toLocaleString(),
      subtext: bookingsChange.subtext,
      subtextColor: bookingsChange.subtextColor,
    },
    {
      label: "Total Revenue",
      value: formatPrice(data.totalRevenue.value),
      subtext: revenueChange.subtext,
      subtextColor: revenueChange.subtextColor,
    },
    {
      label: "Total Commission",
      value: formatPrice(data.expectedCommission.value),
      valueSuffix: "Excl. VAT",
      subtext: commissionChange.subtext,
      subtextColor: commissionChange.subtextColor,
    },
  ];
}

export default function Home() {
  const [period, setPeriod] = useState(getDefaultPeriod());
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = useCallback(async (p: string) => {
    setIsFetching(true);
    setError(null);
    try {
      const range = periodToDateRange(p);
      const result = await api.getDashboard(range);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData(period);
  }, [period, fetchData]);

  // Only show skeleton on initial load (no data yet)
  if (!data && isFetching) {
    return <DashboardSkeleton />;
  }

  if (!data && error) {
    return (
      <Banner level="error" message={error} items={["Please try again or contact support if the issue persists."]} />
    );
  }

  if (!data) return null;

  return (
    <Tabs defaultValue="booking-data" className="w-full">
      <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-2 mb-4 sm:mb-8">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="booking-data">Booking Data</TabsTrigger>
          <TabsTrigger value="delivery-data">Delivery Data</TabsTrigger>
        </TabsList>

        <PeriodFilter value={period} onValueChange={setPeriod} />

        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#eff6ff] border border-[#bedbff] sm:ml-auto">
          <IconComponent icon="Info" className="text-primary shrink-0" />
          <p className="text-sm font-bold text-[#1c398e]">Your commission is X%</p>
        </div>
      </div>

      <TabsContent value="booking-data">
        <div className="space-y-6">
          <StatsGrid stats={buildBookingStats(data)} loading={isFetching} />

          <BookingTypesDistribution distribution={data.bookingTypeDistribution} />

          <Table title="Top 5 Cars" icon="Car" columns={topCarsColumns} data={data.topCars} />

          <Banner level="info" message="Number of bookings and revenue may change due to cancellations." />
        </div>
      </TabsContent>
      <TabsContent value="delivery-data">
        <div className="space-y-6">
          <StatsGrid stats={buildDeliveryStats(data)} loading={isFetching} />

          <Table title="Top 5 Cars" icon="Car" columns={topCarsColumns} data={data.topCars} />

          <Banner
            level="info"
            message="Total Revenue, Total Commission, and Total Bookings are not confirmed values until the month has ended"
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border rounded-lg p-6 h-28" />
        ))}
      </div>
      <div className="bg-white border rounded-lg p-6 h-48" />
      <div className="bg-white border rounded-lg p-6 h-64" />
    </div>
  );
}
