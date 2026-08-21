import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import video1 from '@/assets/st_01.mp4';
import video2 from '@/assets/videoSnowTrek.mp4';
import video3 from '@/assets/short.mp4';

const VIDEOS = [video1, video2, video3];
const SLIDE_INTERVAL = 9000;

export default function HeroSection({ regionData }) {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef([]);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % VIDEOS.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // Sync video playback when active slide changes
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === current) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [current]);

  const c = regionData ?? {
    headline: 'Your next snow adventure starts here',
    subheadline: "The world's best ski destinations, at your fingertips.",
    destinations: ['Bariloche', 'Chamonix', 'Aspen'],
    cta: { free: 'Get started free', business: 'Register my business', advertise: 'Advertise' },
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Video layers — crossfade */}
      {VIDEOS.map((src, i) => (
        <video
          key={src}
          ref={(el) => (videoRefs.current[i] = el)}
          src={src}
          autoPlay={i === 0}
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/75 pointer-events-none" />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 gap-5 pt-[60px]">
        <h1 className="text-4xl md:text-6xl font-black max-w-3xl leading-tight drop-shadow-xl">
          {c.headline}
        </h1>
        <p className="text-lg md:text-xl max-w-xl font-medium text-white/85 drop-shadow">
          {c.subheadline}
        </p>

        {/* Destination pills */}
        <div className="flex gap-2 flex-wrap justify-center">
          {c.destinations.map((dest) => (
            <span
              key={dest}
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-4 py-1 rounded-full text-sm font-semibold"
            >
              {dest}
            </span>
          ))}
        </div>

        {/* 3 profile CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link to="/join" className="button text-base px-7 py-3">
            {c.cta.free}
          </Link>
          <Link
            to="/stores/register"
            className="border-2 border-white text-white px-7 py-3 rounded font-semibold hover:bg-white hover:text-black transition-all duration-200 flex items-center justify-center"
          >
            {c.cta.business}
          </Link>
          <Link
            to="/contact"
            className="border-2 border-[var(--color-500)] text-[var(--color-500)] px-7 py-3 rounded font-semibold hover:bg-[var(--color-500)] hover:text-white transition-all duration-200 flex items-center justify-center"
          >
            {c.cta.advertise}
          </Link>
        </div>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-1">
          {VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-[var(--color-500)]'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
