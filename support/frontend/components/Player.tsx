"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { api } from "../lib/api";

type Subtitle = { label: string; language: string; url: string };

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function isHlsSource(src: string) {
  try {
    return new URL(src).pathname.toLowerCase().endsWith(".m3u8");
  } catch {
    return src.toLowerCase().split("?")[0].endsWith(".m3u8");
  }
}

export default function Player({
  src,
  subtitles,
  movieId,
  movieTitle,
  description,
}: {
  src: string;
  subtitles: Subtitle[];
  movieId: number;
  movieTitle: string;
  description?: string | null;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentAt20Ref = useRef(false);
  const completedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showChrome, setShowChrome] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasStreamReady, setHasStreamReady] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsBuffering(true);
    setHasStreamReady(false);
    setStreamError(null);
    video.removeAttribute("src");
    video.load();

    if (!src) {
      setIsBuffering(false);
      setStreamError("No stream URL is available for this movie.");
      return;
    }

    const hlsSource = isHlsSource(src);

    if (!hlsSource) {
      video.src = src;
      video.load();
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.load();
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setHasStreamReady(true);
        setIsBuffering(false);
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }
        setIsBuffering(false);
        setStreamError("This stream could not be loaded. Please check the video URL or storage permissions.");
      });
      return () => hls.destroy();
    }

    setIsBuffering(false);
    setStreamError("This browser does not support the stream format.");
  }, [src]);

  useEffect(() => {
    sentAt20Ref.current = false;
    completedRef.current = false;
  }, [movieId, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const pushHistory = async (progressSeconds: number, completed: boolean) => {
      try {
        await api("/api/v1/history", {
          method: "POST",
          body: JSON.stringify({
            movie_id: movieId,
            progress_seconds: progressSeconds,
            completed,
          }),
        });
      } catch {
        // Ignore unauthenticated users and transient failures.
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime || 0);
      if (!sentAt20Ref.current && video.currentTime >= 20) {
        sentAt20Ref.current = true;
        void pushHistory(Math.floor(video.currentTime), false);
      }
    };

    const markStreamReady = () => {
      setHasStreamReady(true);
      setIsBuffering(false);
      setStreamError(null);
    };

    const onLoadedMetadata = () => {
      setDuration(video.duration || 0);
      setCurrentTime(video.currentTime || 0);
      setIsMuted(video.muted);
      setVolume(video.volume);
      markStreamReady();
    };
    const onCanPlay = () => markStreamReady();
    const onWaiting = () => {
      if (!video.paused && video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
        setIsBuffering(true);
      }
    };
    const onError = () => {
      setIsBuffering(false);
      setStreamError("This stream could not be loaded. Please check the video URL or storage permissions.");
    };

    const onEnded = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      setIsPlaying(false);
      void pushHistory(Math.floor(video.duration || video.currentTime || 0), true);
    };

    const onPlay = () => {
      setIsPlaying(true);
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        markStreamReady();
      }
    };
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => {
      setIsMuted(video.muted);
      setVolume(video.volume);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onCanPlay);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("canplaythrough", onCanPlay);
    video.addEventListener("playing", onCanPlay);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("error", onError);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("volumechange", onVolumeChange);

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      onLoadedMetadata();
    }
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      onCanPlay();
    }

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", onCanPlay);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("canplaythrough", onCanPlay);
      video.removeEventListener("playing", onCanPlay);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("error", onError);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("volumechange", onVolumeChange);
    };
  }, [movieId]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const onVolumeInput = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = value;
    if (value > 0 && video.muted) {
      video.muted = false;
    }
    if (value === 0) {
      video.muted = true;
    }
    setVolume(value);
  };

  const seekBy = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min((video.duration || 0) - 0.2, video.currentTime + seconds));
  };

  const onProgressChange = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  };

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (containerRef.current) {
      await containerRef.current.requestFullscreen();
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typingInField =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (typingInField) return;

      if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        togglePlay();
        handleUserActivity();
        return;
      }

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        void toggleFullscreen();
        handleUserActivity();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const scheduleAutoHide = () => {
    clearHideTimer();
    if (!isPlaying) return;
    hideTimerRef.current = setTimeout(() => {
      setShowChrome(false);
    }, 3000);
  };

  const handleUserActivity = () => {
    if (!showChrome) setShowChrome(true);
    scheduleAutoHide();
  };

  useEffect(() => {
    if (isPlaying) {
      scheduleAutoHide();
    } else {
      clearHideTimer();
      setShowChrome(true);
    }
    return () => clearHideTimer();
  }, [isPlaying]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("player-chrome-visibility", { detail: { visible: showChrome } }));
    return () => {
      window.dispatchEvent(new CustomEvent("player-chrome-visibility", { detail: { visible: true } }));
    };
  }, [showChrome]);

  return (
    <div
      ref={containerRef}
      className={`relative h-[100dvh] w-full overflow-hidden bg-black ${
        isPlaying && !showChrome ? "cursor-none" : "cursor-default"
      }`}
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
      onClick={handleUserActivity}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        onClick={() => {
          togglePlay();
          handleUserActivity();
        }}
      >
        {subtitles.map((s) => (
          <track key={s.url} label={s.label} kind="subtitles" srcLang={s.language} src={s.url} />
        ))}
      </video>
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.57) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/55" />
      {streamError ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
          <div className="max-w-md rounded-2xl border border-red-400/30 bg-black/75 p-5 text-center shadow-2xl backdrop-blur-md">
            <p className="text-sm font-semibold text-red-200">Stream unavailable</p>
            <p className="mt-2 text-sm text-zinc-200">{streamError}</p>
            <button
              type="button"
              onClick={() => {
                const video = videoRef.current;
                setStreamError(null);
                setIsBuffering(true);
                video?.load();
              }}
              className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Retry
            </button>
          </div>
        </div>
      ) : isBuffering && !hasStreamReady ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-sm">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <span className="text-sm text-zinc-100">Loading stream</span>
          </div>
        </div>
      ) : null}

      <div
        className={`absolute left-4 bottom-28 z-20 max-w-xl md:left-8 md:bottom-36 transition-opacity duration-300 ${
          showChrome ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <p className="text-zinc-300 text-xs tracking-[0.2em] uppercase">Now Playing</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-display tracking-wide text-white">{movieTitle}</h1>
        {description ? <p className="mt-2 text-sm md:text-base text-zinc-200/90 line-clamp-2">{description}</p> : null}
      </div>

      <div
        className={`absolute inset-x-4 bottom-4 z-20 rounded-xl bg-black/45 p-3 backdrop-blur-sm md:inset-x-8 md:p-4 transition-opacity duration-300 ${
          showChrome ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <input
          id="player-progress"
          name="progress"
          type="range"
          min={0}
          max={Math.max(duration, 0)}
          step={0.1}
          value={Math.min(currentTime, duration || currentTime)}
          onChange={(e) => onProgressChange(Number(e.target.value))}
          className="w-full accent-secondary"
        />
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={togglePlay}
              className="rounded-full bg-white p-2.5 text-black"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M8 6v12l10-6-10-6z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => seekBy(-10)}
              className="rounded-full border border-white/30 px-3 py-2 text-xs md:text-sm inline-flex items-center gap-1.5"
            >
              <span className="sr-only">Back 10 seconds</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M9 8L5 11.5L9 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 12a7 7 0 1 1-2.1-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span aria-hidden="true">10</span>
            </button>
            <button
              onClick={() => seekBy(10)}
              className="rounded-full border border-white/30 px-3 py-2 text-xs md:text-sm inline-flex items-center gap-1.5"
            >
              <span className="sr-only">Forward 10 seconds</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M15 8L19 11.5L15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12a7 7 0 1 0 2.1-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span aria-hidden="true">10</span>
            </button>
            <button onClick={toggleMute} className="rounded-full border border-white/30 px-3 py-2 text-xs md:text-sm">
              <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
              {isMuted ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M14 8L10.5 11H7v2h3.5L14 16V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 10L21 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M21 10L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M14 8L10.5 11H7v2h3.5L14 16V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 10.5C17.8 11.3 17.8 12.7 17 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M19 9C20.8 10.8 20.8 13.2 19 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
            <input
              id="player-volume"
              name="volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeInput(Number(e.target.value))}
              className="hidden md:block w-24 accent-white"
              aria-label="Volume"
            />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-xs md:text-sm text-zinc-200">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <button
              onClick={toggleFullscreen}
              className="rounded-full border border-white/30 p-2"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 3H3V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 21H3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 21H21V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M8 3H3V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 3H21V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 21H3V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 21H21V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
