import { IconComponent } from "./Icon";

export default function NoteBanner() {
  return (
    <div className="flex items-center gap-3 bg-[#eff6ff] border border-[#bedbff] rounded-[10px] px-4 py-4">
      <IconComponent icon="Information" className="size-5 text-primary shrink-0" />
      <p className="text-sm tracking-[-0.15px] text-[#1c398e]">
        <span className="font-bold">Note: </span>
        Number of bookings and revenue may change due to cancellations.
      </p>
    </div>
  );
}
