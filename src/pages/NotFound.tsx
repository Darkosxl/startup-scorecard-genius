
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 animate-fade-in">
      <div className="text-center max-w-md p-8">
        <div className="mb-6 relative">
          <div className="absolute inset-0 blur-3xl bg-primary/10 rounded-full"></div>
          <h1 className="text-8xl font-bold text-primary relative z-10">404</h1>
        </div>
        <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white">Page not found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          The page you're looking for doesn't exist or has been moved to another URL.
        </p>
        <Link to="/">
          <Button size="lg" className="animate-pulse">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
