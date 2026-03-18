const bookingTypes = [
  { label: "Standard", count: 156, percentage: 66.7 },
  { label: "Premium", count: 52, percentage: 22.2 },
  { label: "Luxury", count: 26, percentage: 11.1 },
];

export default function BookingTypesDistribution() {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[10px] px-6 pt-6 pb-6 flex flex-col gap-6">
      <h2 className="text-[#0a0a0a] text-xl font-medium leading-7.5 tracking-[-0.45px]">Booking Types Distribution</h2>
      <div className="flex flex-col gap-4">
        {bookingTypes.map(({ label, count, percentage }) => (
          <div key={label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[#364153] text-base leading-6 tracking-[-0.31px]">{label}</span>
              <span className="text-[#101828] text-base leading-6 tracking-[-0.31px]">
                {count} ({percentage}%)
              </span>
            </div>
            <div className="w-full h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
              <div className="h-2 bg-[#fd6112] rounded-full" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
