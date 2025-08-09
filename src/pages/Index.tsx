import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import { Sparkles, Calendar, MessageCircle, Swords, Mic2 } from "lucide-react";

const Feature = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="bg-cosmic-surface hover-scale rounded-xl border p-6">
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-5 w-5 text-primary" />
      <h3 className="font-semibold">{title}</h3>
    </div>
    <p className="text-sm text-muted-foreground">{desc}</p>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <section id="features" className="container py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold">Corporate Zen meets Cosmic Mess</h2>
            <p className="mt-2 text-muted-foreground">Hyper-polished UI. Hilariously irrational logic. The contrast is the joke.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Feature icon={Calendar} title="Auspicious Scheduling" desc="We ignore your request and consult the stars to pick 2:37 PM Wednesday. You're welcome." />
            <Feature icon={Swords} title="Cosmic Showdown" desc="Conflicts are resolved with animated planetary duels. Stronger backing wins; loser gets bumped." />
            <Feature icon={MessageCircle} title="Astro Excuses" desc="Instant, shareable, totally legitimate astrological reasons for every reschedule." />
            <Feature icon={Mic2} title="Maman Mode" desc="A Kerala uncle narrates your fate in loving Manglish commentary. Pure gold." />
          </div>
          <div className="mt-12 flex justify-center">
            <a href="/calendar" className="story-link flex items-center gap-2 text-sm"><Sparkles className="h-4 w-4" /> Open the calendar</a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
