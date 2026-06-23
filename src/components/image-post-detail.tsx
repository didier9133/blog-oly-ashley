"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface ImageBlogDetailProps {
  post: {
    image: string;
    title: string;
    video?: string | null;
  };
}

export default function ImageBlogDetail({ post }: ImageBlogDetailProps) {
  const videoSource = post.video ?? null;

  return (
    <div className="relative w-full h-[300px]  rounded-xl overflow-hidden mb-6">
      {/* Skeleton loader that shows while image is loading */}

      {videoSource ? (
        <video
          src={videoSource}
          controls
          className="w-full h-full object-cover"
          poster={post.image}
          autoPlay
          muted
          loop
        />
      ) : (
        <>
          <Skeleton className="absolute inset-0 bg-gray-200" />
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            style={{ opacity: 0, transition: "opacity 0.3s ease" }}
            onLoad={(e) => {
              (e.target as HTMLImageElement).style.opacity = "1";
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "1";
            }}
            sizes="(max-width: 768px) 100vw,80vw"
            priority
          />
        </>
      )}
    </div>
  );
}
