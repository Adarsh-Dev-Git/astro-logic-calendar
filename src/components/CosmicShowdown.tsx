import { Sparkles, Sword } from "lucide-react";
import { ScheduledEvent } from "@/lib/astroEngine";

interface Props {
  a: ScheduledEvent;
  b: ScheduledEvent;
  winnerId: string;
}

const Pill = ({ label }: { label: string }) => (
  <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
    {label}
  </span>
);

const Card = ({ e, winner }: { e: ScheduledEvent; winner: boolean }) => (
  <div className={`bg-cosmic-surface w-full max-w-xs rounded-xl border p-4 text-left ${winner ? "ring-2 ring-primary animate-scale-in" : "opacity-80"}`}>
    <div className="flex items-center justify-between">
      <h4 className="font-semibold">{e.title}</h4>
      {winner ? <Sparkles className="h-4 w-4 text-primary" /> : <Sword className="h-4 w-4 text-muted-foreground" />}
    </div>
    <div className="mt-2 flex flex-wrap gap-2">
      <Pill label={e.backing} />
      <Pill label={`Mood: ${e.mood}`} />
      <Pill label={`Score: ${e.score}`} />
    </div>
  </div>
);

const CosmicShowdown = ({ a, b, winnerId }: Props) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center bg-background/50 backdrop-blur-sm animate-fade-in">
      <div className="container mx-auto flex max-w-4xl flex-col items-center gap-6 sm:flex-row sm:items-stretch">
        <Card e={a} winner={a.id === winnerId} />
        <div className="select-none text-sm text-muted-foreground">vs</div>
        <Card e={b} winner={b.id === winnerId} />
      </div>
    </div>
  );
};

export default CosmicShowdown;
