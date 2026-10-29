import { Star } from "lucide-react";
import ContentRowActions from "@/components/admin/ContentRowActions";
import Chip from "@/components/manage/Chip";
import PersonCell from "@/components/manage/PersonCell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/course";
import { cn } from "@/lib/utils";
import type { TestimonialAdmin } from "@/types/Testimonial";

type TestimonialsTableProps = {
  testimonials: TestimonialAdmin[];
  busyId: number | null;
  onToggle: (testimonial: TestimonialAdmin) => void;
  onEdit: (testimonial: TestimonialAdmin) => void;
  onDelete: (testimonial: TestimonialAdmin) => void;
};

// Student testimonials on the admin content page
function TestimonialsTable({ testimonials, busyId, onToggle, onEdit, onDelete }: TestimonialsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Author</TableHead>
          <TableHead>Testimonial</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Added</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {testimonials.map((testimonial) => (
          <TableRow key={testimonial.id} className={cn(!testimonial.isPublished && "opacity-60")}>
            <TableCell className="max-w-60">
              <PersonCell name={testimonial.authorName} detail={testimonial.authorTitle ?? undefined} />
            </TableCell>
            <TableCell>
              <p title={testimonial.content} className="line-clamp-2 max-w-md min-w-60 whitespace-normal text-muted-foreground">
                {testimonial.content}
              </p>
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {testimonial.rating ? (
                <span className="inline-flex items-center gap-1 font-medium tabular-nums" aria-label={`${testimonial.rating} out of 5`}>
                  <Star aria-hidden className="size-3.5 fill-sand text-sand" /> {testimonial.rating}
                </span>
              ) : (
                <span className="text-muted-foreground">–</span>
              )}
            </TableCell>
            <TableCell>
              <Chip tone={testimonial.isPublished ? "success" : "neutral"}>{testimonial.isPublished ? "Published" : "Hidden"}</Chip>
            </TableCell>
            <TableCell className="whitespace-nowrap">{formatDate(testimonial.createdAt)}</TableCell>
            <TableCell>
              <ContentRowActions
                label={testimonial.authorName}
                visible={testimonial.isPublished}
                busy={busyId === testimonial.id}
                onToggle={() => onToggle(testimonial)}
                onEdit={() => onEdit(testimonial)}
                onDelete={() => onDelete(testimonial)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TestimonialsTable;
