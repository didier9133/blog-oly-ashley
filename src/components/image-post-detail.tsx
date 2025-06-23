"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface ImageBlogDetailProps {
  post: {
    image: string;
    title: string;
  };
}

export default function ImageBlogDetail({ post }: ImageBlogDetailProps) {
  return (
    <div className="relative w-full h-[300px]  rounded-xl overflow-hidden mb-6">
      {/* Skeleton loader that shows while image is loading */}
      <Skeleton className="absolute inset-0 bg-gray-200" />
      <Image
        src={post.image}
        alt={post.title}
        fill
        className="object-cover"
        onLoad={(e) => {
          // Hide skeleton when image loads by changing opacity
          const target = e.target as HTMLImageElement;
          target.style.opacity = "1";
        }}
        style={{ opacity: 0, transition: "opacity 0.3s ease" }}
        sizes="(max-width: 768px) 100vw,80vw"
        priority
      />
    </div>
  );
}
