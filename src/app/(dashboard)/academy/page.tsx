import { Heading1 } from "@/components/ui/typography";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IconComponent } from "@/components/Icon";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/prismicio";
import dayjs from "dayjs";
import { formatDate } from "@/lib/utils";

export default async function AcademyPage() {
  const client = createClient();

  const [videoTutorials, blogPosts] = await Promise.all([
    client.getAllByType("video_tutorial").catch(() => []),
    client
      .getAllByType("blog_post", {
        orderings: [{ field: "my.blog_post.published_date", direction: "desc" }],
        fetchLinks: ["blog_category.name"],
      })
      .catch(() => []),
  ]);

  return (
    <>
      <section>
        <div className="space-y-2 mb-10.25">
          <Heading1 className="text-2xl">Academy</Heading1>
          <p className="text-muted-foreground">
            Learn proven strategies and insights to boost your bookings through affiliate links.
          </p>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-3 flex items-center gap-x-2">
            <IconComponent icon="Play" className="text-primary" />
            <h2>Video Tutorials</h2>
          </div>

          {videoTutorials.map((video) => {
            const { title, description, views, thumbnail } = video.data;
            const thumbnailUrl = thumbnail.url ?? "";

            return (
              <Card key={video.id} className="gap-0 pt-0">
                <div className="aspect-video w-full max-h-55 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 bg-primary rounded-full flex items-center justify-center z-10">
                    <IconComponent icon="Play" className="fill-white text-white" />
                  </div>
                  {thumbnailUrl && (
                    <Image
                      src={thumbnailUrl}
                      alt={title ?? ""}
                      width={thumbnail.dimensions?.width ?? 640}
                      height={thumbnail.dimensions?.height ?? 360}
                      className="aspect-video w-full object-cover max-h-55"
                    />
                  )}
                </div>
                <CardContent className="flex flex-col gap-2 pt-4 pb-0">
                  <CardTitle>{title}</CardTitle>
                  <p className="text-[#4A5565] text-sm line-clamp-2">{description}</p>
                </CardContent>
                <CardFooter className="pt-2">
                  <p className="text-[#6A7282] text-sm">
                    {views != null ? `${formatPrice(views, false)} views` : ""}
                  </p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center gap-x-2">
            <IconComponent icon="BookOpen" className="text-primary" />
            <h2>Blog Posts & Insights</h2>
          </div>

          {blogPosts.map((post) => {
            const { title, description, featured_image, category, read_time, published_date } = post.data;
            const categoryName =
              category && "data" in category && category.data
                ? (category.data as { name?: string }).name
                : null;
            const imageUrl = featured_image.url ?? "";

            return (
              <Card key={post.id} className="gap-0 relative">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={title ?? ""}
                    width={featured_image.dimensions?.width ?? 640}
                    height={featured_image.dimensions?.height ?? 360}
                    className="hidden sm:block aspect-video w-full object-cover max-h-55"
                  />
                )}
                <CardHeader className="sm:pt-5 flex items-center gap-x-3 px-4 pt-4">
                  {categoryName && <Badge>{categoryName}</Badge>}
                  {read_time != null && (
                    <div className="flex items-center gap-x-0.5 text-[#6A7282]">
                      <IconComponent icon="Clock" size="sm" />
                      <p className="text-sm">{read_time} min read</p>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-2 pt-4 pb-0 px-4">
                  <CardTitle>{title}</CardTitle>
                  <p className="text-[#4A5565] text-sm line-clamp-3">{description}</p>
                </CardContent>
                <CardFooter className="pt-3 sm:pt-2 px-4">
                  {published_date && (
                    <p className="text-[#4A5565] md:text-[#6A7282] text-sm">
                      {formatDate(dayjs(published_date))}
                    </p>
                  )}
                </CardFooter>
                <Link href={`/academy/blog/${post.uid}`} className="absolute inset-0" />
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}
