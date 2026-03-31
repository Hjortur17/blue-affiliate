"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { IconComponent } from "@/components/Icon";
import BannerDownloadButton from "@/components/BannerDownloadButton";

interface BannerCardProps {
  title: string;
  imageUrl: string;
  width: number;
  height: number;
  dimensions: string;
  fileSize: string | null;
}

export default function BannerCard({ title, imageUrl, width, height, dimensions, fileSize }: BannerCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (lightboxOpen) {
      requestAnimationFrame(() => setAnimateIn(true));
    }
  }, [lightboxOpen]);

  function closeLightbox() {
    setAnimateIn(false);
    setTimeout(() => setLightboxOpen(false), 200);
  }

  return (
    <>
      <Card className="gap-0">
        <button type="button" onClick={() => setLightboxOpen(true)} className="cursor-zoom-in">
          <Image
            src={imageUrl}
            alt={title}
            width={width}
            height={height}
            className="aspect-video w-full object-cover max-h-55"
          />
        </button>
        <CardContent className="flex flex-col gap-2 pt-4 pb-0">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            {dimensions && (
              <span className="flex items-center gap-1">
                <IconComponent icon="Image" className="size-4" />
                {dimensions}
              </span>
            )}
            {fileSize && <span>{fileSize}</span>}
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <BannerDownloadButton
            imageUrl={imageUrl}
            filename={`${title}.${imageUrl.split(".").pop()?.split("?")[0] ?? "jpg"}`}
          />
        </CardFooter>
      </Card>

      {lightboxOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-200 ${animateIn ? "bg-black/80" : "bg-black/0"}`}
          onClick={closeLightbox}
          onKeyDown={(e) => e.key === "Escape" && closeLightbox()}
          role="dialog"
          tabIndex={-1}
          ref={(el) => el?.focus()}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className={`absolute top-4 right-4 text-white hover:text-white/80 transition-opacity duration-200 ${animateIn ? "opacity-100" : "opacity-0"}`}
          >
            <IconComponent icon="X" className="size-8" />
          </button>
          <img
            src={imageUrl}
            alt={title}
            className={`max-w-full max-h-[90vh] object-contain rounded-lg transition-all duration-200 ${animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
