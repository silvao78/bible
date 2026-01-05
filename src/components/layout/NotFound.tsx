import { Button } from "@/components/ui/button";

interface NotFoundProps {
  message?: string;
}

/**
 * 404 not found component.
 */
const NotFound = ({ message }: NotFoundProps) => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
    <div className="font-serif text-6xl text-muted-foreground">404</div>
    <div className="text-center text-muted-foreground">
      {message ? <p>{message}</p> : <p>Page Not Found</p>}
    </div>
    <Button onClick={() => window.location.reload()}>Go Home</Button>
  </div>
);

export default NotFound;
