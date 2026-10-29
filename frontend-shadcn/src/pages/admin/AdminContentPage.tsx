import { useState } from "react";
import { CircleCheck, Handshake, MessageSquareQuote, Plus } from "lucide-react";
import { ADMIN_LINKS } from "@/components/admin/adminLinks";
import PartnerEditorDialog from "@/components/admin/PartnerEditorDialog";
import PartnersTable from "@/components/admin/PartnersTable";
import TestimonialEditorDialog from "@/components/admin/TestimonialEditorDialog";
import TestimonialsTable from "@/components/admin/TestimonialsTable";
import LoadingState from "@/components/LoadingState";
import ConfirmDialog, { type ConfirmRequest } from "@/components/manage/ConfirmDialog";
import EmptyNote from "@/components/manage/EmptyNote";
import ManageHeader from "@/components/manage/ManageHeader";
import TableCard from "@/components/manage/TableCard";
import SearchInput from "@/components/SearchInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiData } from "@/hooks/useApiData";
import { pageContainer } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { deletePartner, getManagePartners, updatePartner } from "@/services/partnerService";
import { deleteTestimonial, getManageTestimonials, updateTestimonial } from "@/services/testimonialService";
import type { PartnerAdmin } from "@/types/Partner";
import type { TestimonialAdmin } from "@/types/Testimonial";

type Tab = "partners" | "testimonials";

// Partners and testimonials shown on the public homepage: add, edit, hide / show, delete
function AdminContentPage() {
  const partnerData = useApiData(getManagePartners);
  const testimonialData = useApiData(getManageTestimonials);
  const [tab, setTab] = useState<Tab>("partners");
  const [search, setSearch] = useState("");
  // Row whose Show / Hide request is running
  const [busy, setBusy] = useState<{ tab: Tab; id: number } | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  // undefined = closed, null = new, object = edit that item
  const [editingPartner, setEditingPartner] = useState<PartnerAdmin | null | undefined>(undefined);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialAdmin | null | undefined>(undefined);

  const isPartners = tab === "partners";
  const current = isPartners ? partnerData : testimonialData;

  async function run(action: () => Promise<unknown>, success: string, failure: string, reload: () => void) {
    setError("");
    setMessage("");
    try {
      await action();
      setMessage(success);
      reload();
    } catch (err) {
      setError(getApiErrorMessage(err, failure));
    }
  }

  async function togglePartner(partner: PartnerAdmin) {
    const isActive = !partner.isActive;
    setBusy({ tab: "partners", id: partner.id });
    await run(
      () =>
        updatePartner(partner.id, {
          name: partner.name,
          logoUrl: partner.logoUrl || null,
          websiteUrl: partner.websiteUrl || null,
          type: partner.type,
          displayOrder: partner.displayOrder,
          isActive,
        }),
      `${partner.name} is now ${isActive ? "shown on" : "hidden from"} the website.`,
      "Could not change this partner.",
      partnerData.reload,
    );
    setBusy(null);
  }

  async function toggleTestimonial(testimonial: TestimonialAdmin) {
    const isPublished = !testimonial.isPublished;
    setBusy({ tab: "testimonials", id: testimonial.id });
    await run(
      () =>
        updateTestimonial(testimonial.id, {
          authorName: testimonial.authorName,
          authorTitle: testimonial.authorTitle || null,
          photoUrl: testimonial.photoUrl || null,
          content: testimonial.content,
          rating: testimonial.rating,
          isPublished,
        }),
      `${testimonial.authorName}'s testimonial is now ${isPublished ? "published" : "hidden"}.`,
      "Could not change this testimonial.",
      testimonialData.reload,
    );
    setBusy(null);
  }

  function askDelete(name: string, what: string, remove: () => Promise<void>, reload: () => void) {
    setConfirm({
      title: `Delete ${name}?`,
      description: `This ${what} will be removed from the website for good. To take it down for now, hide it instead.`,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: () => run(remove, `${name} was deleted.`, `Could not delete this ${what}.`, reload),
    });
  }

  const term = search.toLowerCase();
  const partners = (partnerData.data ?? []).filter((p) => !term || p.name.toLowerCase().includes(term));
  const testimonials = (testimonialData.data ?? []).filter(
    (t) => !term || t.authorName.toLowerCase().includes(term) || t.content.toLowerCase().includes(term),
  );
  const shown = isPartners ? partners.length : testimonials.length;
  const total = current.data?.length ?? 0;
  const busyId = busy?.tab === tab ? busy.id : null;

  return (
    <>
      <ManageHeader
        eyebrow="Admin"
        title="Manage content"
        description="Edit the partners and testimonials shown on the public website."
        links={ADMIN_LINKS}
        actions={
          <Button
            className="h-10 rounded-full bg-sand px-5 text-primary hover:bg-sand/85"
            onClick={() => (isPartners ? setEditingPartner(null) : setEditingTestimonial(null))}
          >
            <Plus aria-hidden /> {isPartners ? "Add partner" : "Add testimonial"}
          </Button>
        }
      />

      <div className={cn(pageContainer, "flex flex-col gap-5 py-10")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value as Tab);
              setSearch("");
            }}
          >
            <TabsList className="h-10! rounded-full bg-secondary p-1">
              <TabsTrigger value="partners" className="gap-2 rounded-full px-4">
                <Handshake aria-hidden /> Partners
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="gap-2 rounded-full px-4">
                <MessageSquareQuote aria-hidden /> Testimonials
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <SearchInput
            value={search}
            onSearch={setSearch}
            placeholder={isPartners ? "Search partner name" : "Search author or text"}
            className="w-full sm:w-80"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
            <CircleCheck />
            <AlertDescription className="text-emerald-800">{message}</AlertDescription>
          </Alert>
        )}

        {current.loading && !current.data ? (
          <LoadingState label={isPartners ? "Loading partners…" : "Loading testimonials…"} />
        ) : current.failed || !current.data ? (
          <Alert variant="destructive">
            <AlertDescription>
              {getApiErrorMessage(current.error, isPartners ? "Could not load partners." : "Could not load testimonials.")}
            </AlertDescription>
          </Alert>
        ) : shown === 0 ? (
          <EmptyNote
            icon={isPartners ? Handshake : MessageSquareQuote}
            title={isPartners ? "No partners found" : "No testimonials found"}
            description={search ? "Try a different search." : "Use the Add button to create the first one."}
          />
        ) : (
          <TableCard
            title={isPartners ? "Partners" : "Testimonials"}
            description={search ? `${shown} of ${total}` : `${total} in total`}
          >
            {isPartners ? (
              <PartnersTable
                partners={partners}
                busyId={busyId}
                onToggle={togglePartner}
                onEdit={setEditingPartner}
                onDelete={(p) => askDelete(p.name, "partner", () => deletePartner(p.id), partnerData.reload)}
              />
            ) : (
              <TestimonialsTable
                testimonials={testimonials}
                busyId={busyId}
                onToggle={toggleTestimonial}
                onEdit={setEditingTestimonial}
                onDelete={(t) =>
                  askDelete(`${t.authorName}'s testimonial`, "testimonial", () => deleteTestimonial(t.id), testimonialData.reload)
                }
              />
            )}
          </TableCard>
        )}
      </div>

      {editingPartner !== undefined && (
        <PartnerEditorDialog
          partner={editingPartner}
          onClose={() => setEditingPartner(undefined)}
          onSaved={(name) => {
            setEditingPartner(undefined);
            setError("");
            setMessage(`${name} was saved.`);
            partnerData.reload();
          }}
        />
      )}
      {editingTestimonial !== undefined && (
        <TestimonialEditorDialog
          testimonial={editingTestimonial}
          onClose={() => setEditingTestimonial(undefined)}
          onSaved={(name) => {
            setEditingTestimonial(undefined);
            setError("");
            setMessage(`${name}'s testimonial was saved.`);
            testimonialData.reload();
          }}
        />
      )}

      <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}

export default AdminContentPage;
