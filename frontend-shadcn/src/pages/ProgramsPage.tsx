import { CloudOff, RotateCw, SearchX } from "lucide-react";
import CategoryChips from "@/components/CategoryChips";
import CourseCardSkeleton from "@/components/CourseCardSkeleton";
import CoursePagination from "@/components/CoursePagination";
import PageHeader from "@/components/PageHeader";
import ProgramCard from "@/components/ProgramCard";
import SearchInput from "@/components/SearchInput";
import StateMessage from "@/components/StateMessage";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useProgramFilters } from "@/hooks/useProgramFilters";
import { usePrograms } from "@/hooks/usePrograms";
import { pageContainer } from "@/lib/styles";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

const gridStyle = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

function ProgramsPage() {
  const { filters, setFilter, clearFilters, activeFilterCount } =
    useProgramFilters();
  const categories = useCategories();

  const { data, error, loading, retry } = usePrograms({
    search: filters.search || undefined,
    categoryId: filters.categoryId ?? undefined,
    pageNumber: filters.page,
    pageSize: PAGE_SIZE,
  });

  const programs = data?.items ?? [];

  function handlePageChange(page: number) {
    setFilter("page", page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <PageHeader
        eyebrow="Programs"
        title="Complete learning journeys"
        description="Each program bundles several courses into one structured path, from first steps to job-ready."
      >
        <SearchInput
          value={filters.search}
          onSearch={(value) => setFilter("search", value)}
          placeholder="Search programs"
          className="mt-8 max-w-xl"
        />
      </PageHeader>

      <section aria-label="Programs" className={cn(pageContainer, "py-10")}>
        <CategoryChips
          categories={categories}
          selectedId={filters.categoryId}
          onSelect={(categoryId) => setFilter("categoryId", categoryId)}
          allLabel="All programs"
        />

        {/* Announced by screen readers whenever the results change */}
        <p
          aria-live="polite"
          className="mt-8 mb-5 min-h-5 text-sm text-muted-foreground"
        >
          {loading && "Loading programs…"}
          {data && (
            <>
              <span className="font-semibold text-foreground">
                {data.totalCount}
              </span>{" "}
              {data.totalCount === 1 ? "program" : "programs"} found
            </>
          )}
        </p>

        {/* Program cards have the same shape as course cards */}
        {loading && (
          <div aria-hidden className={gridStyle}>
            {Array.from({ length: 6 }, (_, index) => (
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

        {data && programs.length === 0 && (
          <StateMessage
            icon={SearchX}
            title="No programs found"
            description={
              activeFilterCount > 0
                ? "Nothing matches your search. Try another word or category."
                : "There are no programs to show yet. Please check back soon."
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

        {data && programs.length > 0 && (
          <>
            <ul className={gridStyle}>
              {programs.map((program) => (
                <li key={program.id}>
                  <ProgramCard program={program} />
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

export default ProgramsPage;
