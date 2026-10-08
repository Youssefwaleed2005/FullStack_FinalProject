import { CloudOff, RotateCw, SearchX } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import CourseCardSkeleton from "@/components/CourseCardSkeleton";
import CourseFilterBar from "@/components/CourseFilterBar";
import CoursePagination from "@/components/CoursePagination";
import SearchInput from "@/components/SearchInput";
import StateMessage from "@/components/StateMessage";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useCourseFilters } from "@/hooks/useCourseFilters";
import { useCourses } from "@/hooks/useCourses";
import { SORT_OPTIONS } from "@/lib/course";

const PAGE_SIZE = 9;

const gridStyle = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

function CourseCatalogPage() {
  const { filters, setFilter, clearFilters, activeFilterCount } =
    useCourseFilters();
  const categories = useCategories();

  const sortOption = SORT_OPTIONS.find(
    (option) => option.value === filters.sort,
  )!;

  const { data, error, loading, retry } = useCourses({
    search: filters.search || undefined,
    categoryId: filters.categoryId ?? undefined,
    type: filters.type ?? undefined,
    status: filters.status ?? undefined,
    sortBy: sortOption.sortBy,
    sortDescending: sortOption.sortDescending,
    pageNumber: filters.page,
    pageSize: PAGE_SIZE,
  });

  const courses = data?.items ?? [];

  function handlePageChange(page: number) {
    setFilter("page", page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      {/* Page header with the search box */}
      <section className="relative overflow-hidden border-b border-border/70 bg-linear-to-b from-secondary/70 to-background">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 size-96 rounded-full bg-sand/25 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-sand-deep uppercase">
            Course catalog
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl leading-tight font-semibold text-balance sm:text-5xl">
            Learn the skills that move your career forward
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Browse online and on-campus courses taught by working professionals.
          </p>
          <SearchInput
            value={filters.search}
            onSearch={(value) => setFilter("search", value)}
            placeholder="Search courses"
            className="mt-8 max-w-xl"
          />
        </div>
      </section>

      <section
        aria-label="Courses"
        className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <CourseFilterBar
          filters={filters}
          categories={categories}
          activeFilterCount={activeFilterCount}
          onFilterChange={setFilter}
          onClear={clearFilters}
        />

        {/* Announced by screen readers whenever the results change */}
        <p
          aria-live="polite"
          className="mt-8 mb-5 min-h-5 text-sm text-muted-foreground"
        >
          {loading && "Loading courses…"}
          {data && (
            <>
              <span className="font-semibold text-foreground">
                {data.totalCount}
              </span>{" "}
              {data.totalCount === 1 ? "course" : "courses"} found
            </>
          )}
        </p>

        {loading && (
          <div aria-hidden className={gridStyle}>
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        )}

        {error && (
          <StateMessage
            icon={CloudOff}
            title="Something went wrong"
            description={error}
            action={
              <Button size="lg" className="rounded-full px-5" onClick={retry}>
                <RotateCw data-icon="inline-start" />
                Try again
              </Button>
            }
          />
        )}

        {data && courses.length === 0 && (
          <StateMessage
            icon={SearchX}
            title="No courses found"
            description={
              activeFilterCount > 0
                ? "Nothing matches your search and filters. Try removing some of them."
                : "There are no courses to show yet. Please check back soon."
            }
            action={
              activeFilterCount > 0 && (
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-5"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              )
            }
          />
        )}

        {data && courses.length > 0 && (
          <>
            <ul className={gridStyle}>
              {courses.map((course) => (
                <li key={course.id}>
                  <CourseCard course={course} />
                </li>
              ))}
            </ul>

            {data.totalPages > 1 && (
              <div className="mt-12">
                <CoursePagination
                  page={data.pageNumber}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default CourseCatalogPage;
