import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Stars, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/UserContext";

const Navbar = () => {
  const { profile, logout } = useUser();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Stars className="h-5 w-5 text-primary" />
          <span>Chronomancer</span>
        </Link>
        <div className="flex items-center gap-6">
          <NavLink to="/" className="story-link text-sm text-primary font-semibold">
            Home
          </NavLink>
          <Button asChild variant="hero" size="sm" className="hover-scale">
            <Link to="/calendar">
              <Calendar className="h-4 w-4" />
              Open Calendar
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label="Profile menu" className="flex items-center gap-2 rounded-md border px-2 py-1 text-sm hover:bg-accent">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{profile ? "Profile" : "Sign in"}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                {profile ? (
                  <div className="text-xs">
                    <div className="font-medium">{profile.name ? profile.name : 'Birth details'}</div>
                    <div className="text-muted-foreground">{profile.birthDate} • {profile.birthTime}</div>
                    <div className="text-muted-foreground truncate">{profile.birthPlace}</div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Not signed in</div>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {profile ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link to="/login">Add birth details</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
