import { Heading1 } from "@/components/ui/typography";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { IconComponent } from "@/components/Icon";
import { createClient } from "@/prismicio";
import Image from "next/image";
import BannerDownloadButton from "@/components/BannerDownloadButton";

export default async function MarketingMaterialPage() {
  const client = createClient();
  const banners = await client.getAllByType("marketing_banner").catch(() => []);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {banners.map((banner) => {
            const { title, image, file_size } = banner.data;
            const dimensions =
              image.dimensions ? `${image.dimensions.width} × ${image.dimensions.height}` : "";
            const imageUrl = image.url ?? "";

            return (
              <Card key={banner.id} className="gap-0">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={title ?? ""}
                    width={image.dimensions?.width ?? 540}
                    height={image.dimensions?.height ?? 540}
                    className="aspect-video w-full object-cover max-h-55"
                  />
                )}
                <CardContent className="flex flex-col gap-2 pt-4 pb-0">
                  <CardTitle>{title}</CardTitle>
                  <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    {dimensions && (
                      <span className="flex items-center gap-1">
                        <IconComponent icon="Image" className="size-4" />
                        {dimensions}
                      </span>
                    )}
                    {file_size && <span>{file_size}</span>}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  {imageUrl && (
                    <BannerDownloadButton
                      imageUrl={imageUrl}
                      filename={`${title ?? "banner"}.${imageUrl.split(".").pop()?.split("?")[0] ?? "jpg"}`}
                    />
                  )}
                </CardFooter>
              </Card>
            );
          })}
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
