import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PrismicRichText } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { Badge } from "@/components/ui/badge";
import { IconComponent } from "@/components/Icon";
import { formatDate } from "@/lib/utils";
import dayjs from "dayjs";

type Params = Promise<{ uid: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { uid } = await params;
  const client = createClient();
  const post = await client.getByUID("blog_post", uid).catch(() => null);

  if (!post) return {};

  return {
    title: `${post.data.title} — Blue Affiliate`,
    description: post.data.description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const posts = await client.getAllByType("blog_post").catch(() => []);
  return posts.map((post) => ({ uid: post.uid }));
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { uid } = await params;
  const client = createClient();
  const post = await client
    .getByUID("blog_post", uid, {
      fetchLinks: ["blog_category.name"],
    })
    .catch(() => null);

  if (!post) notFound();

  const { title, description, featured_image, category, read_time, published_date, body } = post.data;
  const categoryName =
    category && "data" in category && category.data
      ? (category.data as { name?: string }).name
      : null;
  const imageUrl = featured_image.url ?? "";

  return (
    <article className="max-w-3xl">
      <Link href="/academy" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <IconComponent icon="ArrowLeft" className="size-4" />
        Back to Academy
      </Link>

      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title ?? ""}
          width={featured_image.dimensions?.width ?? 800}
          height={featured_image.dimensions?.height ?? 450}
          className="w-full rounded-lg object-cover mb-6"
          priority
        />
      )}

      <div className="flex items-center gap-3 mb-4">
        {categoryName && <Badge>{categoryName}</Badge>}
        {read_time != null && (
          <div className="flex items-center gap-x-0.5 text-[#6A7282]">
            <IconComponent icon="Clock" size="sm" />
            <p className="text-sm">{read_time} min read</p>
          </div>
        )}
        {published_date && <p className="text-sm text-[#6A7282]">{formatDate(dayjs(published_date))}</p>}
      </div>

      <h1 className="text-3xl font-medium tracking-tight mb-4">{title}</h1>

      {description && <p className="text-lg text-muted-foreground mb-8">{description}</p>}

      <div className="prose prose-lg max-w-none">
        <PrismicRichText field={body} />
      </div>
    </article>
  );
}
