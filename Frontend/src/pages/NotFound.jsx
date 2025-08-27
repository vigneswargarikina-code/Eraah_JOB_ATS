import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFound = () => {
  return (
    <div className="flex h-96 items-center justify-center">
      <Card className="p-8 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
        <p className="text-muted-foreground mb-6">Page not found</p>
        <Button asChild>
          <Link to="/kanban">Go to Kanban Board</Link>
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;

