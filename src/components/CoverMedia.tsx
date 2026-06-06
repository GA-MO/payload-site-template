import Image from "next/image";
import { cn } from "@/lib/cn";
import { toMediaPath } from "@/lib/media";
import type { Media } from "@/payload-types";

type Props = {
  media: Media;
  className?: string;
  // When the media is a video, autoplay/loop muted so it acts as a moving cover.
  // GIFs render unoptimized so their animation survives next/image.
  alt?: string;
  preferSize?: "thumbnail" | "card" | "feature";
};

export function CoverMedia({ media, className, alt, preferSize = "card" }: Props) {
  const isVideo = media.mimeType?.startsWith("video/") ?? false;

  if (isVideo) {
    if (!media.url) return null;
    return (
      <video
        src={media.url}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  const sized = media.sizes?.[preferSize];
  const url = sized?.url ?? media.url;
  const width = sized?.width ?? media.width;
  const height = sized?.height ?? media.height;
  if (!url || !width || !height) return null;

  return (
    <Image
      src={toMediaPath(url)}
      alt={alt ?? media.alt ?? ""}
      width={width}
      height={height}
      unoptimized={media.mimeType === "image/gif"}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
