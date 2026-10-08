import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import StateMessage from "@/components/StateMessage";
import { Button } from "@/components/ui/button";

function NotFoundPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <StateMessage
        icon={Compass}
        title="Page not found"
        description="The page you are looking for does not exist or has been moved."
        action={
          <Button asChild size="lg" className="rounded-full px-5">
            <Link to="/courses">Browse courses</Link>
          </Button>
        }
      />
    </div>
  );
}

export default NotFoundPage;
