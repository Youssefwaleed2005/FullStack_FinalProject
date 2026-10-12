import { CloudOff, Compass } from "lucide-react";
import CareerPathCard from "@/components/CareerPathCard";
import PageHeader from "@/components/PageHeader";
import StateMessage from "@/components/StateMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiData } from "@/hooks/useApiData";
import { pageContainer } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getCareerPaths } from "@/services/careerPathService";

function loadAllCareerPaths() {
  return getCareerPaths();
}

const gridStyle = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

function CareerPathsPage() {
  const { data, loading, failed } = useApiData(loadAllCareerPaths);

  return (
    <>
      <PageHeader
        eyebrow="Career paths"
        title="Choose your goal, we'll map the route"
        description="Each career path is a guided journey of programs and courses that leads to a specific role."
      />

      <section aria-label="Career paths" className={cn(pageContainer, "py-12")}>
        {loading && (
          <div aria-hidden className={gridStyle}>
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-96 rounded-2xl" />
            ))}
          </div>
        )}

        {failed && (
          <StateMessage
            icon={CloudOff}
            title="Something went wrong"
            description="We couldn't load the career paths. Please try again later."
          />
        )}

        {data && data.length === 0 && (
          <StateMessage
            icon={Compass}
            title="No career paths yet"
            description="We are putting the first career paths together. Please check back soon."
          />
        )}

        {data && data.length > 0 && (
          <ul className={gridStyle}>
            {data.map((careerPath) => (
              <li key={careerPath.id}>
                <CareerPathCard careerPath={careerPath} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default CareerPathsPage;
