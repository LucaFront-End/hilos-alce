import { useRef, useEffect } from 'react';

/*
 * PanelVideo — real industrial stock footage as panel background.
 *
 * Panel 'thin'  → Close-up of sewing machine stitching / fine thread in motion
 * Panel 'thick' → Macro shot of thick twisted rope / broad industrial cord
 *
 * Effect stack:
 *   1. <video> autoplay muted loop playsInline — full-panel cover
 *   2. CSS mix-blend + filter: grayscale → desaturate completely
 *   3. Tinted color overlay div (crimson | navy) at low opacity
 *   4. Vignette overlay (radial gradient to black)
 *   5. GSAP-readable data-attr so parent can animate brightness on expand
 *
 * On panel expand (parent passes `active` prop):
 *   - overlay opacity drops (video "reveals" more vivid)
 *   - slight CSS scale-up on the video (zoom-in feel)
 */

const SOURCES = {
  // Fine sewing machine — thin, precise thread in motion
  thin: [
    'https://videos.pexels.com/video-files/6660936/6660936-uhd_1440_2732_25fps.mp4',
    'https://videos.pexels.com/video-files/9850290/9850290-uhd_1440_2732_25fps.mp4',
  ],
  // Macro stretched rope / thick industrial cord
  thick: [
    'https://videos.pexels.com/video-files/5291373/5291373-hd_1920_1080_25fps.mp4',
    'https://videos.pexels.com/video-files/3752456/3752456-hd_1920_1080_24fps.mp4',
  ],
};

// Dark base tint per type
const TINTS = {
  thin:  'rgba(80, 8, 8, 0.72)',
  thick: 'rgba(4, 18, 50, 0.72)',
};

export function PanelVideo({ type = 'thin', active = false }) {
  const videoRef = useRef(null);

  // Resume playback if browser paused it (iOS / visibility change)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const play = () => v.paused && v.play().catch(() => {});
    v.addEventListener('canplay', play);
    play();
    return () => v.removeEventListener('canplay', play);
  }, []);

  const src = SOURCES[type][0];

  return (
    <div
      className={`pv-wrap ${active ? 'pv-wrap--active' : ''}`}
      aria-hidden="true"
    >
      {/* ── The actual video ── */}
      <video
        ref={videoRef}
        className="pv-video"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* ── Color tint overlay ── */}
      <div
        className="pv-tint"
        style={{ background: TINTS[type] }}
      />

      {/* ── Atmospheric vignette ── */}
      <div className="pv-vignette" />
    </div>
  );
}
