import { useEffect, useRef } from "react";

/**
 * HexBackground — floating hexagons that follow the mouse cursor
 * with parallax depth. Larger hexes move more (closer layer).
 */

const HEX_COUNT = 20;
const TWO_PI = Math.PI * 2;

const COLORS = [
  "255,215,0",    // gold
  "167,139,250",  // purple
  "96,165,250",   // blue
  "52,211,153",   // green
  "255,215,0",    // gold (higher chance)
];

function hexPath(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function rand(a, b) { return a + Math.random() * (b - a); }

function makeHex(W, H) {
  const r = rand(16, 56);
  return {
    // base position (drifts over time)
    bx: rand(0, W),
    by: rand(0, H),
    // current rendered position (lerped toward target)
    cx: 0, cy: 0,
    r,
    vx:      rand(-0.08, 0.08),
    vy:      rand(-0.07, 0.07),
    rot:     rand(0, TWO_PI),
    vrot:    rand(-0.0012, 0.0012),
    alpha:   rand(0.05, 0.12),
    fadeDir: Math.random() > 0.5 ? 1 : -1,
    color:   COLORS[Math.floor(Math.random() * COLORS.length)],
    filled:  Math.random() > 0.5,
    // parallax strength: bigger hex = stronger movement = "closer"
    depth: r / 56,   // 0.28 – 1.0
  };
}

export default function HexBackground() {
  const canvasRef  = useRef(null);
  // raw mouse position in px
  const mouseRaw   = useRef({ x: 0, y: 0 });
  // smoothed mouse (lerped), starts at screen center
  const mouseSmooth = useRef({ x: 0, y: 0 });
  const hexes      = useRef([]);
  const raf        = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      // re-initialise hexes on resize
      hexes.current = Array.from({ length: HEX_COUNT }, () =>
        makeHex(canvas.width, canvas.height)
      );
      // init smoothed mouse to center
      if (!initialized.current) {
        mouseRaw.current    = { x: canvas.width / 2, y: canvas.height / 2 };
        mouseSmooth.current = { x: canvas.width / 2, y: canvas.height / 2 };
        initialized.current = true;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      mouseRaw.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      // Smooth the mouse with lerp (speed controls responsiveness)
      const lerpSpeed = 0.07;
      mouseSmooth.current.x += (mouseRaw.current.x - mouseSmooth.current.x) * lerpSpeed;
      mouseSmooth.current.y += (mouseRaw.current.y - mouseSmooth.current.y) * lerpSpeed;

      // Offset from center (-1 to +1)
      const mx = (mouseSmooth.current.x / W - 0.5) * 2;
      const my = (mouseSmooth.current.y / H - 0.5) * 2;

      ctx.clearRect(0, 0, W, H);

      hexes.current.forEach(h => {
        // Drift base position
        h.bx  += h.vx;
        h.by  += h.vy;
        h.rot += h.vrot;

        // Wrap edges
        if (h.bx < -70)  h.bx = W + 70;
        if (h.bx > W+70) h.bx = -70;
        if (h.by < -70)  h.by = H + 70;
        if (h.by > H+70) h.by = -70;

        // Fade oscillation
        h.alpha += h.fadeDir * 0.0003;
        if (h.alpha > 0.14)  { h.alpha = 0.14;  h.fadeDir = -1; }
        if (h.alpha < 0.025) { h.alpha = 0.025; h.fadeDir =  1; }

        // Parallax offset — larger hex moves more (max ±55px for biggest)
        const strength = h.depth * 55;
        const ox = mx * strength;
        const oy = my * strength;

        // Final draw position
        const dx = h.bx + ox;
        const dy = h.by + oy;

        ctx.save();
        ctx.translate(dx, dy);
        ctx.rotate(h.rot);
        hexPath(ctx, 0, 0, h.r);

        if (h.filled) {
          ctx.fillStyle   = `rgba(${h.color},${(h.alpha * 0.45).toFixed(3)})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(${h.color},${h.alpha.toFixed(3)})`;
          ctx.lineWidth   = 1;
          ctx.stroke();
        } else {
          ctx.strokeStyle = `rgba(${h.color},${h.alpha.toFixed(3)})`;
          ctx.lineWidth   = 1.2;
          ctx.stroke();
        }
        ctx.restore();
      });

      raf.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
}
