"use client"

import { cn } from "@/lib/utils";
import Image from "next/image";

interface CoverProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({
  url,
  preview
}: CoverProps) => {
  return (
    <div className={cn(
      "relative w-full h-[30vh] group",
      !url && "h-[12vh]",
      url && "bg-muted"
    )}>
      {!!url && (
        <Image
          src={url}
          alt="Cover"
          fill
          className="object-cover"
        />
      )}
    </div>
  )
}