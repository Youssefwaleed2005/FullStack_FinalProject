// Tiny confetti burst on a temporary <canvas> — no extra package needed.
// Skipped completely when the user prefers reduced motion.

const COLORS = ["#e9b682", "#8a5a2b", "#422e1b", "#f6e6d3", "#c8955c", "#2f7d5b", "#4f7cac"];

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  round: boolean;
};

export function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function fireConfetti(size: "small" | "big" = "small") {
  if (typeof window === "undefined" || prefersReducedMotion()) return;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "70",
  });
  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  if (!context) {
    canvas.remove();
    return;
  }

  const ratio = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.scale(ratio, ratio);

  const big = size === "big";
  // Big = three cannons (left, right, middle); small = one puff from the bottom middle
  const origins = big
    ? [
        { x: 0.12, y: 0.75 },
        { x: 0.88, y: 0.75 },
        { x: 0.5, y: 0.4 },
      ]
    : [{ x: 0.5, y: 0.8 }];

  const pieces: Piece[] = Array.from({ length: big ? 220 : 70 }, (_, i) => {
    const origin = origins[i % origins.length];
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * (big ? 1.7 : 1.1);
    const speed = (big ? 10 : 7) + Math.random() * 6;
    return {
      x: origin.x * width,
      y: origin.y * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 6,
      color: COLORS[i % COLORS.length],
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      round: Math.random() < 0.4,
    };
  });

  const duration = big ? 3200 : 1800;
  const start = performance.now();

  function frame(now: number) {
    const elapsed = now - start;
    context!.clearRect(0, 0, width, height);

    for (const p of pieces) {
      p.vy += 0.25; // gravity
      p.vx *= 0.99; // air
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;

      context!.save();
      context!.globalAlpha = Math.max(0, 1 - elapsed / duration);
      context!.translate(p.x, p.y);
      context!.rotate(p.rotation);
      context!.fillStyle = p.color;
      if (p.round) {
        context!.beginPath();
        context!.arc(0, 0, p.size / 3, 0, Math.PI * 2);
        context!.fill();
      } else {
        context!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      context!.restore();
    }

    if (elapsed < duration) requestAnimationFrame(frame);
    else canvas.remove();
  }

  requestAnimationFrame(frame);
}
