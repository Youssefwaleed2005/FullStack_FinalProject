import type { CSSProperties } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Chips that fit along the arc without touching (fewer on phones, where the arch is smaller)
const MAX_SKILLS = 5;
const MAX_SKILLS_MOBILE = 4;

// "SQL, Python, Power BI" → ["SQL", "Python", "Power BI"]
function parseSkills(skills: string | null): string[] {
  return (skills ?? "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

// Evenly spread angles in degrees, left → right (180° is the far left of the arch)
function arcAngles(count: number, from: number, to: number): number[] {
  if (count === 1) return [90];
  return Array.from({ length: count }, (_, i) => from - (i * (from - to)) / (count - 1));
}

// A point on a circle at 72% of the arch's radius. The box below is twice as wide as it is tall,
// so its width is the arch's diameter and its height the radius: x is a % of the width, y of the height.
function arcPoint(degrees: number) {
  const radians = (degrees * Math.PI) / 180;
  return { x: 50 + 36 * Math.cos(radians), y: 100 - 72 * Math.sin(radians) };
}

type SkillArcProps = {
  // The active career path's recommendedSkills, comma separated
  skills: string | null;
};

// The skills you gain on the active career path, laid out along the top curve of the hero's arch
function SkillArc({ skills }: SkillArcProps) {
  const all = parseSkills(skills);
  if (all.length === 0) return null;

  const shown = all.slice(0, MAX_SKILLS);
  const mobileCount = Math.min(shown.length, MAX_SKILLS_MOBILE);
  const angles = arcAngles(shown.length, 154, 26);
  const mobileAngles = arcAngles(mobileCount, 150, 30);

  return (
    // Same width as the arch's rounded top (14rem radius), centred, so the circle matches the curve
    <div className="pointer-events-none absolute top-0 left-1/2 aspect-2/1 w-full max-w-md -translate-x-1/2">
      <p className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 animate-word text-[0.65rem] font-semibold tracking-[0.18em] whitespace-nowrap text-sand uppercase">
        Skills you&apos;ll gain
      </p>
      <ul aria-label="Skills you'll gain">
        {shown.map((skill, index) => {
          const desktop = arcPoint(angles[index]);
          const onMobile = index < mobileCount;
          const mobile = onMobile ? arcPoint(mobileAngles[index]) : desktop;
          const position = {
            "--x": `${mobile.x}%`,
            "--y": `${mobile.y}%`,
            "--x-sm": `${desktop.x}%`,
            "--y-sm": `${desktop.y}%`,
            animationDelay: `${index * 70}ms`,
          } as CSSProperties;

          return (
            <li
              key={skill}
              style={position}
              className={cn(
                "absolute top-(--y) left-(--x) -translate-x-1/2 -translate-y-1/2 animate-word sm:top-(--y-sm) sm:left-(--x-sm)",
                !onMobile && "hidden sm:block",
              )}
            >
              <span className="flex items-center gap-1 rounded-full border border-sand/50 bg-card/95 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-foreground shadow-md shadow-primary/20 backdrop-blur">
                <Check aria-hidden className="size-3 text-sand-deep" strokeWidth={3} />
                {skill}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SkillArc;
