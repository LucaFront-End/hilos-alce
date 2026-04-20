import { useEffect, useRef } from 'react';

/*
 * PanelCanvas — simulated "industrial fiber footage" per panel type.
 *
 * 'thin'  → many ultra-fine fibers, dense, precise  (crimson palette)
 * 'thick' → few bold strands, slow, powerful movement (deep-blue palette)
 *
 * Each fiber has:
 *  - sinusoidal perpendicular oscillation (like strings vibrating)
 *  - a travelling light particle (specular highlight)
 */

const CONFIGS = {
  thin: {
    bg:          '#0C0404',
    colors:      ['#7B1515', '#C0392B', '#E85C3A', '#8B1A1A', '#A93226'],
    particleClr: '#FF9982',
    count:       26,
    thickMin:    0.25,
    thickMax:    0.85,
    ampMin:      2,
    ampMax:      14,
    speedMin:    0.55,
    speedMax:    1.1,
    waveFreq:    7,     // oscillations across the width
    particleSpd: 0.0015,
    opMin:       0.22,
    opMax:       0.68,
  },
  thick: {
    bg:          '#030812',
    colors:      ['#0A2444', '#1A4A7A', '#2980B9', '#154360', '#1F618D'],
    particleClr: '#90CAF9',
    count:       11,
    thickMin:    1.8,
    thickMax:    5.0,
    ampMin:      4,
    ampMax:      22,
    speedMin:    0.18,
    speedMax:    0.45,
    waveFreq:    4,
    particleSpd: 0.0008,
    opMin:       0.28,
    opMax:       0.72,
  },
};

function rand(min, max) { return min + Math.random() * (max - min); }

class Fiber {
  constructor(y, cfg, W) {
    this.y         = y;
    this.cfg       = cfg;
    this.phase     = rand(0, Math.PI * 2);
    this.speed     = rand(cfg.speedMin, cfg.speedMax);
    this.amp       = rand(cfg.ampMin, cfg.ampMax);
    this.thickness = rand(cfg.thickMin, cfg.thickMax);
    this.opacity   = rand(cfg.opMin, cfg.opMax);
    this.color     = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
    // travelling highlight
    this.px        = rand(-0.1, 1.1);
    this.pspeed    = rand(cfg.particleSpd * 0.6, cfg.particleSpd * 1.4) *
                     (Math.random() > 0.5 ? 1 : -1);
    this.psize     = rand(1, this.thickness + 2);
  }

  update() {
    this.phase += this.speed * 0.008;
    this.px    += this.pspeed;
    if (this.px > 1.08) this.px = -0.08;
    if (this.px < -0.08) this.px = 1.08;
  }

  draw(ctx, W) {
    const { y, cfg }  = this;
    const step = Math.max(2, Math.round(W / 180));

    ctx.beginPath();
    ctx.moveTo(-OVER, y + this._wy(-OVER, W));
    for (let x = 0; x <= W + OVER; x += step) {
      ctx.lineTo(x, y + this._wy(x, W));
    }
    ctx.strokeStyle = this.color;
    ctx.lineWidth   = this.thickness;
    ctx.globalAlpha = this.opacity;
    ctx.shadowBlur  = 0;
    ctx.stroke();

    // Specular highlight particle
    if (this.px >= -0.05 && this.px <= 1.05) {
      const hx = this.px * W;
      const hy = y + this._wy(hx, W);
      const gr  = ctx.createRadialGradient(hx, hy, 0, hx, hy, this.psize * 3.5);
      gr.addColorStop(0,   cfg.particleClr);
      gr.addColorStop(0.5, cfg.particleClr + '55');
      gr.addColorStop(1,   'transparent');
      ctx.beginPath();
      ctx.arc(hx, hy, this.psize * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = gr;
      ctx.globalAlpha = 0.55 * this.opacity;
      ctx.shadowBlur  = this.psize * 4;
      ctx.shadowColor = cfg.particleClr;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
  }

  _wy(x, W) {
    const t = x / W;
    return Math.sin(t * this.cfg.waveFreq + this.phase) * this.amp;
  }
}

const OVER = 60; // px beyond canvas edges

export function PanelCanvas({ type = 'thin' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';

    const cfg = CONFIGS[type];
    let fibers = [];
    let W = 0, H = 0;
    let raf;

    const init = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      fibers = Array.from({ length: cfg.count }, (_, i) => {
        const jitter = (Math.random() - 0.5) * (H / cfg.count) * 0.4;
        const y      = ((i + 0.5) / cfg.count) * H + jitter;
        return new Fiber(y, cfg, W);
      });
    };

    const loop = () => {
      // Solid dark bg
      ctx.fillStyle = cfg.bg;
      ctx.fillRect(0, 0, W, H);

      fibers.forEach(f => { f.update(); f.draw(ctx, W); });

      // Atmospheric vignette overlay
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, Math.max(W, H) * 0.85);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.72)');
      ctx.fillStyle = vig;
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, W, H);

      // Bottom gradient to black (cinematic)
      const btm = ctx.createLinearGradient(0, H * 0.6, 0, H);
      btm.addColorStop(0, 'transparent');
      btm.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = btm;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(loop);
    };

    init();
    loop();

    const ro = new ResizeObserver(init);
    ro.observe(canvas);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: '100%',
               position: 'absolute', inset: 0 }}
    />
  );
}
