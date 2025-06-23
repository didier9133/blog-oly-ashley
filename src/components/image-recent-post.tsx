"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface ImageCardBlogDetailProps {
  post: {
    image: string;
    title: string;
  };
}

export default function ImageRecentPost({ post }: ImageCardBlogDetailProps) {
  return (
    <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
      <Skeleton className="absolute inset-0 bg-gray-200" />
      <Image
        src={post.image}
        alt={post.title}
        fill
        className="object-cover"
        sizes="200px"
        onLoad={(e) => {
          // Hide skeleton when image loads by changing opacity
          const target = e.target as HTMLImageElement;
          target.style.opacity = "1";
        }}
        style={{ opacity: 0, transition: "opacity 0.3s ease" }}
      />
    </div>
  );
}
