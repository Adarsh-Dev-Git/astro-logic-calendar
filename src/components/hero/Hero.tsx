import heroImage from "@/assets/chronomancer-hero.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mouse-x", `${x}%`);
    el.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <section className="relative overflow-hidden">
      <div
        onMouseMove={onMouseMove}
        className="relative isolate grid min-h-[70vh] place-items-center rounded-lg border bg-card bg-cover bg-center cosmic-aurora"
        style={{ backgroundImage: `url(${heroImage})` }}
        aria-label="Chronomancer hero banner showing a sleek calendar amidst constellations"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 text-center animate-fade-in">
          <h1 className="text-balance text-4xl font-bold sm:text-6xl">
            Chronomancer
          </h1>
          <p className="mt-4 text-balance text-lg text-muted-foreground sm:text-xl">
            Align your chaos with the cosmos. A hyper‑polished parody calendar that schedules by astrology, not logic.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild variant="hero" size="lg" className="hover-scale">
              <Link to="/calendar">Open the Calendar</Link>
            </Button>
            <a href="#features" className="story-link text-sm">See features</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
