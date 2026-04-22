"use client";

import { CircleX, Pencil, Save } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

// FAKE DATA — the Blue Desk API doesn't yet expose affiliate bank-account details.
// Remove once the docs/api-gaps.md "Affiliate bank account" item lands.
const initialBankAccount = {
  holder: "Jón Sigurðsson",
  bankName: "Landsbankinn",
  iban: "0133-26-654321",
  swift: "",
};

export default function BankAccount() {
  const [saved, setSaved] = useState(initialBankAccount);
  const [holder, setHolder] = useState(saved.holder);
  const [bankName, setBankName] = useState(saved.bankName);
  const [iban, setIban] = useState(saved.iban);
  const [swift, setSwift] = useState(saved.swift);
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    setHolder(saved.holder);
    setBankName(saved.bankName);
    setIban(saved.iban);
    setSwift(saved.swift);
    setIsEditing(true);
  };

  const handleSave = () => {
    setSaved({ holder, bankName, iban, swift });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setHolder(saved.holder);
    setBankName(saved.bankName);
    setIban(saved.iban);
    setSwift(saved.swift);
    setIsEditing(false);
  };

  if (!isEditing) {
    const readOnlyFields: { label: string; value: string; mono?: boolean }[] = [
      { label: "Account Holder", value: saved.holder },
      { label: "Bank", value: saved.bankName },
      { label: "Account Number", value: saved.iban, mono: true },
      { label: "SWIFT / BIC", value: saved.swift || "—", mono: true },
    ];

    return (
      <div className="border border-light-gray rounded-2xl p-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Bank Account</h2>
          <button
            type="button"
            onClick={startEditing}
            aria-label="Edit bank account"
            className="size-8 rounded flex items-center justify-center text-muted-foreground hover:bg-muted"
          >
            <Pencil className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {readOnlyFields.map((f) => (
            <div key={f.label} className="flex flex-col gap-[3.75px]">
              <p className="text-[11px] font-medium text-[#6a7282]">{f.label}</p>
              <p className={cn("text-sm text-foreground", f.mono && "font-mono")}>{f.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-[#bedbff] bg-[#eff6ff] px-3 py-3 text-[11px] leading-4 text-[#1c398e]">
          Note: Payouts will be transferred to this account. Make sure your details are accurate.
        </div>
      </div>
    );
  }

  const fields: { label: string; placeholder?: string; value: string; onChange: (v: string) => void }[] = [
    { label: "Account Holder Name", value: holder, onChange: setHolder },
    { label: "Bank Name", value: bankName, onChange: setBankName },
    { label: "Account Number / IBAN", value: iban, onChange: setIban },
    { label: "SWIFT / BIC (Optional)", placeholder: "NBIIISREXXX", value: swift, onChange: setSwift },
  ];

  return (
    <div className="border border-light-gray rounded-2xl p-8 flex flex-col gap-4">
      <h2 className="text-2xl font-medium">Bank Account</h2>

      <div className="flex flex-col gap-3">
        {fields.map((f) => (
          <div key={f.label} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#6a7282]">{f.label}</label>
            <Input
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              placeholder={f.placeholder}
              className="h-[39px] rounded-lg border-light-gray text-sm placeholder:text-foreground/50"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 h-10 rounded-lg bg-secondary text-white text-sm font-medium flex items-center justify-center gap-1.5"
        >
          <Save className="size-4" />
          Save Changes
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 h-10 rounded-lg bg-[#f3f4f6] text-[#364153] text-sm font-medium flex items-center justify-center gap-1.5"
        >
          <CircleX className="size-4" />
          Cancel
        </button>
      </div>
    </div>
  );
}
