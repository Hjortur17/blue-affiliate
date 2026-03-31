import { Heading1 } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/prismicio";
import BannerCard from "@/components/BannerCard";

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
          {/* TODO: Remove fake banner once Prismic has real content */}
          <BannerCard
            title="BLUE - Social Media Square"
            imageUrl="/test.jpg"
            width={1080}
            height={1080}
            dimensions="1080 × 1080"
            fileSize="1.5 MB"
          />

          {banners.map((banner) => {
            const { title, image, file_size } = banner.data;
            const dimensions =
              image.dimensions ? `${image.dimensions.width} × ${image.dimensions.height}` : "";
            const imageUrl = image.url ?? "";

            if (!imageUrl) return null;

            return (
              <BannerCard
                key={banner.id}
                title={title ?? ""}
                imageUrl={imageUrl}
                width={image.dimensions?.width ?? 540}
                height={image.dimensions?.height ?? 540}
                dimensions={dimensions}
                fileSize={file_size}
              />
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
