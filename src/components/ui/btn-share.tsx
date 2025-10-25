"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

const handleShare = () => {
  console.log("Share button clicked");
};

export function ButtonShare() {
  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <Button size="icon" variant="default" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
