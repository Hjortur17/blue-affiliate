"use client";

import { Heading1 } from "@/components/ui/typography";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconComponent } from "@/components/Icon";

const banners = [
  {
    title: "BLUE - Social Media Square",
    dimensions: "1080 × 1080",
    size: "1.5 MB",
    image: "/test.jpg",
  },
  {
    title: "BLUE - Social Media Square",
    dimensions: "1080 × 1080",
    size: "1.5 MB",
    image: "/test.jpg",
  },
  {
    title: "BLUE - Social Media Square",
    dimensions: "1080 × 1080",
    size: "1.5 MB",
    image: "/test.jpg",
  },
  {
    title: "BLUE - Social Media Square",
    dimensions: "1080 × 1080",
    size: "1.5 MB",
    image: "/test.jpg",
  },
  {
    title: "BLUE - Social Media Square",
    dimensions: "1080 × 1080",
    size: "1.5 MB",
    image: "/test.jpg",
  },
  {
    title: "BLUE - Social Media Square",
    dimensions: "1080 × 1080",
    size: "1.5 MB",
    image: "/test.jpg",
  },
];

export default function Home() {
  return (
    <>
      <section>
        <div className="space-y-2 mb-10.25">
          <Heading1 className="text-2xl">Marketing Material</Heading1>
          <p className="text-muted-foreground">
            Learn proven strategies and insights to boost your bookings through affiliate links.
          </p>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-3 gap-6">
          {banners.map((banner, i) => (
            <Card key={i} className="gap-0">
              <img src={banner.image} alt={banner.title} className="aspect-video w-full object-cover max-h-55" />
              <CardContent className="flex flex-col gap-2 pt-4 pb-0">
                <CardTitle>{banner.title}</CardTitle>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1">
                    <IconComponent icon="Image" className="size-4" />
                    {banner.dimensions}
                  </span>
                  <span>{banner.size}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button className="w-full flex items-center justify-center gap-2" variant="secondary">
                  <IconComponent icon="Download" className="size-5 -mt-0.5" />
                  Download Banner
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <Card>
          <CardContent>
            <p className="font-bold text-foreground mb-5">How to Use Marketing Materials</p>
            <p className="text-muted-foreground mb-4">
              These banners are designed to help you promote BLUE car rentals effectively. You can use them on your
              website, blog, or social media channels.
            </p>
            <ul className="list-disc pl-12 space-y-2 text-muted-foreground mb-6">
              <li>Choose the appropriate size for your platform</li>
              <li>Download the banner by clicking the download button</li>
              <li>Upload to your website or social media</li>
              <li>Link the banner to your unique affiliate link</li>
              <li>Track your performance in the Dashboard</li>
            </ul>
            <p className="text-muted-foreground">
              <span className="font-bold">Need custom sizes or formats?</span> Contact our support team and we'll be
              happy to create custom materials for your needs.
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
