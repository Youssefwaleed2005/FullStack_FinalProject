import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { resolveMaterialUrl } from "@/lib/materialLinks";
import { PARTNER_TYPES, partnerTypeOf } from "@/lib/partners";
import { cn } from "@/lib/utils";
import type { Partner } from "@/types/Partner";

// "Cisco Systems" → "CS", "IBM" → "IB"
function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  const letters = words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2);
  return letters.toUpperCase();
}

type PartnerLogoProps = {
  partner: Partner;
  // false for the marquee's repeated copies: still clickable, but skipped by Tab
  focusable?: boolean;
};

// A partner's tile: type badge, logo (or an initials icon when there is none / it fails to load),
// and a link to their website when they have one
function PartnerLogo({ partner, focusable = true }: PartnerLogoProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const type = PARTNER_TYPES[partnerTypeOf(partner)];

  const tile =
    "group/tile relative flex h-24 flex-col items-center justify-center rounded-2xl border border-border/80 bg-card px-6 pt-5 text-muted-foreground transition duration-300 hover:-translate-y-1 hover:border-sand hover:shadow-lg hover:shadow-primary/10 motion-reduce:hover:translate-y-0 dark:border-transparent dark:bg-foreground/90 dark:text-background";

  const content = (
    <>
      <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] font-semibold text-secondary-foreground">
        <type.icon aria-hidden className="size-3" />
        {type.label}
      </span>

      {partner.logoUrl && !logoFailed ? (
        <img
          src={resolveMaterialUrl(partner.logoUrl)}
          alt={partner.name}
          loading="lazy"
          onError={() => setLogoFailed(true)}
          // Grey until hovered or focused, then the brand colours.
          // multiply drops a PNG's white background into the tile (it would show on the cream dark-mode tile)
          className="h-9 w-auto max-w-40 object-contain opacity-80 mix-blend-multiply grayscale transition duration-300 group-hover/tile:opacity-100 group-hover/tile:grayscale-0 group-focus-visible/tile:opacity-100 group-focus-visible/tile:grayscale-0"
        />
      ) : (
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-semibold text-primary-foreground transition-transform duration-300 group-hover/tile:scale-110"
          >
            {initials(partner.name)}
          </span>
          <span className="truncate font-heading text-base font-semibold">{partner.name}</span>
        </span>
      )}
    </>
  );

  if (!partner.websiteUrl) {
    return (
      <div className={tile} title={`${partner.name} · ${type.label}`}>
        {content}
      </div>
    );
  }

  return (
    <a
      href={partner.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={focusable ? undefined : -1}
      aria-label={`${partner.name}, ${type.label} (opens in a new tab)`}
      title={`Visit ${partner.name}`}
      className={cn(tile, "cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-ring/50")}
    >
      {content}
      {/* Shows on hover / focus: the tile leaves the site */}
      <ExternalLink
        aria-hidden
        className="absolute top-2.5 right-2.5 size-3.5 text-sand-deep opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100"
      />
    </a>
  );
}

export default PartnerLogo;
