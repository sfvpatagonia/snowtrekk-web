import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

// Stable reference (not an inline object literal re-created every render) —
// ReactPlayer reinitializes the underlying player when `config`/`style`
// change identity, which previously dropped pause-on-hover silently (see
// 68f07b8). zIndex here (rather than a className, which ReactPlayer doesn't
// forward) keeps the main video above the backdrop without relying on DOM
// order.
const PLAYER_CONFIG = {
  file: {
    attributes: {
      style: { width: "100%", height: "100%", objectFit: "contain" },
    },
  },
};
const PLAYER_STYLE = { position: "absolute", top: 0, left: 0, zIndex: 10 };

const RATIO_MISMATCH_THRESHOLD = 0.05;
const DRIFT_CORRECTION_THRESHOLD = 0.3;

/**
 * Shared hero video frame for BannerVideos and MomentsCarousel: fixed-ratio
 * container (never sized by the video itself) + an optional blurred
 * backdrop for videos whose real ratio doesn't match the frame, synced to
 * the main video's native play/pause/seek events. The backdrop never
 * touches onEnded/onProgress — those stay wired to the main video only.
 */
export default function VideoFrame({
  src,
  usePlayer = false,
  playing,
  muted = true,
  loop = false,
  controls = false,
  onEnded,
  onProgress,
  onMouseEnter,
  onMouseLeave,
  className = "",
  children,
}) {
  const frameRef = useRef(null);
  const playerRef = useRef(null);
  const videoElRef = useRef(null);
  const backdropRef = useRef(null);
  const mainElRef = useRef(null);

  const [showBackdrop, setShowBackdrop] = useState(false);
  const [startedPlaying, setStartedPlaying] = useState(false);

  // New video — re-evaluate ratio/backdrop from scratch rather than
  // carrying over a decision made for the previous source.
  useEffect(() => {
    setShowBackdrop(false);
    setStartedPlaying(false);
  }, [src]);

  // Resolve the real underlying <video> DOM node for either mode and wire
  // ratio detection + backdrop sync directly to its native media events —
  // identical whether ReactPlayer or a plain <video> renders it.
  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const mdQuery = window.matchMedia?.("(min-width: 768px)");

    let cancelled = false;
    let detachFns = null;

    const attach = () => {
      const el = usePlayer
        ? playerRef.current?.getInternalPlayer?.()
        : videoElRef.current;
      if (!el || cancelled) return false;
      mainElRef.current = el;

      const checkRatio = () => {
        const frame = frameRef.current;
        if (!frame || !el.videoWidth || !el.videoHeight) return;
        const frameRatio = frame.clientWidth / frame.clientHeight;
        const videoRatio = el.videoWidth / el.videoHeight;
        const mismatch =
          Math.abs(videoRatio - frameRatio) / frameRatio > RATIO_MISMATCH_THRESHOLD;
        setShowBackdrop(mismatch && !prefersReducedMotion && Boolean(mdQuery?.matches));
      };
      const handlePlay = () => {
        setStartedPlaying(true);
        const backdrop = backdropRef.current;
        if (!backdrop) return;
        backdrop.currentTime = el.currentTime;
        backdrop.play().catch(() => {});
      };
      const handlePause = () => backdropRef.current?.pause();
      const handleSeeked = () => {
        if (backdropRef.current) backdropRef.current.currentTime = el.currentTime;
      };
      const handleTimeUpdate = () => {
        const backdrop = backdropRef.current;
        if (!backdrop) return;
        if (Math.abs(backdrop.currentTime - el.currentTime) > DRIFT_CORRECTION_THRESHOLD) {
          backdrop.currentTime = el.currentTime;
        }
      };

      el.addEventListener("loadedmetadata", checkRatio);
      el.addEventListener("play", handlePlay);
      el.addEventListener("pause", handlePause);
      el.addEventListener("seeked", handleSeeked);
      el.addEventListener("timeupdate", handleTimeUpdate);
      // Metadata may already be loaded (cached video) — loadedmetadata won't refire.
      if (el.readyState >= 1) checkRatio();

      detachFns = () => {
        el.removeEventListener("loadedmetadata", checkRatio);
        el.removeEventListener("play", handlePlay);
        el.removeEventListener("pause", handlePause);
        el.removeEventListener("seeked", handleSeeked);
        el.removeEventListener("timeupdate", handleTimeUpdate);
      };
      return true;
    };

    // ReactPlayer's internal player can be a tick behind on mount — retry
    // once on the next frame rather than polling indefinitely.
    if (!attach() && usePlayer) {
      const raf = requestAnimationFrame(attach);
      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
        detachFns?.();
      };
    }
    return () => {
      cancelled = true;
      detachFns?.();
    };
  }, [src, usePlayer]);

  // Backdrop can mount after the main video already started (ratio only
  // known once metadata loads) — align it immediately instead of waiting
  // for the next native event to correct it.
  useEffect(() => {
    if (!showBackdrop) return;
    const backdrop = backdropRef.current;
    const main = mainElRef.current;
    if (!backdrop || !main) return;
    backdrop.currentTime = main.currentTime;
    if (!main.paused) backdrop.play().catch(() => {});
  }, [showBackdrop]);

  return (
    <div
      ref={frameRef}
      className={`relative overflow-hidden w-full max-w-full bg-neutral-950 aspect-[4/5] md:aspect-video max-h-[70vh] ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showBackdrop && (
        <video
          ref={backdropRef}
          src={src}
          muted
          playsInline
          loop={loop}
          aria-hidden="true"
          tabIndex={-1}
          preload={startedPlaying ? "auto" : "metadata"}
          className="hidden md:block absolute inset-0 w-full h-full object-cover scale-110 blur-2xl brightness-50 z-0 pointer-events-none"
        />
      )}

      {usePlayer ? (
        <ReactPlayer
          ref={playerRef}
          url={src}
          playing={playing}
          muted={muted}
          loop={loop}
          controls={controls}
          onEnded={onEnded}
          onProgress={onProgress}
          width="100%"
          height="100%"
          style={PLAYER_STYLE}
          config={PLAYER_CONFIG}
        />
      ) : (
        <video
          ref={videoElRef}
          src={src}
          muted={muted}
          autoPlay
          loop={loop}
          playsInline
          controls={controls}
          onEnded={onEnded}
          className="absolute inset-0 w-full h-full object-contain z-10"
        />
      )}

      {/* pointer-events-none lets clicks reach the video's own native
          controls everywhere except where a child explicitly opts back in
          (pointer-events-auto) — e.g. the mute/next buttons callers pass in. */}
      <div className="absolute inset-0 z-20 pointer-events-none">{children}</div>
    </div>
  );
}
