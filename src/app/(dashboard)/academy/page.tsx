"use client";

import { Heading1 } from "@/components/ui/typography";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IconComponent } from "@/components/Icon";
import { formatDate, formatPrice } from "@/lib/utils";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const videoTutorials = [
  {
    title: "Getting Started with Affiliate Marketing",
    description: "Learn the basics of affiliate marketing and how to maximize your earnings with BLUE.",
    views: 1234,
    image: "/video-test.jpg",
  },
  {
    title: "SEO Tips for Affiliate Links",
    description: "Optimize your content to rank higher and drive more traffic to your affiliate links.",
    views: 892,
    image: "/video-test.jpg",
  },
  {
    title: "Creating Compelling Content",
    description: "How to create engaging content that converts visitors into bookings.",
    views: 1567,
    image: "/video-test.jpg",
  },
];

const blogPosts = [
  {
    url: "10-proven-strategies-to-boost-your-affiliate-bookings",
    title: "10 Proven Strategies to Boost Your Affiliate Bookings",
    description:
      "Discover the most effective techniques used by our top-performing affiliates to increase conversion rates and maximize commissions.",
    category: "Marketing",
    timeToRead: 8,
    publishedAt: dayjs("2025-12-08"),
    image: "/test.jpg",
  },
  {
    url: "understanding-your-audience-iceland-travel-trends",
    title: "Understanding Your Audience: Iceland Travel Trends",
    description:
      "Learn about seasonal trends, popular destinations, and what Iceland visitors are looking for when renting a car.",
    category: "Insights",
    timeToRead: 6,
    publishedAt: dayjs("2025-11-28"),
    image: "/test.jpg",
  },
  {
    url: "social-media-marketing-for-affiliates",
    title: "Social Media Marketing for Affiliates",
    description:
      "Master the art of promoting your affiliate links on Instagram, Facebook, and TikTok without being too salesy.",
    category: "Social Media",
    timeToRead: 10,
    publishedAt: dayjs("2025-11-20"),
    image: "/test.jpg",
  },
  {
    url: "email-marketing-best-practices",
    title: "Email Marketing Best Practices",
    description:
      "Build and nurture your email list to create a consistent stream of bookings through your affiliate link.",
    category: "Email Marketing",
    timeToRead: 7,
    publishedAt: dayjs("2025-11-15"),
    image: "/test.jpg",
  },
  {
    url: "analytics-101-track-what-matters",
    title: "Analytics 101: Track What Matters",
    description: "Learn which metrics to focus on and how to use data to improve your affiliate marketing performance.",
    category: "Analytics",
    timeToRead: 9,
    publishedAt: dayjs("2025-11-8"),
    image: "/test.jpg",
  },
  {
    url: "content-calendar-planning-for-success",
    title: "Content Calendar: Planning for Success",
    description:
      "Create a strategic content calendar that aligns with Iceland travel seasons and maximizes your earning potential.",
    category: "Planning",
    timeToRead: 5,
    publishedAt: dayjs("2025-10-30"),
    image: "/test.jpg",
  },
];

export default function Home() {
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

          {videoTutorials.map((banner, i) => (
            <Card key={i} className="gap-0 pt-0">
              <div className="aspect-video w-full max-h-55 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 bg-primary rounded-full flex items-center justify-center">
                  <IconComponent icon="Play" className="fill-white text-white" />
                </div>
                <img src={banner.image} alt={banner.title} className="aspect-video w-full object-cover max-h-55" />
              </div>
              <CardContent className="flex flex-col gap-2 pt-4 pb-0">
                <CardTitle>{banner.title}</CardTitle>
                <p className="text-[#4A5565] text-sm line-clamp-2">{banner.description}</p>
              </CardContent>
              <CardFooter className="pt-2">
                <p className="text-[#6A7282] text-sm">{formatPrice(banner.views, false)} views</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center gap-x-2">
            <IconComponent icon="BookOpen" className="text-primary" />
            <h2>Blog Posts & Insights</h2>
          </div>

          {blogPosts.map((post, i) => (
            <Card key={i} className="gap-0 relative">
              <img
                src={post.image}
                alt={post.title}
                className="hidden sm:block aspect-video w-full object-cover max-h-55"
              />
              <CardHeader className="sm:pt-5 flex items-center gap-x-3 px-4 pt-4">
                <Badge>{post.category}</Badge>
                <div className="flex items-center gap-x-0.5 text-[#6A7282]">
                  <IconComponent icon="Clock" size="sm" />
                  <p className="text-sm">{post.timeToRead} min read</p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pt-4 pb-0 px-4">
                <CardTitle>{post.title}</CardTitle>
                <p className="text-[#4A5565] text-sm line-clamp-3">{post.description}</p>
              </CardContent>
              <CardFooter className="pt-3 sm:pt-2 px-4">
                <p className="text-[#4A5565] md:text-[#6A7282] text-sm">{formatDate(post.publishedAt)}</p>
              </CardFooter>
              <Link href={`/blog/${post.url}`} className="absolute inset-0" />
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
