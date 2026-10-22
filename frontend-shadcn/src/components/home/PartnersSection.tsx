import PartnerLogo from "@/components/home/PartnerLogo";
import { useApiData } from "@/hooks/useApiData";
import { getPartners } from "@/services/partnerService";

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

  return (
    <section className="border-t border-border/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-center font-sans text-xs font-semibold tracking-[0.2em] text-sand-deep uppercase">
          Trusted by our partners
        </h2>
        <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <ul className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
            {strip.map((partner, index) => (
              <li
                key={`${partner.id}-${index}`}
                aria-hidden={index >= partners.length}
                className="w-52 shrink-0 transition-transform duration-300 hover:-translate-y-1 motion-reduce:[&[aria-hidden=true]]:hidden"
              >
                <PartnerLogo partner={partner} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;
