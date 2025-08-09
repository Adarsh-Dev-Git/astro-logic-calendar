export type EventCategory = "communication" | "romance" | "conflict" | "leadership";

export interface ScheduleRequest {
  title: string;
  requested: Date;
  durationMinutes: number;
  category: EventCategory;
  chaosMode: boolean;
}

export interface ScheduledEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: EventCategory;
  mood: "mars" | "venus" | "mercury" | "jupiter" | "sun" | "moon";
  backing: string; // e.g., "Jupiter trine Sun"
  score: number; // arbitrary power score
  excuse: string;
}

const planetByCategory: Record<EventCategory, { mood: ScheduledEvent["mood"]; planet: string }[]> = {
  communication: [
    { mood: "mercury", planet: "Mercury" },
    { mood: "moon", planet: "Moon" },
  ],
  romance: [
    { mood: "venus", planet: "Venus" },
    { mood: "moon", planet: "Moon" },
  ],
  conflict: [
    { mood: "mars", planet: "Mars" },
    { mood: "sun", planet: "Sun" },
  ],
  leadership: [
    { mood: "sun", planet: "Sun" },
    { mood: "jupiter", planet: "Jupiter" },
  ],
};

function seededRandom(seed: number) {
  // Mulberry32
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function pickBacking(category: EventCategory, chaos: boolean) {
  const pool = planetByCategory[category];
  const primary = chaos ? pool[0] : pool[0];
  const secondary = pool[1];
  return { primary, secondary };
}

function computeWindow(requested: Date, category: EventCategory, chaos: boolean, durationMinutes: number) {
  const seed = requested.getTime() + category.length * (chaos ? -13 : 13);
  const rand = seededRandom(seed);
  const dayOffset = Math.floor(rand() * 3); // within ~3 days
  const minuteOffset = Math.floor(rand() * 12) * 23; // quirky offsets
  const start = new Date(requested);
  start.setDate(start.getDate() + (chaos ? -dayOffset : dayOffset));
  start.setMinutes(start.getMinutes() + (chaos ? -minuteOffset : minuteOffset));
  // Snap to delightful odd times like 2:37 or 4:44
  const snapCandidates = [37, 44, 11, 58, 22];
  start.setMinutes(snapCandidates[Math.floor(rand() * snapCandidates.length)]);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  return { start, end };
}

function scoreFor(category: EventCategory, date: Date, chaos: boolean) {
  const base = (date.getHours() * 7 + date.getMinutes()) % 100;
  return chaos ? 100 - base : base;
}

function excuseFor(title: string, category: EventCategory, winner: string, loser?: string) {
  const map: Record<EventCategory, { bad: string; good: string }> = {
    communication: {
      bad: "with Saturn squaring my natal Mercury, our messages would be blocked",
      good: "a harmonious trine from Venus promises clarity and charm",
    },
    romance: {
      bad: "Venus is afflicted—vibes are off and affection may misfire",
      good: "Venus-Jupiter flow opens sweet, generous connections",
    },
    conflict: {
      bad: "Mars is over-caffeinated; tempers would run high",
      good: "Mars dignified lends decisive, courageous action",
    },
    leadership: {
      bad: "The Sun is in a foggy aspect; leadership could feel wobbly",
      good: "Solar-Jupiter rays favor recognition and success",
    },
  };
  const lines = map[category];
  const winnerLine = `${winner} prevails`;
  return `I've had to adjust "${title}" because ${lines.bad}. The new time benefits from ${lines.good}. In our cosmic showdown, ${winnerLine}.`;
}

export function schedule(req: ScheduleRequest, existing: ScheduledEvent[] = []): { event: ScheduledEvent; conflictWith?: ScheduledEvent } {
  const { primary, secondary } = pickBacking(req.category, req.chaosMode);
  const { start, end } = computeWindow(req.requested, req.category, req.chaosMode, req.durationMinutes);
  const score = scoreFor(req.category, start, req.chaosMode);
  const mood = primary.mood;
  const backing = `${primary.planet} with a wink from ${secondary.planet}`;
  const newEvent: ScheduledEvent = {
    id: Math.random().toString(36).slice(2),
    title: req.title,
    start,
    end,
    category: req.category,
    mood,
    backing,
    score,
    excuse: excuseFor(req.title, req.category, primary.planet),
  };

  const conflictWith = existing.find(e => !(end <= e.start || start >= e.end));
  return { event: newEvent, conflictWith };
}

export function resolveConflict(a: ScheduledEvent, b: ScheduledEvent): { winner: ScheduledEvent; loser: ScheduledEvent } {
  const winner = a.score >= b.score ? a : b;
  const loser = winner === a ? b : a;
  return { winner, loser };
}

export function nextOkayWindow(after: Date, minutes: number): { start: Date; end: Date } {
  const start = new Date(after.getTime() + 60 * 60 * 1000); // +1h
  const end = new Date(start.getTime() + minutes * 60_000);
  return { start, end };
}

// Personalized chaos: suggest the worst possible window based on a user's birth details
export type UserAstroProfile = { birthDate: string; birthTime: string; birthPlace: string };

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return (h >>> 0);
}

function profileSeed(profile: UserAstroProfile) {
  const ts = Date.parse(`${profile.birthDate}T${profile.birthTime}:00Z`) || 0;
  return (ts + hashString(profile.birthPlace)) >>> 0;
}

function personaBias(profile: UserAstroProfile) {
  return profileSeed(profile) % 100; // 0..99 target alignment bucket
}

export function suggestWorstWindowForProfile(req: ScheduleRequest, profile: UserAstroProfile): { start: Date; end: Date } {
  const bias = personaBias(profile);
  const base = new Date(req.requested);
  let bestStart = new Date(base);
  let bestScore = Number.POSITIVE_INFINITY; // lower is worse for the person

  const dayOffsets = [-2, -1, 0, 1, 2];
  const hours = [6, 8, 10, 12, 14, 16, 18, 20, 22];
  const minutes = [11, 22, 37, 44, 58];

  for (const d of dayOffsets) {
    for (const h of hours) {
      for (const m of minutes) {
        const cand = new Date(base);
        cand.setDate(cand.getDate() + d);
        cand.setHours(h, m, 0, 0);
        const baseScore = scoreFor(req.category, cand, false); // 0..99
        const closeness = Math.abs(baseScore - bias);
        if (closeness < bestScore) {
          bestScore = closeness;
          bestStart = cand;
        }
      }
    }
  }
  const end = new Date(bestStart.getTime() + req.durationMinutes * 60_000);
  return { start: bestStart, end };
}

export function scheduleWorstForProfile(
  req: ScheduleRequest,
  profile: UserAstroProfile,
  existing: ScheduledEvent[] = []
): { event: ScheduledEvent; conflictWith?: ScheduledEvent } {
  const { primary, secondary } = pickBacking(req.category, true);
  const { start, end } = suggestWorstWindowForProfile(req, profile);
  const score = scoreFor(req.category, start, true);
  const mood = primary.mood;
  const backing = `${primary.planet} with a wink from ${secondary.planet}`;
  const newEvent: ScheduledEvent = {
    id: Math.random().toString(36).slice(2),
    title: req.title,
    start,
    end,
    category: req.category,
    mood,
    backing,
    score,
    excuse: excuseFor(req.title, req.category, primary.planet),
  };
  const conflictWith = existing.find(e => !(end <= e.start || start >= e.end));
  return { event: newEvent, conflictWith };
}
