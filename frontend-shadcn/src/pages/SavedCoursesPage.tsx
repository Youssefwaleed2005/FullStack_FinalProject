import { Link } from "react-router-dom";
import { Heart, Trash } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import PageHeader from "@/components/PageHeader";
import StateMessage from "@/components/StateMessage";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { removeSaved } from "@/lib/wishlist";
import { pageContainer } from "@/lib/styles";
import { cn } from "@/lib/utils";

// Courses saved with the heart button (stored in this browser)
function SavedCoursesPage() {
  const saved = useWishlist();

  return (
    <>
      <PageHeader
        eyebrow="Saved"
        title="Your saved courses"
        description="Courses you saved with the heart. They're kept on this device so you can compare them before applying."
      />
      <div className={cn(pageContainer, "py-12")}>
        {saved.length === 0 ? (
          <StateMessage
            icon={Heart}
            title="Nothing saved yet"
            description="Tap the heart on any course to keep it here for later."
            action={
              <Button asChild size="lg" className="rounded-full px-5">
                <Link to="/courses">Browse courses</Link>
              </Button>
            }
          />
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {saved.length} saved course{saved.length === 1 ? "" : "s"}. Prices and dates may have changed; open a course to see the latest details.
              </p>
              <Button
                variant="outline"
                className="rounded-full px-4"
                onClick={() => saved.forEach((course) => removeSaved(course.id))}
              >
                <Trash aria-hidden /> Clear all
              </Button>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map((course) => (
                <li key={course.id}>
                  <CourseCard course={course} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export default SavedCoursesPage;
