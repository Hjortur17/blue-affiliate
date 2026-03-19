"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsGrid from "@/components/StatsGrid";
import BookingTypesDistribution from "@/components/BookingTypesDistribution";
import PeriodFilter from "@/components/PeriodFilter";

function getDefaultPeriod(): string {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return lastMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function DashboardContent() {
  const [period, setPeriod] = useState(getDefaultPeriod());

  return (
    <Tabs defaultValue="booking-data" className="w-full">
      <div className="flex gap-4">
        <TabsList className="mb-8">
          <TabsTrigger value="booking-data">Booking Data</TabsTrigger>
          <TabsTrigger value="delivery-data">Delivery Data</TabsTrigger>
        </TabsList>

        <PeriodFilter value={period} onValueChange={setPeriod} />
      </div>

      <TabsContent value="booking-data">
        <div className="space-y-6">
          <StatsGrid />
          <BookingTypesDistribution />
        </div>
      </TabsContent>
      <TabsContent value="delivery-data">
        <p>Delivery Data</p>
      </TabsContent>
    </Tabs>
  );
}
