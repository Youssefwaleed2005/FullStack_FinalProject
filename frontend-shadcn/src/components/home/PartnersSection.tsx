import PartnerLogo from "@/components/home/PartnerLogo";
import { useApiData } from "@/hooks/useApiData";
import { PARTNER_TYPES, partnerTypeOf } from "@/lib/partners";
import { cn } from "@/lib/utils";
import { getPartners } from "@/services/partnerService";
import type { PartnerType } from "@/types/Partner";

function loadPartners() {
  return getPartners();
}

function PartnersSection() {
  const { data } = useApiData(loadPartners);
  const partners = data ?? [];

  // Still loading, nothing to show, or the request failed: leave the section out of the page
  if (partners.length === 0) return null;

  // The list is repeated so the scrolling strip loops without a gap
  const strip = [...partners, ...partners];
  // Legend: only the types that are actually on the strip
  const types = (Object.keys(PARTNER_TYPES) as PartnerType[]).filter((type) =>
    partners.some((partner) => partnerTypeOf(partner) === type),
  );

  return (
    <section className="border-t border-border/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-center font-sans text-xs font-semibold tracking-[0.2em] text-sand-deep uppercase">
          Trusted by our partners
        </h2>
        {types.length > 1 && (
          <ul className="mt-3 flex justify-center gap-5 text-xs text-muted-foreground">
            {types.map((type) => {
              const { icon: Icon, plural } = PARTNER_TYPES[type];
              return (
                <li key={type} className="flex items-center gap-1.5">
                  <Icon aria-hidden className="size-3.5 text-sand-deep" />
                  {plural}
                </li>
              );
            })}
          </ul>
        )}

        {/* py-3 leaves room for the tiles' hover lift and shadow (the mask clips anything outside) */}
        <div className="group relative mt-6 overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <ul
            className={cn(
              "flex w-max animate-marquee gap-4 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center",
              // Stop while the pointer is over it, a tile has keyboard focus, or a finger is pressing it
              "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] group-active:[animation-play-state:paused]",
            )}
          >
            {strip.map((partner, index) => {
              const isCopy = index >= partners.length;
              return (
                <li
                  key={`${partner.id}-${index}`}
                  // The copies are only there for the loop: hidden from screen readers and Tab,
                  // but still clickable (they are what's on screen half of the time)
                  aria-hidden={isCopy || undefined}
                  className="w-52 shrink-0 motion-reduce:[&[aria-hidden=true]]:hidden"
                >
                  <PartnerLogo partner={partner} focusable={!isCopy} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;
