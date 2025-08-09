import Navbar from "@/components/layout/Navbar";
import { useUser } from "@/context/UserContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const Settings = () => {
  const { settings, setSettings } = useUser();
  useEffect(() => { document.title = "Settings | Chronomancer"; }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-10">
        <section className="mx-auto max-w-2xl rounded-xl border bg-card p-6 animate-enter">
          <h1 className="text-2xl font-semibold mb-1">Settings</h1>
          <p className="text-sm text-muted-foreground mb-6">Personalize your experience.</p>

          <div className="grid gap-6">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Theme</Label>
                <Select value={settings.theme} onValueChange={(v) => setSettings({ theme: v as any })}>
                  <SelectTrigger><SelectValue placeholder="System" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Time zone</Label>
                <Select value={settings.timeZone} onValueChange={(v) => setSettings({ timeZone: v })}>
                  <SelectTrigger><SelectValue placeholder="Select time zone" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {(Intl as any).supportedValuesOf ? (Intl as any).supportedValuesOf("timeZone").map((tz: string) => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    )) : [settings.timeZone].map((tz) => (<SelectItem key={tz} value={tz}>{tz}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label className="mb-1 block">Notifications</Label>
                <p className="text-xs text-muted-foreground">Enable helpful reminders before events.</p>
              </div>
              <Switch checked={settings.notifications} onCheckedChange={(v) => setSettings({ notifications: v })} />
            </div>

            <div className="flex justify-end">
              <Button variant="secondary">All changes are saved automatically</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
