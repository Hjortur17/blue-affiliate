import { IconComponent } from "./Icon";

const topCars = [
  { model: "Toyota RAV4", bookings: 45 },
  { model: "Suzuki Jimny", bookings: 38 },
  { model: "Kia Sportage", bookings: 32 },
  { model: "Dacia Duster", bookings: 28 },
  { model: "Hyundai Tucson", bookings: 24 },
];

export default function TopCars() {
  return (
    <div className="bg-card border border-light-gray rounded-[10px] px-6 pt-6 pb-px flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <IconComponent icon="Car" className="size-5 text-foreground" />
        <h2 className="text-foreground tracking-[-0.31px]">Top 5 Cars</h2>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-light-gray">
            <th className="text-left font-bold tracking-[-0.31px] px-4 py-3">Rank</th>
            <th className="text-left font-bold tracking-[-0.31px] px-4 py-3">Car Model</th>
            <th className="text-right font-bold tracking-[-0.31px] px-4 py-3">Bookings</th>
          </tr>
        </thead>
        <tbody>
          {topCars.map((car, index) => (
            <tr key={car.model} className="border-b border-[#f3f4f6]">
              <td className="px-4 py-4">
                <span className="inline-flex items-center justify-center size-8 rounded-full bg-[#ffedd4] text-secondary tracking-[-0.31px]">
                  {index + 1}
                </span>
              </td>
              <td className="px-4 py-4 tracking-[-0.31px]">{car.model}</td>
              <td className="px-4 py-4 text-right tracking-[-0.31px]">{car.bookings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
