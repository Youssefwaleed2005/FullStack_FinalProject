export type PartnerType = "Partner" | "Accreditation";

export type Partner = {
  id: number;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  type: string;
};

// Admin list: hidden partners included
export type PartnerAdmin = {
  id: number;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  type: PartnerType;
  isActive: boolean;
  displayOrder: number;
};

export type PartnerRequest = {
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  type: PartnerType;
  isActive: boolean;
  displayOrder: number;
};
