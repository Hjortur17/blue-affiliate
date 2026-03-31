"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconComponent } from "@/components/Icon";

interface BannerDownloadButtonProps {
  imageUrl: string;
  filename: string;
}

export default function BannerDownloadButton({ imageUrl, filename }: BannerDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    setIsDownloading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Button
      className="w-full flex items-center justify-center gap-2"
      variant="secondary"
      onClick={handleDownload}
      disabled={isDownloading}
    >
      <IconComponent icon="Download" className="size-5 -mt-0.5" />
      {isDownloading ? "Downloading..." : "Download Banner"}
    </Button>
  );
}
