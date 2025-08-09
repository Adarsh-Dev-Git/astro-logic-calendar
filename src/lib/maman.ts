export type MamanContext = "schedule" | "good" | "chaos" | "retrograde" | "conflict";

function pick<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

const LINES: Record<MamanContext, string[]> = {
  schedule: [
    "Ayyo! Ee samayam meeting vechal sheri aavilla, Shani anallo!",
    "Ithu plan cheytho? Nalla thalamurakal aanallo ningal.",
  ],
  good: [
    "Ninte oru yogam! Jupiter anugrahichu. Ee time-il salary hike chodichal, kittum ketto!",
  ],
  chaos: [
    "Besh! Ellam kolamakkan vendi thanne vechalle? Nannayi varumm...",
  ],
  retrograde: [
    "Mone, Mercury retrograde aanu. Phone okke vechittu poyi oru chaya kudikku.",
    "Ippo oru karyavum nadakkilla, shanthamayi iru.",
  ],
  conflict: [
    "Saranam Ayyappa! Rendu karyam orumichu vecho? Nadakkana karyam vallathum cheyyu, please.",
  ],
};

export function isRetrogradeMock(date = new Date()) {
  // Cute fake: treat the middle third of each month as "retrograde"
  const d = date.getDate();
  return d >= 10 && d <= 20;
}

export async function speakMaman(context: MamanContext) {
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(pick(LINES[context]));
  // Try to find an Indian English/Malayalam-flavored voice if available
  const voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
    const ready = () => resolve(window.speechSynthesis.getVoices());
    const list = window.speechSynthesis.getVoices();
    if (list.length) resolve(list);
    else window.speechSynthesis.onvoiceschanged = ready;
  });
  const preferred = voices.find(v => /en-IN|ml_IN|India/i.test(v.lang)) || voices[0];
  if (preferred) utter.voice = preferred;
  utter.rate = 0.95;
  utter.pitch = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
