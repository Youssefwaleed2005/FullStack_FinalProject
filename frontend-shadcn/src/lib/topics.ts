import {
  Atom,
  Braces,
  BrainCircuit,
  ChartColumn,
  ChartLine,
  Cloud,
  CodeXml,
  Database,
  GitBranch,
  Megaphone,
  Palette,
  Server,
  ShieldCheck,
  Sheet,
  Smartphone,
  Sparkles,
  SquareTerminal,
  Table2,
  Workflow,
  type LucideIcon,
} from "lucide-react";

// An icon and a colour for a skill or course, picked from keywords in its name.
// "soft" = light tinted badge, "solid" = filled circle (both readable in light and dark mode).
export type Topic = { icon: LucideIcon; soft: string; solid: string };

const tone = (soft: string, solid: string) => ({ soft, solid });

const SKY = tone("bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300", "bg-sky-500 text-white");
const BLUE = tone("bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", "bg-blue-600 text-white");
const YELLOW = tone("bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300", "bg-yellow-500 text-yellow-950");
const VIOLET = tone("bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300", "bg-violet-600 text-white");
const AMBER = tone("bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300", "bg-amber-500 text-amber-950");
const EMERALD = tone("bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", "bg-emerald-600 text-white");
const ROSE = tone("bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300", "bg-rose-600 text-white");
const ORANGE = tone("bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300", "bg-orange-500 text-white");
const TEAL = tone("bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300", "bg-teal-600 text-white");
const INDIGO = tone("bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300", "bg-indigo-600 text-white");
const SAND = tone("bg-sand/20 text-sand-deep", "bg-sand text-primary");

// First match wins, so more specific words come first
const RULES: [RegExp, LucideIcon, { soft: string; solid: string }][] = [
  [/power ?bi|tableau|dashboard/i, ChartColumn, AMBER],
  [/excel|spreadsheet|sheets/i, Sheet, EMERALD],
  [/pandas|numpy|dataframe/i, Table2, VIOLET],
  [/sql|database|postgres|mysql|mongo/i, Database, BLUE],
  [/python/i, SquareTerminal, YELLOW],
  [/machine learning|\bml\b|\bai\b|deep learning|statistic/i, BrainCircuit, INDIGO],
  [/analy|data/i, ChartLine, TEAL],
  [/react|vue|angular|front/i, Atom, SKY],
  [/typescript|javascript|\bjs\b|\bts\b/i, Braces, YELLOW],
  [/asp\.?net|\.net|c#|csharp|api|back/i, Server, VIOLET],
  [/html|css|tailwind|web/i, CodeXml, ORANGE],
  [/git|github/i, GitBranch, ROSE],
  [/docker|devops|ci\/cd|pipeline/i, Workflow, SKY],
  [/cloud|azure|aws/i, Cloud, BLUE],
  [/security|cyber/i, ShieldCheck, ROSE],
  [/mobile|android|ios|flutter/i, Smartphone, TEAL],
  [/design|ui|ux|figma/i, Palette, ROSE],
  [/market|seo|social/i, Megaphone, ORANGE],
];

export function topicFor(text: string): Topic {
  for (const [pattern, icon, colors] of RULES) {
    if (pattern.test(text)) return { icon, ...colors };
  }
  return { icon: Sparkles, ...SAND };
}
