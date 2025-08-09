import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Stars } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Stars className="h-5 w-5 text-primary" />
          <span>Chronomancer</span>
        </Link>
        <div className="flex items-center gap-6">
          <NavLink to="/" className="story-link text-sm">
            Home
          </NavLink>
          <NavLink to="/calendar" className="story-link text-sm">
            Calendar
          </NavLink>
          <Button asChild variant="hero" size="sm" className="hover-scale">
            <Link to="/calendar">
              <Calendar className="h-4 w-4" />
              Open Calendar
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
