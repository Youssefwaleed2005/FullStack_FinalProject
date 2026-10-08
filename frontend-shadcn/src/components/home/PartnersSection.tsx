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

  return (
    <section className="border-t border-border/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-center font-sans text-xs font-semibold tracking-[0.2em] text-sand-deep uppercase">
          Trusted by our partners
        </h2>
        <ul className="mt-8 flex flex-wrap justify-center gap-4">
          {partners.map((partner) => (
            <li key={partner.id} className="w-full max-w-52">
              <PartnerLogo partner={partner} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default PartnersSection;
