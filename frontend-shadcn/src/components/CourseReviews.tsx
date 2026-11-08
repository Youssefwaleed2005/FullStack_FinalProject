import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, MessageSquareQuote, Pencil, Trash } from "lucide-react";
import Avatar from "@/components/Avatar";
import { StarInput, StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useApiData } from "@/hooks/useApiData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { formatDate } from "@/lib/course";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage, hasStatus } from "@/services/api";
import { getCourseReviews } from "@/services/courseService";
import { deleteMyReview, getMyReview, saveMyReview } from "@/services/learnerService";
import type { CourseReview } from "@/types/Review";

// Course page: rating summary, the reviews, and a form for enrolled learners
function CourseReviews({ courseId }: { courseId: number }) {
  const load = useCallback(() => getCourseReviews(courseId), [courseId]);
  const { data, loading, reload } = useApiData(load);
  const { hasRole, isAuthenticated } = useAuth();

  if (loading && !data)
    return (
      <section aria-busy>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-5 h-36 rounded-2xl" />
      </section>
    );
  if (!data) return null;

  return (
    <section>
      <h2 className="text-2xl font-semibold">Student reviews</h2>

      <div className={cn(panelStyle, "mt-5 grid gap-6 p-6 sm:grid-cols-[11rem_1fr] sm:items-center")}>
        <div className="text-center sm:border-r sm:border-border/70 sm:pr-6">
          <p className="font-heading text-5xl font-semibold">{data.averageRating?.toFixed(1) ?? "–"}</p>
          <StarRating value={data.averageRating ?? 0} size="md" className="mt-2" />
          <p className="mt-1 text-sm text-muted-foreground">
            {data.reviewCount === 0 ? "No reviews yet" : `${data.reviewCount} review${data.reviewCount === 1 ? "" : "s"}`}
          </p>
        </div>
        <ul aria-label="Rating breakdown" className="flex flex-col gap-1.5">
          {data.starCounts.map((count, index) => {
            const stars = 5 - index;
            const percent = data.reviewCount ? Math.round((count / data.reviewCount) * 100) : 0;
            return (
              <li key={stars} className="flex items-center gap-3 text-sm">
                <span className="w-12 shrink-0 text-muted-foreground">{stars} star{stars === 1 ? "" : "s"}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <span className="block h-full rounded-full bg-amber-400" style={{ width: `${percent}%` }} />
                </span>
                <span className="w-8 text-right tabular-nums text-muted-foreground">{count}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {hasRole("Learner") ? (
        <MyReviewForm courseId={courseId} onChanged={reload} />
      ) : (
        !isAuthenticated && (
          <p className="mt-4 text-sm text-muted-foreground">
            Enrolled in this course?{" "}
            <Link to="/login" className="font-medium text-sand-deep underline-offset-4 hover:underline">
              Log in
            </Link>{" "}
            to leave a review.
          </p>
        )
      )}

      {data.reviews.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {data.reviews.map((review) => (
            <li key={review.id} className={cn(panelStyle, "p-5")}>
              <div className="flex items-center gap-3">
                <Avatar name={review.authorName} photoUrl={review.authorPhotoUrl} className="size-10 text-xs" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{review.authorName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(review.updatedAt ?? review.createdAt)}</p>
                </div>
                <StarRating value={review.rating} />
              </div>
              {review.comment && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// Learner: write, edit or delete my own review (only works when enrolled)
function MyReviewForm({ courseId, onChanged }: { courseId: number; onChanged: () => void }) {
  const toast = useToast();
  const [mine, setMine] = useState<CourseReview | null>(null);
  const [state, setState] = useState<"loading" | "not-enrolled" | "ready">("loading");
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getMyReview(courseId)
      .then((review) => {
        if (!active) return;
        setMine(review);
        setRating(review?.rating ?? 0);
        setComment(review?.comment ?? "");
        setState("ready");
      })
      .catch((error) => {
        if (active) setState(hasStatus(error, 403) ? "not-enrolled" : "ready");
      });
    return () => {
      active = false;
    };
  }, [courseId]);

  if (state === "loading") return null;
  if (state === "not-enrolled")
    return <p className="mt-4 text-sm text-muted-foreground">Only learners enrolled in this course can review it.</p>;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (rating === 0) {
      toast.error("Choose a star rating first.");
      return;
    }
    setSaving(true);
    try {
      const saved = await saveMyReview(courseId, { rating, comment: comment.trim() || undefined });
      setMine(saved);
      setEditing(false);
      toast.success(mine ? "Review updated." : "Thanks for your review!");
      onChanged();
    } catch (error) {
      toast.error("Could not save your review", getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteMyReview(courseId);
      setMine(null);
      setRating(0);
      setComment("");
      toast.info("Your review was removed.");
      onChanged();
    } catch (error) {
      toast.error("Could not remove your review", getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  if (mine && !editing) {
    return (
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sand/50 bg-sand/10 px-4 py-3">
        <p className="flex items-center gap-2 text-sm">
          <MessageSquareQuote aria-hidden className="size-4 text-sand-deep" />
          You rated this course <StarRating value={mine.rating} />
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="rounded-full px-3" onClick={() => setEditing(true)}>
            <Pencil aria-hidden /> Edit
          </Button>
          <Button size="sm" variant="ghost" className="rounded-full px-3 text-destructive hover:text-destructive" disabled={saving} onClick={handleDelete}>
            <Trash aria-hidden /> Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn(panelStyle, "mt-4 flex flex-col gap-4 p-5")}>
      <p className="font-semibold">{mine ? "Edit your review" : "Rate this course"}</p>
      <StarInput value={rating} onChange={setRating} />
      <label htmlFor={`review-${courseId}`} className="sr-only">
        Your comment
      </label>
      <Textarea
        id={`review-${courseId}`}
        value={comment}
        maxLength={1000}
        rows={3}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What did you like? What could be better? (optional)"
        className="bg-card px-3"
      />
      <div className="flex gap-2">
        <Button type="submit" className="rounded-full px-5" disabled={saving}>
          {saving && <LoaderCircle aria-hidden className="animate-spin" />}
          {mine ? "Save review" : "Post review"}
        </Button>
        {mine && (
          <Button type="button" variant="outline" className="rounded-full px-4" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default CourseReviews;
