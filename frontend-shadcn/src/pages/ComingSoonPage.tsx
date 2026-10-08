import { Link } from "react-router-dom";
import { Hammer } from "lucide-react";
import StateMessage from "@/components/StateMessage";
import { Button } from "@/components/ui/button";

type ComingSoonPageProps = {
  title: string;
};

// Placeholder for pages that are not rebuilt in the shadcn experiment yet
function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <StateMessage
        icon={Hammer}
        title={title}
        description="This page is not part of the shadcn experiment yet. The course catalog is ready to explore."
        action={
          <Button asChild size="lg" className="rounded-full px-5">
            <Link to="/courses">Browse courses</Link>
          </Button>
        }
      />
    </div>
  );
}

export default ComingSoonPage;
