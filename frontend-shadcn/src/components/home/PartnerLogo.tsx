import { useState } from "react";
import type { Partner } from "@/types/Partner";

type PartnerLogoProps = {
  partner: Partner;
};

// A partner's logo; shows the name as text when there is no logo or it fails to load
function PartnerLogo({ partner }: PartnerLogoProps) {
  const [logoFailed, setLogoFailed] = useState(false);

  const content =
    partner.logoUrl && !logoFailed ? (
      <img
        src={partner.logoUrl}
        alt={partner.name}
        loading="lazy"
        onError={() => setLogoFailed(true)}
        className="max-h-10 w-auto max-w-36 object-contain"
      />
    ) : (
      <span className="font-heading text-lg font-semibold">{partner.name}</span>
    );

  const style =
    "flex h-20 items-center justify-center rounded-2xl border border-border/80 bg-card px-6 text-muted-foreground opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0";

  if (!partner.websiteUrl) return <div className={style}>{content}</div>;

  return (
    <a
      href={partner.websiteUrl}
      target="_blank"
      rel="noreferrer"
      className={`${style} outline-none focus-visible:ring-3 focus-visible:ring-ring/50`}
    >
      {content}
    </a>
  );
}

export default PartnerLogo;
