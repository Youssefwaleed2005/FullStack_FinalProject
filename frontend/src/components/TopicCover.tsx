import { useId, type ReactNode } from "react";

// Illustrated cover for a course / program / career path without an uploaded image.
// The scene and colours are picked from keywords in its title (then its category),
// e.g. "SQL Server Essentials" → databases on blue, "UI/UX Design Basics" → phone mock-up on pink.

type Palette = { from: string; to: string; accent: string };

type Scene =
  | "database" | "python" | "dashboard" | "spreadsheet" | "analysis" | "neural"
  | "react" | "javascript" | "backend" | "web" | "git" | "design"
  | "marketing" | "business" | "learning";

const PALETTES: Record<Scene, Palette> = {
  database: { from: "#172554", to: "#2563eb", accent: "#93c5fd" },
  python: { from: "#1e3a5f", to: "#3776ab", accent: "#ffd43b" },
  dashboard: { from: "#78350f", to: "#d97706", accent: "#fde68a" },
  spreadsheet: { from: "#064e3b", to: "#059669", accent: "#a7f3d0" },
  analysis: { from: "#134e4a", to: "#0d9488", accent: "#99f6e4" },
  neural: { from: "#1e1b4b", to: "#6366f1", accent: "#c7d2fe" },
  react: { from: "#082f49", to: "#0284c7", accent: "#7dd3fc" },
  javascript: { from: "#3f2a06", to: "#ca8a04", accent: "#fef08a" },
  backend: { from: "#2e1065", to: "#7c3aed", accent: "#ddd6fe" },
  web: { from: "#7c2d12", to: "#ea580c", accent: "#fed7aa" },
  git: { from: "#4c0519", to: "#e11d48", accent: "#fecdd3" },
  design: { from: "#500724", to: "#db2777", accent: "#fbcfe8" },
  marketing: { from: "#7f1d1d", to: "#f97316", accent: "#fed7aa" },
  business: { from: "#2e1065", to: "#4f46e5", accent: "#c4b5fd" },
  learning: { from: "#3b2a1a", to: "#8a6338", accent: "#e8c39e" },
};

// First match wins, so specific words come before general ones
const RULES: [RegExp, Scene][] = [
  [/power ?bi|tableau|dashboard|report/i, "dashboard"],
  [/excel|spreadsheet/i, "spreadsheet"],
  [/machine learning|\bml\b|\bai\b|deep learning|neural/i, "neural"],
  [/sql|database|postgres|mysql|mongo/i, "database"],
  [/python/i, "python"],
  [/analy|data|statistic|pandas/i, "analysis"],
  [/react|vue|angular|front ?end|frontend/i, "react"],
  [/typescript|javascript|\bjs\b/i, "javascript"],
  [/asp\.?net|\.net|c#|api|back ?end|backend|server/i, "backend"],
  [/git\b|github|devops/i, "git"],
  [/design|ui\b|ux|figma|graphic/i, "design"],
  [/market|seo|social|brand/i, "marketing"],
  [/business|manage|project|leader|entrepreneur/i, "business"],
  [/web|html|css|full[- ]?stack|develop|program|code|software/i, "web"],
];

function sceneFor(title: string, hint?: string): Scene {
  for (const text of [title, hint ?? ""]) {
    const match = RULES.find(([pattern]) => pattern.test(text));
    if (match) return match[1];
  }
  return "learning";
}

// Shared drawing helpers (white shapes on the coloured background)
const W = "#ffffff";

function Window({ x, y, w, h, children, title = true }: { x: number; y: number; w: number; h: number; children?: ReactNode; title?: boolean }) {
  return (
    <g>
      <rect x={x + 4} y={y + 6} width={w} height={h} rx={10} fill="#000" opacity={0.18} />
      <rect x={x} y={y} width={w} height={h} rx={10} fill={W} opacity={0.96} />
      {title && (
        <>
          <rect x={x} y={y} width={w} height={18} rx={10} fill="#0f172a" opacity={0.08} />
          <circle cx={x + 11} cy={y + 9} r={3} fill="#f87171" />
          <circle cx={x + 21} cy={y + 9} r={3} fill="#fbbf24" />
          <circle cx={x + 31} cy={y + 9} r={3} fill="#34d399" />
        </>
      )}
      {children}
    </g>
  );
}

function SceneArt({ scene, p }: { scene: Scene; p: Palette }) {
  switch (scene) {
    case "database":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(70 ${58 + i * 34})`}>
              <rect x={0} y={0} width={70} height={30} fill={W} opacity={0.92} />
              <ellipse cx={35} cy={30} rx={35} ry={10} fill={W} opacity={0.92} />
              <ellipse cx={35} cy={0} rx={35} ry={10} fill={i === 0 ? p.accent : W} />
              <ellipse cx={35} cy={0} rx={35} ry={10} fill="none" stroke={p.from} strokeOpacity={0.25} />
              <circle cx={58} cy={18} r={3} fill={p.to} />
            </g>
          ))}
          <Window x={168} y={56} w={104} h={96}>
            {[0, 1, 2, 3].map((r) => (
              <g key={r}>
                {[0, 1, 2].map((c) => (
                  <rect key={c} x={176 + c * 31} y={84 + r * 15} width={26} height={9} rx={2} fill={r === 0 ? p.to : p.from} opacity={r === 0 ? 0.85 : 0.18} />
                ))}
              </g>
            ))}
          </Window>
          <path d="M140 92 C 152 92, 152 104, 166 104" stroke={p.accent} strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      );
    case "python":
      return (
        <g>
          <Window x={62} y={46} w={150} h={108}>
            <rect x={62} y={64} width={150} height={90} fill="#0f172a" opacity={0.92} />
            <text x={72} y={84} fontFamily="monospace" fontSize={11} fill={p.accent}>&gt;&gt;&gt;</text>
            {[[96, 70], [80, 54], [80, 82], [96, 46], [80, 64]].map(([x, w], i) => (
              <rect key={i} x={i === 0 ? x : x} y={78 + i * 14 - (i === 0 ? 2 : 0)} width={w} height={6} rx={3} fill={i % 2 ? "#60a5fa" : W} opacity={i === 0 ? 0.9 : 0.55} />
            ))}
          </Window>
          <g transform="translate(222 70)">
            <rect x={0} y={0} width={44} height={44} rx={10} fill={p.accent} />
            <rect x={0} y={0} width={22} height={22} rx={10} fill="#3776ab" />
            <circle cx={12} cy={11} r={3} fill={W} />
            <circle cx={32} cy={33} r={3} fill="#3776ab" />
          </g>
          {[18, 30, 24, 38].map((h, i) => (
            <rect key={i} x={222 + i * 12} y={150 - h} width={8} height={h} rx={2} fill={W} opacity={0.85} />
          ))}
        </g>
      );
    case "dashboard":
      return (
        <Window x={58} y={40} w={204} h={124}>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={68 + i * 64} y={66} width={56} height={26} rx={5} fill={p.from} opacity={0.1} />
              <rect x={74 + i * 64} y={72} width={24} height={5} rx={2.5} fill={p.from} opacity={0.4} />
              <rect x={74 + i * 64} y={81} width={36} height={6} rx={3} fill={p.to} />
            </g>
          ))}
          {[30, 46, 24, 54, 38, 60].map((h, i) => (
            <rect key={i} x={72 + i * 15} y={156 - h} width={10} height={h} rx={2} fill={i === 5 ? p.to : p.from} opacity={i === 5 ? 1 : 0.35} />
          ))}
          <circle cx={222} cy={128} r={22} fill="none" stroke={p.from} strokeOpacity={0.15} strokeWidth={10} />
          <circle cx={222} cy={128} r={22} fill="none" stroke={p.to} strokeWidth={10} strokeDasharray="90 140" transform="rotate(-90 222 128)" />
        </Window>
      );
    case "spreadsheet":
      return (
        <g>
          <Window x={60} y={42} w={200} h={120}>
            {Array.from({ length: 6 }, (_, r) =>
              Array.from({ length: 5 }, (_, c) => (
                <rect key={`${r}-${c}`} x={68 + c * 38} y={64 + r * 15} width={34} height={11} rx={2}
                  fill={r === 0 ? p.to : (r === 3 && c === 2) || (r === 4 && c === 3) ? p.accent : p.from}
                  opacity={r === 0 ? 0.9 : (r === 3 && c === 2) || (r === 4 && c === 3) ? 1 : 0.12} />
              )),
            )}
          </Window>
          <g transform="translate(232 128)">
            <circle r={18} fill={p.accent} />
            <text x={0} y={6} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={18} fill={p.from}>Σ</text>
          </g>
        </g>
      );
    case "analysis":
      return (
        <g>
          <Window x={58} y={44} w={180} h={116}>
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={70} x2={226} y1={78 + i * 20} y2={78 + i * 20} stroke={p.from} strokeOpacity={0.1} />
            ))}
            <path d="M70 140 L100 122 L128 130 L158 98 L188 106 L222 74 L222 148 L70 148 Z" fill={p.to} opacity={0.18} />
            <path d="M70 140 L100 122 L128 130 L158 98 L188 106 L222 74" stroke={p.to} strokeWidth={3} fill="none" strokeLinejoin="round" />
            {[[100, 122], [158, 98], [222, 74]].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r={4} fill={W} stroke={p.to} strokeWidth={2.5} />
            ))}
          </Window>
          <g transform="translate(236 120)">
            <circle r={20} fill={p.accent} opacity={0.35} stroke={W} strokeWidth={5} />
            <line x1={14} y1={14} x2={30} y2={30} stroke={W} strokeWidth={7} strokeLinecap="round" />
          </g>
        </g>
      );
    case "neural": {
      const layers = [[60, 100, 140], [50, 83, 117, 150], [80, 120]];
      const xs = [100, 160, 220];
      return (
        <g>
          {layers.slice(0, -1).map((layer, l) =>
            layer.map((y1) => layers[l + 1].map((y2) => (
              <line key={`${l}-${y1}-${y2}`} x1={xs[l]} y1={y1} x2={xs[l + 1]} y2={y2} stroke={W} strokeOpacity={0.35} strokeWidth={1.5} />
            ))),
          )}
          {layers.map((layer, l) => layer.map((y) => (
            <circle key={`${l}-${y}`} cx={xs[l]} cy={y} r={l === 1 ? 9 : 11} fill={l === 2 ? p.accent : W} stroke={p.accent} strokeWidth={2} />
          )))}
        </g>
      );
    }
    case "react":
      return (
        <g>
          <Window x={50} y={46} w={150} h={110}>
            <rect x={60} y={72} width={44} height={74} rx={6} fill={p.from} opacity={0.12} />
            <rect x={110} y={72} width={80} height={34} rx={6} fill={p.to} opacity={0.85} />
            <rect x={110} y={112} width={38} height={34} rx={6} fill={p.from} opacity={0.18} />
            <rect x={152} y={112} width={38} height={34} rx={6} fill={p.accent} />
          </Window>
          <g transform="translate(236 100)" fill="none" stroke={p.accent} strokeWidth={3.5}>
            <ellipse rx={36} ry={13} />
            <ellipse rx={36} ry={13} transform="rotate(60)" />
            <ellipse rx={36} ry={13} transform="rotate(120)" />
            <circle r={6} fill={p.accent} stroke="none" />
          </g>
        </g>
      );
    case "javascript":
      return (
        <g>
          <text x={74} y={142} fontFamily="Georgia, serif" fontSize={110} fill={W} opacity={0.9}>{"{"}</text>
          <text x={204} y={142} fontFamily="Georgia, serif" fontSize={110} fill={W} opacity={0.9}>{"}"}</text>
          {[[118, 70], [118, 50], [130, 58], [118, 36]].map(([x, w], i) => (
            <rect key={i} x={x} y={74 + i * 16} width={w} height={8} rx={4} fill={i === 0 ? p.accent : W} opacity={i === 0 ? 1 : 0.7} />
          ))}
        </g>
      );
    case "backend":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(62 ${50 + i * 36})`}>
              <rect width={96} height={28} rx={6} fill={W} opacity={0.94} />
              <circle cx={14} cy={14} r={4} fill={i === 1 ? "#34d399" : p.to} />
              <rect x={26} y={11} width={40} height={6} rx={3} fill={p.from} opacity={0.25} />
              <rect x={74} y={9} width={12} height={10} rx={2} fill={p.from} opacity={0.15} />
            </g>
          ))}
          <path d="M164 100 H190" stroke={p.accent} strokeWidth={3} strokeLinecap="round" strokeDasharray="5 6" />
          <path d="M184 94 L192 100 L184 106" stroke={p.accent} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Window x={196} y={56} w={76} h={90} title={false}>
            <text x={204} y={80} fontFamily="monospace" fontSize={16} fontWeight={700} fill={p.to}>{"{ }"}</text>
            {[44, 56, 36, 50].map((w, i) => (
              <rect key={i} x={208} y={90 + i * 12} width={w} height={6} rx={3} fill={i % 2 ? p.from : p.to} opacity={i % 2 ? 0.25 : 0.7} />
            ))}
          </Window>
        </g>
      );
    case "git":
      return (
        <g stroke={W} strokeWidth={4} fill="none" strokeLinecap="round">
          <path d="M80 100 H250" opacity={0.9} />
          <path d="M120 100 C 140 100, 140 62, 165 62 H200 C 222 62, 222 100, 240 100" stroke={p.accent} />
          {[80, 120, 160, 200, 250].map((x) => (
            <circle key={x} cx={x} cy={100} r={9} fill={W} stroke={p.to} />
          ))}
          {[165, 200].map((x) => (
            <circle key={x} cx={x} cy={62} r={9} fill={p.accent} stroke={p.to} />
          ))}
          <path d="M120 100 C 140 100, 140 138, 165 138 H185" stroke={W} opacity={0.6} />
          <circle cx={185} cy={138} r={9} fill={W} stroke={p.to} opacity={0.9} />
        </g>
      );
    case "design":
      return (
        <g>
          <g transform="translate(92 36)">
            <rect x={4} y={6} width={76} height={132} rx={14} fill="#000" opacity={0.18} />
            <rect width={76} height={132} rx={14} fill={W} />
            <rect x={8} y={14} width={60} height={34} rx={6} fill={p.to} opacity={0.85} />
            <rect x={8} y={54} width={40} height={6} rx={3} fill={p.from} opacity={0.35} />
            <rect x={8} y={66} width={56} height={6} rx={3} fill={p.from} opacity={0.18} />
            <rect x={8} y={84} width={27} height={27} rx={5} fill={p.accent} />
            <rect x={41} y={84} width={27} height={27} rx={5} fill={p.from} opacity={0.15} />
            <rect x={20} y={118} width={36} height={8} rx={4} fill={p.to} />
          </g>
          {[p.accent, "#fde68a", "#a7f3d0", "#bfdbfe"].map((c, i) => (
            <circle key={c} cx={210 + (i % 2) * 30} cy={70 + Math.floor(i / 2) * 30} r={12} fill={c} stroke={W} strokeWidth={3} />
          ))}
          <path d="M196 128 L226 150 L212 152 L220 166 L213 169 L205 155 L196 164 Z" fill={W} stroke={p.from} strokeWidth={1.5} strokeLinejoin="round" />
        </g>
      );
    case "marketing":
      return (
        <g>
          <path d="M80 92 L150 62 L150 138 L80 108 Z" fill={W} opacity={0.95} />
          <rect x={64} y={90} width={20} height={20} rx={4} fill={p.accent} />
          <path d="M92 110 L100 136 H112 L106 112" fill={W} opacity={0.8} />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${162 + i * 12} ${84 - i * 6} q ${10 + i * 4} ${16 + i * 6} 0 ${32 + i * 12}`} stroke={p.accent} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          ))}
          {[20, 34, 48].map((h, i) => (
            <rect key={i} x={216 + i * 16} y={150 - h} width={11} height={h} rx={2} fill={W} opacity={0.85} />
          ))}
          <path d="M214 104 L240 88 L262 76" stroke={p.accent} strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      );
    case "business":
      return (
        <Window x={56} y={42} w={208} h={120}>
          {[0, 1, 2].map((c) => (
            <g key={c}>
              <rect x={66 + c * 64} y={66} width={58} height={88} rx={6} fill={p.from} opacity={0.08} />
              <rect x={72 + c * 64} y={72} width={30} height={5} rx={2.5} fill={p.from} opacity={0.4} />
              {Array.from({ length: 3 - c }, (_, r) => (
                <rect key={r} x={72 + c * 64} y={84 + r * 22} width={46} height={16} rx={4} fill={c === 2 ? p.accent : W} stroke={p.from} strokeOpacity={0.15} />
              ))}
            </g>
          ))}
          <circle cx={240} cy={142} r={11} fill="#34d399" />
          <path d="M235 142 l4 4 l7 -8" stroke={W} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </Window>
      );
    case "web":
      return (
        <Window x={60} y={42} w={200} h={120}>
          <rect x={100} y={24 + 22} width={120} height={10} rx={5} fill={p.from} opacity={0.1} />
          <text x={160} y={126} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={44} fill={p.to}>&lt;/&gt;</text>
          <rect x={92} y={136} width={56} height={6} rx={3} fill={p.from} opacity={0.2} />
          <rect x={154} y={136} width={74} height={6} rx={3} fill={p.accent} />
        </Window>
      );
    default:
      return (
        <g>
          <path d="M160 70 C 130 56, 96 58, 76 66 V146 C 96 138, 130 136, 160 150 Z" fill={W} opacity={0.95} />
          <path d="M160 70 C 190 56, 224 58, 244 66 V146 C 224 138, 190 136, 160 150 Z" fill={W} opacity={0.85} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={92} y={84 + i * 13} width={52} height={5} rx={2.5} fill={p.from} opacity={0.2} />
              <rect x={176} y={84 + i * 13} width={52} height={5} rx={2.5} fill={p.from} opacity={0.2} />
            </g>
          ))}
          <path d="M226 40 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" fill={p.accent} />
        </g>
      );
  }
}

type TopicCoverProps = {
  title: string;
  // e.g. the category name, used when the title alone doesn't say much
  hint?: string;
  className?: string;
};

function TopicCover({ title, hint, className }: TopicCoverProps) {
  const id = useId().replace(/:/g, "");
  const scene = sceneFor(title, hint);
  const p = PALETTES[scene];

  return (
    <svg
      aria-hidden
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
    >
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.from} />
          <stop offset="1" stopColor={p.to} />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="0.8" cy="0.15" r="0.6">
          <stop offset="0" stopColor={p.accent} stopOpacity={0.45} />
          <stop offset="1" stopColor={p.accent} stopOpacity={0} />
        </radialGradient>
        {/* The academy's 8-point star, tiled faintly in the background */}
        <pattern id={`star-${id}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <g transform="translate(20 20)" fill="none" stroke="#ffffff" strokeOpacity={0.09} strokeWidth={1}>
            <rect x={-7} y={-7} width={14} height={14} />
            <rect x={-7} y={-7} width={14} height={14} transform="rotate(45)" />
          </g>
        </pattern>
      </defs>
      <rect width="320" height="200" fill={`url(#bg-${id})`} />
      <rect width="320" height="200" fill={`url(#star-${id})`} />
      <rect width="320" height="200" fill={`url(#glow-${id})`} />
      <circle cx={24} cy={182} r={60} fill="#ffffff" opacity={0.05} />
      <SceneArt scene={scene} p={p} />
    </svg>
  );
}

export default TopicCover;
