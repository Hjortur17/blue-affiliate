import type { ReactNode } from "react";
import Icon, { IconComponent } from "./Icon";

export type Column<T> = {
  id: string;
  header: string;
  align?: "left" | "right";
  render?: (row: T, index: number) => ReactNode;
  accessor?: keyof T;
};

type TableProps<T extends Record<string, unknown>> = {
  title: string;
  icon: keyof typeof Icon;
  columns: Column<T>[];
  data: T[];
};

export default function Table<T extends Record<string, unknown>>({ title, icon, columns, data }: TableProps<T>) {
  return (
    <div className="bg-card border border-light-gray rounded-lg px-6 pt-6 pb-px flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <IconComponent icon={icon} className="size-5 text-foreground" />
        <h2>{title}</h2>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-light-gray text-left">
            {columns.map((col) => (
              <th key={col.id} className={`font-bold px-4 py-3${col.align === "right" ? " text-right" : ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b border-[#f3f4f6]">
              {columns.map((col) => (
                <td key={col.id} className={`px-4 py-4${col.align === "right" ? " text-right" : ""}`}>
                  {col.render ? col.render(row, index) : col.accessor != null ? String(row[col.accessor] ?? "") : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
