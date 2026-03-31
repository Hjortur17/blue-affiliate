"use client";

import { useState } from "react";
import { IconComponent } from "@/components/Icon";

interface CopyButtonProps {
  value: string;
}

export default function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
      <IconComponent icon={copied ? "Check" : "Copy"} className="size-4" />
    </button>
  );
}
