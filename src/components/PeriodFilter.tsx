"use client";

import Icon from "@/components/Icon";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";

function generatePeriods(): string[] {
  const periods: string[] = [];
  const now = new Date();

  for (let i = 1; i <= 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    periods.push(label);
  }

  return periods;
}

const periods = generatePeriods();

interface PeriodFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function PeriodFilter({ value, onValueChange }: PeriodFilterProps) {
  return (
    <Combobox items={periods} value={value} onValueChange={(val) => onValueChange(val as string)}>
      <ComboboxInput
        placeholder="Select period"
        className="bg-white h-12.5 shadow-none border-[#E5E7EB] rounded-lg cursor-pointer"
        readOnly
      >
        <InputGroupAddon align="inline-start">
          <Icon.Calendar className="size-5 text-foreground" />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent>
        <ComboboxEmpty>No periods found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
