import Navbar from "@/components/layout/Navbar";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { useEffect } from "react";

const Profile = () => {
  const { profile } = useUser();
  useEffect(() => { document.title = "Profile | Chronomancer"; }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-10">
        <section className="mx-auto max-w-2xl rounded-xl border bg-card p-6 animate-enter">
          <h1 className="text-2xl font-semibold mb-1">Your Profile</h1>
          <p className="text-sm text-muted-foreground mb-6">These details tune our cosmic algorithms just for you.</p>

          {!profile ? (
            <div className="rounded-md border p-6 text-left">
              <p className="text-sm mb-4">No birth details saved yet.</p>
              <Button asChild variant="hero"><Link to="/login">Add your birth details</Link></Button>
            </div>
          ) : (
            <div className="grid gap-4 text-left">
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4 text-primary" /> Birth date</div>
                <div className="mt-1 font-medium">{profile.birthDate}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-primary" /> Birth time</div>
                <div className="mt-1 font-medium">{profile.birthTime}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-primary" /> Birth place</div>
                <div className="mt-1 font-medium">{profile.birthPlace}</div>
              </div>
              <div className="flex justify-end pt-2">
                <Button asChild><Link to="/settings">Settings</Link></Button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Profile;
