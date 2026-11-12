import { BadgeCheck, Handshake } from "lucide-react";
import type { Partner, PartnerType } from "@/types/Partner";

// Icon + label for each partner type (the CMS calls sponsors "Accreditation")
export const PARTNER_TYPES: Record<PartnerType, { icon: typeof Handshake; label: string; plural: string }> = {
  Partner: { icon: Handshake, label: "Partner", plural: "Partners" },
  Accreditation: { icon: BadgeCheck, label: "Accreditation", plural: "Accreditations" },
};

// The public API sends the type as a plain string; anything unknown counts as a partner
export function partnerTypeOf(partner: Partner): PartnerType {
  return partner.type === "Accreditation" ? "Accreditation" : "Partner";
}
