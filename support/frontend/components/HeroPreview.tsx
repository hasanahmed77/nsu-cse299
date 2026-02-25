"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

type HeroPreviewProps = {
  src?: string | null;
  poster?: string | null;
  title: string;
};

export default function HeroPreview({ src, poster, title }: HeroPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;

    const handleTimeUpdate = () => {
      if (video.currentTime >= 10) {
        video.currentTime = 0;
        void video.play().catch(() => {});
      }
    };

    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "metadata";
    video.addEventListener("timeupdate", handleTimeUpdate);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      void video.play().catch(() => {});
    } else if (Hls.isSupported()) {
      hls = new Hls({
        autoStartLoad: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        void video.play().catch(() => {});
      });
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      if (hls) hls.destroy();
    };
  }, [src]);

  if (!src) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-zinc-900 via-black to-black hero-zoom">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt={title} className="h-full w-full object-cover opacity-50 hero-zoom" />
        ) : null}
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className="h-full w-full object-cover opacity-55 hero-zoom"
      poster={poster ?? undefined}
      muted
      playsInline
      autoPlay
    />
  );
}
