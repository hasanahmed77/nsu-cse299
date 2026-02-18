"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function Player({ src, subtitles }: { src: string; subtitles: { label: string; language: string; url: string }[] }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, [src]);

  return (
    <div className="bg-black rounded-lg overflow-hidden border border-white/10">
      <video ref={videoRef} controls className="w-full">
        {subtitles.map((s) => (
          <track key={s.url} label={s.label} kind="subtitles" srcLang={s.language} src={s.url} />
        ))}
      </video>
    </div>
  );
}
