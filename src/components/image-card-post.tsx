"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface ImageCardBlogDetailProps {
  post: {
    image: string;
    title: string;
  };
}

export default function ImageCardBlogDetail({
  post,
}: ImageCardBlogDetailProps) {
  return (
    <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
      <Skeleton className="absolute inset-0 bg-gray-200" />
      <Image
        src={post.image}
        alt={post.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 640px) 100vw, 50vw"
        onLoad={(e) => {
          (e.target as HTMLImageElement).style.opacity = "1";
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.opacity = "1";
        }}
        style={{ opacity: 0, transition: "opacity 0.3s ease" }}
      />
    </div>
  );
}
