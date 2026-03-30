"use client";

import { useState } from "react";
import BookingTypesDistribution from "@/components/BookingTypesDistribution";
import Banner from "@/components/Banner";
import PeriodFilter from "@/components/PeriodFilter";
import StatsGrid from "@/components/StatsGrid";
import Table, { type Column } from "@/components/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type TopCar } from "@/types/data";
import { getDefaultPeriod } from "@/lib/dates";

const topCarsData: TopCar[] = [
  { model: "Toyota Corolla", bookings: 142 },
  { model: "Honda Civic", bookings: 118 },
  { model: "Ford Focus", bookings: 97 },
  { model: "BMW 3 Series", bookings: 84 },
  { model: "Audi A4", bookings: 76 },
];

const topCarsColumns: Column<TopCar>[] = [
  {
    id: "rank",
    header: "Rank",
    render: (_row, index) => (
      <span className="inline-flex items-center justify-center size-8 rounded-full bg-[#ffedd4] text-secondary">
        {index + 1}
      </span>
    ),
  },
  { id: "model", header: "Car Model", accessor: "model" },
  { id: "bookings", header: "Bookings", accessor: "bookings", align: "right" },
];

export default function Home() {
  const [period, setPeriod] = useState(getDefaultPeriod());

  return (
    <Tabs defaultValue="booking-data" className="w-full">
      <div className="flex flex-col-reverse sm:flex-row gap-2 mb-4 sm:mb-8">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="booking-data">Booking Data</TabsTrigger>
          <TabsTrigger value="delivery-data">Delivery Data</TabsTrigger>
        </TabsList>

        <PeriodFilter value={period} onValueChange={setPeriod} />
      </div>

      <TabsContent value="booking-data">
        <div className="space-y-6">
          <StatsGrid
            stats={[
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
            ]}
          />

          <BookingTypesDistribution />

          <Table title="Top 5 Cars" icon="Car" columns={topCarsColumns} data={topCarsData} />

          <Banner level="info" message="Number of bookings and revenue may change due to cancellations." />
        </div>
      </TabsContent>
      <TabsContent value="delivery-data">
        <div className="space-y-6">
          <StatsGrid
            stats={[
              {
                label: "Total Bookings",
                value: "198",
                subtext: "+12% from last month",
                subtextColor: "green",
              },
              {
                label: "Total Revenue",
                value: "1,056,000 Kr",
                subtext: "Excl. VAT",
              },
              {
                label: "Total Commission",
                value: "52,800 Kr",
                subtext: "Excl. VAT",
              },
            ]}
          />

          <Table title="Top 5 Cars" icon="Car" columns={topCarsColumns} data={topCarsData} />

          <Banner
            level="info"
            message="Total Revenue, Total Commission, and Total Bookings are not confirmed values until the month has ended"
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
