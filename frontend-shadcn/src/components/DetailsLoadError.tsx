import { Link } from "react-router-dom";
import { CloudOff, SearchX } from "lucide-react";
import StateMessage from "@/components/StateMessage";
import { Button } from "@/components/ui/button";
import { hasStatus } from "@/services/api";

type DetailsLoadErrorProps = {
  error: unknown;
  // e.g. "course" → "This course does not exist."
  itemName: string;
  back: { label: string; to: string };
};

// Shown when a details page could not load its item
function DetailsLoadError({ error, itemName, back }: DetailsLoadErrorProps) {
  const notFound = hasStatus(error, 404);

  return (
    <div className="flex flex-1 items-center justify-center">
      <StateMessage
        icon={notFound ? SearchX : CloudOff}
        title={notFound ? `This ${itemName} does not exist` : "Something went wrong"}
        description={
          notFound
            ? "It may have been removed, or the link is wrong."
            : `We couldn't load this ${itemName}. Please try again later.`
        }
        action={
          <Button asChild size="lg" className="rounded-full px-5">
            <Link to={back.to}>{back.label}</Link>
          </Button>
        }
      />
    </div>
  );
}

export default DetailsLoadError;
