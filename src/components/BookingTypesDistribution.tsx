"use client";

import { useEffect, useState } from "react";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";

const bookingTypes = [
  { label: "Standard", count: 156, percentage: 66.7 },
  { label: "Premium", count: 52, percentage: 22.2 },
  { label: "Luxury", count: 26, percentage: 11.1 },
];

export default function BookingTypesDistribution() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg px-6 pt-6 pb-6 flex flex-col gap-6">
      <h2 className="text-lg sm:text-xl font-medium/7.5 tracking-[-0.45px]">Booking Types Distribution</h2>
      <div className="flex flex-col gap-4">
        {bookingTypes.map(({ label, count, percentage }) => (
          <div key={label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[#364153] tracking-[-0.31px]">{label}</span>
              <span className="tracking-[-0.31px]">
                {count} ({percentage}%)
              </span>
            </div>
            <Progress value={animated ? percentage : 0}>
              <ProgressTrack className="h-2">
                <ProgressIndicator className="bg-secondary transition-all duration-700 ease-out rounded-lg" />
              </ProgressTrack>
            </Progress>
          </div>
        ))}
      </div>
    </div>
  );
}
