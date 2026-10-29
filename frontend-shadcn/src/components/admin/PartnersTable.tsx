import ContentRowActions from "@/components/admin/ContentRowActions";
import CoverImage from "@/components/CoverImage";
import Chip from "@/components/manage/Chip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { resolveMaterialUrl } from "@/lib/materialLinks";
import { cn } from "@/lib/utils";
import type { PartnerAdmin } from "@/types/Partner";

type PartnersTableProps = {
  partners: PartnerAdmin[];
  busyId: number | null;
  onToggle: (partner: PartnerAdmin) => void;
  onEdit: (partner: PartnerAdmin) => void;
  onDelete: (partner: PartnerAdmin) => void;
};

// "https://www.example.com/" → "example.com"
const shortLink = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

// Partners and accreditations on the admin content page
function PartnersTable({ partners, busyId, onToggle, onEdit, onDelete }: PartnersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Partner</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Website</TableHead>
          <TableHead className="text-center">Order</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {partners.map((partner) => (
          <TableRow key={partner.id} className={cn(!partner.isActive && "opacity-60")}>
            <TableCell>
              <div className="flex min-w-48 items-center gap-3">
                <CoverImage
                  src={partner.logoUrl ? resolveMaterialUrl(partner.logoUrl) : null}
                  title={partner.name}
                  className="size-12 shrink-0 rounded-lg border border-border/70 bg-card"
                  imageClassName="object-contain p-1.5"
                  letterClassName="text-lg"
                />
                <span className="font-semibold">{partner.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <Chip tone={partner.type === "Accreditation" ? "info" : "outline"}>{partner.type}</Chip>
            </TableCell>
            <TableCell className="max-w-56">
              {partner.websiteUrl ? (
                <a
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate rounded-sm text-muted-foreground underline-offset-4 outline-none hover:text-sand-deep hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {shortLink(partner.websiteUrl)}
                </a>
              ) : (
                <span className="text-muted-foreground">–</span>
              )}
            </TableCell>
            <TableCell className="text-center font-medium tabular-nums">{partner.displayOrder}</TableCell>
            <TableCell>
              <Chip tone={partner.isActive ? "success" : "neutral"}>{partner.isActive ? "Active" : "Hidden"}</Chip>
            </TableCell>
            <TableCell>
              <ContentRowActions
                label={partner.name}
                visible={partner.isActive}
                busy={busyId === partner.id}
                onToggle={() => onToggle(partner)}
                onEdit={() => onEdit(partner)}
                onDelete={() => onDelete(partner)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default PartnersTable;
