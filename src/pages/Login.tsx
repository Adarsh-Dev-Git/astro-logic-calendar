import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";

const Login = () => {
  const { profile, setProfile } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.name ?? "");
  const [birthDate, setBirthDate] = useState(profile?.birthDate ?? "");
  const [birthTime, setBirthTime] = useState(profile?.birthTime ?? "");
  const [birthPlace, setBirthPlace] = useState(profile?.birthPlace ?? "");

  useEffect(() => { document.title = "Login | Chronomancer"; }, []);

  const onSubmit = () => {
    if (!name || !birthDate || !birthTime || !birthPlace) return;
    setProfile({ name, birthDate, birthTime, birthPlace });
    navigate("/profile");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-10">
        <section className="mx-auto max-w-xl rounded-xl border bg-card p-6 animate-enter">
          <h1 className="text-2xl font-semibold mb-1">Sign in to your stars</h1>
          <p className="text-sm text-muted-foreground mb-6">We only need your birth details to personalize cosmic guidance.</p>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="e.g., Arjun Rao" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="birthDate">Birth date</Label>
                <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birthTime">Birth time</Label>
                <Input id="birthTime" type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birthPlace">Birth place</Label>
              <Input id="birthPlace" placeholder="e.g., Kochi, Kerala" value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} />
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={onSubmit} variant="hero">Save & Continue</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
