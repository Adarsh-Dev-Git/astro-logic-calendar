import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import CosmicShowdown from "@/components/CosmicShowdown";
import { ScheduledEvent, EventCategory, schedule as scheduleEngine, resolveConflict, nextOkayWindow, scheduleWorstForProfile } from "@/lib/astroEngine";
import { isRetrogradeMock, speakMaman } from "@/lib/maman";
import { useUser } from "@/context/UserContext";

const categories: { label: string; value: EventCategory }[] = [
  { label: "Communication", value: "communication" },
  { label: "Romance / Social", value: "romance" },
  { label: "Conflict / Decision", value: "conflict" },
  { label: "Leadership / Visibility", value: "leadership" },
];

const CalendarPage = () => {
  const { profile } = useUser();
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const toLocalInputValue = (date: Date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };
  const [dateTime, setDateTime] = useState<string>(toLocalInputValue(new Date()));
  const [durationHours, setDurationHours] = useState<number>(1);
  const [durationMinutes, setDurationMinutes] = useState<number>(0);
  const [category, setCategory] = useState<EventCategory>("communication");
  const [chaos, setChaos] = useState<boolean>(false);
  const [showdown, setShowdown] = useState<{ a: ScheduledEvent; b: ScheduledEvent; winnerId: string } | null>(null);
  const [maman, setMaman] = useState<boolean>(() => localStorage.getItem("mamanMode") === "true");

  useEffect(() => { localStorage.setItem("mamanMode", String(maman)); }, [maman]);

  const ymd = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const eventDates = useMemo(() => new Set(events.map(e => ymd(e.start))), [events]);

  const fcEvents = useMemo(() => events.map(e => ({
    id: e.id,
    title: e.title,
    start: e.start,
    end: e.end,
    classNames: [
      e.mood === "mars" ? "mood-mars" :
      e.mood === "venus" ? "mood-venus" :
      e.mood === "mercury" ? "mood-mercury" :
      e.mood === "jupiter" ? "mood-jupiter" :
      e.mood === "sun" ? "mood-sun" : "mood-moon"
    ]
  })), [events]);

  const onSubmit = async () => {
    const requested = new Date(dateTime);
    const totalMinutes = Math.max(15, durationHours * 60 + durationMinutes);
    const { event: newEvent, conflictWith } = scheduleEngine({
      title,
      requested,
      durationMinutes: totalMinutes,
      category,
      chaosMode: chaos,
    }, events);

    if (maman) {
      if (isRetrogradeMock(requested)) speakMaman("retrograde");
      speakMaman("schedule");
      speakMaman(chaos ? "chaos" : "good");
    }

    if (conflictWith) {
      const { winner, loser } = resolveConflict(newEvent, conflictWith);
      const { start, end } = nextOkayWindow(winner.end, totalMinutes);
      const movedLoser: ScheduledEvent = { ...loser, start, end, excuse: loser.excuse + " Rescheduled to the next somewhat okay window." };
      setShowdown({ a: newEvent, b: conflictWith, winnerId: winner.id });
      setTimeout(() => setShowdown(null), 2200);
      setEvents(prev => prev.filter(e => e.id !== conflictWith.id).concat([winner, movedLoser]));
      copyExcuse(winner.excuse);
    } else {
      setEvents(prev => prev.concat(newEvent));
      copyExcuse(newEvent.excuse);
    }

    setOpen(false);
    setTitle("");
  };

  const copyExcuse = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Astrological excuse copied", description: text });
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-6">
        <section className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Your Cosmic Calendar</h1>
            <p className="text-sm text-muted-foreground">Polished on the surface, cosmically chaotic underneath.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="maman">Enable Maman Mode</Label>
              <Switch id="maman" checked={maman} onCheckedChange={setMaman} />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="hero">Schedule event</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Propose an event (we'll ignore it)</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Team Sync" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="datetime">Requested date & time</Label>
                      <Input id="datetime" type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Duration</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-1">
                          <Label htmlFor="durationHours" className="text-xs text-muted-foreground">Hours</Label>
                          <Input id="durationHours" type="number" min={0} step={1} value={durationHours} onChange={(e) => setDurationHours(Math.max(0, Number(e.target.value)))} />
                        </div>
                        <div className="grid gap-1">
                          <Label htmlFor="durationMinutes" className="text-xs text-muted-foreground">Minutes</Label>
                          <Input id="durationMinutes" type="number" min={0} max={59} step={5} value={durationMinutes} onChange={(e) => setDurationMinutes(Math.min(59, Math.max(0, Number(e.target.value))))} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Category</Label>
                      <Select value={category} onValueChange={(v) => setCategory(v as EventCategory)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <Label className="mb-1 block">Chaos Mode</Label>
                        <p className="text-xs text-muted-foreground">Schedule at the worst possible time.</p>
                      </div>
                      <Switch checked={chaos} onCheckedChange={setChaos} />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={onSubmit} variant="hero">Invoke the stars</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <div className="rounded-lg border bg-card p-2">
          <FullCalendar
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{ left: "prev,next today", center: "title", right: "timeGridDay,timeGridWeek,dayGridMonth" }}
            height="auto"
            nowIndicator
              selectable
              dateClick={(info) => {
                setDateTime(toLocalInputValue(new Date(info.date)));
                setOpen(true);
              }}
              select={(info) => {
                const start = new Date(info.start);
                const end = new Date(info.end);
                const minutes = Math.max(15, Math.round((end.getTime() - start.getTime()) / 60000));
                setDateTime(toLocalInputValue(start));
                setDurationHours(Math.floor(minutes / 60));
                setDurationMinutes(minutes % 60);
                setOpen(true);
              }}
              eventClick={(info) => {
                const clickedId = String(info.event.id || "");
                if (!clickedId) return;
                const ok = window.confirm(`Delete event "${info.event.title}"?`);
                if (ok) {
                  setEvents((prev) => prev.filter((e) => e.id !== clickedId));
                  toast({ title: "Event deleted", description: `${info.event.title}` });
                }
              }}
            events={fcEvents}
          />
        </div>
      </main>

      {showdown && (
        <CosmicShowdown a={showdown.a} b={showdown.b} winnerId={showdown.winnerId} />
      )}
    </div>
  );
};

export default CalendarPage;
