import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/*
 * ThreadCanvas v2
 * ─────────────────────────────────────────────────────────────────
 * • Anchor pins are placed OUTSIDE the canvas bounds so threads
 *   appear to emerge from behind both edges (no visible endpoints).
 * • Canvas covers the full hero background.
 * • GSAP staggers opacity 0→1 for a cinematic fade-in intro.
 * • Subtle sinusoidal "breathing" on each thread for a living texture.
 * • Mouse repulsion with spring-back physics via Verlet integration.
 */

// ── Palette ───────────────────────────────────────────────────────
const PALETTE = [
  '#E74C3C','#3498DB','#2ECC71','#F39C12','#9B59B6',
  '#1ABC9C','#E67E22','#C0392B','#2980B9','#27AE60',
  '#E91E63','#00BCD4','#F1C40F','#795548','#FF5722',
  '#C8922A','#8B4E3A','#1A2980','#145A32','#9C27B0',
  '#0D47A1','#BF360C','#558B2F','#0277BD','#880E4F',
  '#1565C0','#6D4C41','#2E7D32','#AD1457','#00838F',
];

// ── Config ────────────────────────────────────────────────────────
const THREAD_COUNT   = 18;   // Fewer — cleaner, like guitar strings
const BASE_NODES     = 24;   // Enough nodes for smooth deflection
const OVERSHOOT      = 260;  // px past each edge — pins far off-screen
const EDGE_FADE      = 120;  // px gradient fade at each side
const BG_COLOR       = '#F7F2EB';
const GRAVITY        = 0.003; // Near-zero — strings stay taut & horizontal
const DAMPING        = 0.972; // Low — oscillation after pluck (guitar vibe)
const CONSTRAINT_IT  = 18;   // High stiffness — strings resist stretching
const MOUSE_RADIUS   = 155;
const MOUSE_STRENGTH = 5.5;  // Base force; scales with mouse velocity

// ── Node ──────────────────────────────────────────────────────────
class Node {
  constructor(x, y, pinned = false) {
    this.x = x; this.y = y;
    this.px = x; this.py = y;
    this.pinned = pinned;
  }
}

// ── Create thread descriptor ────────────────────────────────────────────
function createThread(index, count) {
  const jitter = (Math.random() - 0.5) * (0.4 / count);
  const yFrac  = Math.max(0.02, Math.min(0.98, (index + 0.5) / count + jitter));
  return {
    id:             index,
    color:          PALETTE[index % PALETTE.length],
    yFrac,
    numNodes:       BASE_NODES,
    // Guitar strings — thin, crisp, no diagonal
    lineWidth:      0.3 + Math.random() * 0.55,
    baseOpacity:    0.28 + Math.random() * 0.38,
    currentOpacity: 0,
    isDiagonal:     false,  // All horizontal like strings on a fretboard
    diagOffset:     0,
    breathOffset:   Math.random() * Math.PI * 2,
    nodes:  [],
    sticks: [],
  };
}

// ── Init thread nodes (pins OUTSIDE canvas) ───────────────────────
function initThread(t, W, H) {
  t.nodes  = [];
  t.sticks = [];

  const n      = t.numNodes;
  const yStart = t.yFrac * H;
  const yEnd   = yStart + t.diagOffset * H; // diagonal variant

  // Pin at -OVERSHOOT on left, W+OVERSHOOT on right
  const xStart = -OVERSHOOT;
  const xEnd   = W + OVERSHOOT;

  for (let i = 0; i < n; i++) {
    const frac   = i / (n - 1);
    const x      = xStart + frac * (xEnd - xStart);
    const y      = yStart + frac * (yEnd - yStart);
    const pinned = i === 0 || i === n - 1;
    t.nodes.push(new Node(x, y, pinned));
  }
  for (let i = 0; i < n - 1; i++) {
    const a = t.nodes[i], b = t.nodes[i + 1];
    t.sticks.push({ a, b, len: Math.hypot(b.x - a.x, b.y - a.y) });
  }
}

// ── Physics update (receives dynamic mouse strength for pluck) ────────
function updateThread(t, H, mx, my, dynamicStrength) {
  for (const n of t.nodes) {
    if (n.pinned) continue;
    const vx = (n.x - n.px) * DAMPING;
    const vy = (n.y - n.py) * DAMPING;
    n.px = n.x; n.py = n.y;
    n.x += vx;
    n.y += vy + GRAVITY;

    // Mouse repulsion (scaled by dynamic strength = mouse velocity)
    const dx = n.x - mx, dy = n.y - my;
    const d2 = dx * dx + dy * dy;
    if (d2 < MOUSE_RADIUS * MOUSE_RADIUS && d2 > 1) {
      const d = Math.sqrt(d2);
      const f = ((MOUSE_RADIUS - d) / MOUSE_RADIUS) ** 2.2 * dynamicStrength;
      n.x += (dx / d) * f;
      n.y += (dy / d) * f;
    }
  }

  for (let iter = 0; iter < CONSTRAINT_IT; iter++) {
    for (const s of t.sticks) {
      const dx = s.b.x - s.a.x, dy = s.b.y - s.a.y;
      const d  = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const df = (d - s.len) / d * 0.5;
      const ox = dx * df, oy = dy * df;
      if (!s.a.pinned) { s.a.x += ox; s.a.y += oy; }
      if (!s.b.pinned) { s.b.x -= ox; s.b.y -= oy; }
    }
    for (const n of t.nodes) {
      if (n.pinned) continue;
      if (n.y > H - 1) { n.y = H - 1; n.py = H; }
      if (n.y < 1) n.y = 1;
    }
  }
}

// ── Draw thread ───────────────────────────────────────────────────
function drawThread(ctx, t, mx, my, time) {
  const nodes = t.nodes;
  if (nodes.length < 2 || t.currentOpacity < 0.005) return;

  // Closest visible node to mouse
  let minD = Infinity;
  for (const n of nodes) {
    if (n.x < -OVERSHOOT || n.x > ctx.canvas.width + OVERSHOOT) continue;
    const d = Math.hypot(n.x - mx, n.y - my);
    if (d < minD) minD = d;
  }
  const glow    = Math.max(0, 1 - minD / 250);
  const breath  = Math.sin(time * 0.0008 + t.breathOffset) * 0.04; // ±4% opacity pulse

  // Smooth bezier path — includes outside-canvas nodes, canvas clips them
  ctx.beginPath();
  ctx.moveTo(nodes[0].x, nodes[0].y);
  for (let i = 1; i < nodes.length - 1; i++) {
    const ex = (nodes[i].x + nodes[i + 1].x) * 0.5;
    const ey = (nodes[i].y + nodes[i + 1].y) * 0.5;
    ctx.quadraticCurveTo(nodes[i].x, nodes[i].y, ex, ey);
  }
  ctx.lineTo(nodes[nodes.length - 1].x, nodes[nodes.length - 1].y);

  ctx.lineWidth   = t.lineWidth + glow * 1.8;
  ctx.strokeStyle = t.color;
  ctx.globalAlpha = Math.min(1, t.currentOpacity * (t.baseOpacity + breath) + glow * 0.45);

  if (glow > 0.04) {
    ctx.shadowBlur  = glow * 24;
    ctx.shadowColor = t.color;
  } else {
    ctx.shadowBlur = 0;
  }

  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.shadowBlur  = 0;
}

// ── React component ───────────────────────────────────────────────
export function ThreadCanvas({ mousePosRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';

    let threads = [];
    let W = 0, H = 0;
    let raf;
    let gsapCtx;

    const init = (isResize = false) => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;

      gsapCtx && gsapCtx.revert();

      threads = Array.from(
        { length: THREAD_COUNT },
        (_, i) => createThread(i, THREAD_COUNT),
      );
      threads.forEach(t => initThread(t, W, H));

      // GSAP intro: threads fade in with stagger
      gsapCtx = gsap.context(() => {
        threads.forEach((t, i) => {
          gsap.to(t, {
            currentOpacity: 1,
            duration: 0.6 + Math.random() * 0.4,
            delay:    isResize ? 0 : (0.08 + i * 0.055),
            ease:     'power2.out',
          });
        });
      });
    };

    // Mouse velocity tracking for pluck effect
    let prevMx = -9999, prevMy = -9999;

    const loop = (time = 0) => {
      ctx.clearRect(0, 0, W, H);
      const mx = mousePosRef?.current?.x ?? -9999;
      const my = mousePosRef?.current?.y ?? -9999;

      // Mouse velocity = "pluck strength" (fast swipe = harder pluck)
      const dvx = mx - prevMx, dvy = my - prevMy;
      const vel = (mx > -9000 && prevMx > -9000)
        ? Math.sqrt(dvx * dvx + dvy * dvy)
        : 0;
      const dynamicStrength = MOUSE_STRENGTH + Math.min(vel * 0.18, 5);
      prevMx = mx; prevMy = my;

      for (const t of threads) {
        updateThread(t, H, mx, my, dynamicStrength);
        drawThread(ctx, t, mx, my, time);
      }

      // ── Edge dissolve: overlay background gradient so threads
      //    fade into the page edges rather than cutting hard ────
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      const lg = ctx.createLinearGradient(0, 0, EDGE_FADE, 0);
      lg.addColorStop(0,   BG_COLOR);
      lg.addColorStop(1,   'rgba(247,242,235,0)');
      ctx.fillStyle = lg;
      ctx.fillRect(0, 0, EDGE_FADE, H);

      const rg = ctx.createLinearGradient(W - EDGE_FADE, 0, W, 0);
      rg.addColorStop(0,   'rgba(247,242,235,0)');
      rg.addColorStop(1,   BG_COLOR);
      ctx.fillStyle = rg;
      ctx.fillRect(W - EDGE_FADE, 0, EDGE_FADE, H);

      raf = requestAnimationFrame(loop);
    };

    init(false);
    loop();

    const ro = new ResizeObserver(() => init(true));
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gsapCtx && gsapCtx.revert();
    };
  }, [mousePosRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
