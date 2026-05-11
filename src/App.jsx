import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const EGS_LEVELS = [
  { id: 1,  name: "Joy / Appreciation / Empowered",  emoji: "✨", color: "#F5C842", textColor: "#2a1a00", tier: "high", description: "You are in full alignment. Life feels expansive, easy, and electric.", action: "Amplify this. Write down what got you here — this is your blueprint." },
  { id: 2,  name: "Love / Gratitude",                emoji: "💛", color: "#F7D76B", textColor: "#2a1a00", tier: "high", description: "Your heart is open. You're connected to what matters most.",          action: "Send appreciation — to yourself, to someone you love, to life itself." },
  { id: 3,  name: "Enthusiasm / Passion",            emoji: "🔥", color: "#F9A03F", textColor: "#fff",    tier: "high", description: "Energy is moving through you. Something wants to be created.",         action: "Channel it — start the thing, move the body, make the call." },
  { id: 4,  name: "Positive Expectation / Belief",   emoji: "🌤", color: "#6DC8E0", textColor: "#fff",    tier: "high", description: "You trust the unfolding. Good things are coming and you know it.",    action: "Affirm it. Write: 'I trust that…' and let it flow." },
  { id: 5,  name: "Optimism",                        emoji: "🌈", color: "#79C99E", textColor: "#fff",    tier: "mid",  description: "You're leaning toward the light, even if things aren't perfect yet.", action: "Look for one piece of evidence that things are working out." },
  { id: 6,  name: "Hopefulness",                     emoji: "🌱", color: "#A8D8A8", textColor: "#1a3a1a", tier: "mid",  description: "The seed of possibility is here. You can feel it, even if faintly.", action: "Tend the seed. Ask: what small step would feel like hope in action?" },
  { id: 7,  name: "Contentment",                     emoji: "🍃", color: "#B5C9A0", textColor: "#1a3a1a", tier: "mid",  description: "Quiet okayness. A neutral resting place.",                          action: "Rest here without guilt. Contentment is valid. Notice what's right." },
  { id: 8,  name: "Boredom",                         emoji: "😑", color: "#C4B8A0", textColor: "#2a2218", tier: "mid",  description: "Your soul wants more aliveness than this moment offers.",            action: "Ask: what tiny thing would make right now more interesting?" },
  { id: 9,  name: "Pessimism",                       emoji: "☁️", color: "#9DAAB5", textColor: "#fff",    tier: "low",  description: "Doubt is creeping in. The glass is feeling half empty.",            action: "Don't push. Ask: is this true, or is this fear talking?" },
  { id: 10, name: "Frustration / Irritation",        emoji: "😤", color: "#D4956A", textColor: "#fff",    tier: "low",  description: "Something isn't working and your system is signaling it.",          action: "Name it: 'I'm frustrated because I care about…'" },
  { id: 11, name: "Overwhelm",                       emoji: "🌊", color: "#7B9EC4", textColor: "#fff",    tier: "low",  description: "Too much, too fast. Your nervous system is asking for space.",       action: "One breath. One thing. What's the smallest next right step?" },
  { id: 12, name: "Disappointment",                  emoji: "🌧", color: "#8E9BB5", textColor: "#fff",    tier: "low",  description: "Expectation met reality and they didn't match.",                    action: "Grieve a little. Then: what did I learn about what I want?" },
  { id: 13, name: "Doubt",                           emoji: "🌀", color: "#A090B8", textColor: "#fff",    tier: "low",  description: "Your confidence wobbled. You're questioning yourself.",             action: "Return to evidence. List 3 times you figured it out anyway." },
  { id: 14, name: "Worry",                           emoji: "😟", color: "#B89898", textColor: "#fff",    tier: "low",  description: "Your mind is rehearsing problems that haven't happened yet.",       action: "What's the worst, best, and most likely? Then breathe." },
  { id: 15, name: "Blame",                           emoji: "👉", color: "#C4836A", textColor: "#fff",    tier: "low",  description: "Pain is being directed outward. It's a signal, not a solution.",   action: "Turn gently inward: what do I actually need right now?" },
  { id: 16, name: "Discouragement",                  emoji: "🥀", color: "#B87878", textColor: "#fff",    tier: "low",  description: "The effort feels like it isn't paying off.",                        action: "Rest, not quit. What would feel like genuine self-care today?" },
  { id: 17, name: "Anger",                           emoji: "🌋", color: "#D45A4A", textColor: "#fff",    tier: "low",  description: "Something violated a value. Anger shows what you care about.",      action: "Feel it fully (safely). What boundary or truth needs voice?" },
  { id: 18, name: "Revenge",                         emoji: "⚡", color: "#B84040", textColor: "#fff",    tier: "low",  description: "A raw, reactive state. You've been hurt and want it to matter.",    action: "Journal it, don't send it. This feeling deserves compassion." },
  { id: 19, name: "Hatred / Rage",                   emoji: "🔴", color: "#922020", textColor: "#fff",    tier: "low",  description: "Deep, powerful pain expressing itself as intense emotion.",         action: "Reach for support — a trusted person, a walk, a breath." },
  { id: 20, name: "Jealousy",                        emoji: "💚", color: "#5A8A6A", textColor: "#fff",    tier: "low",  description: "You see something in another that you want.",                       action: "Reframe: 'Their success shows me what's possible for me too.'" },
  { id: 21, name: "Insecurity / Unworthiness",       emoji: "🪞", color: "#9080A8", textColor: "#fff",    tier: "low",  description: "The inner critic is loud. You're forgetting your own enoughness.",  action: "Hand on heart. Whisper: I am enough. Right now. As I am." },
  { id: 22, name: "Fear / Grief / Despair",          emoji: "🌑", color: "#504060", textColor: "#fff",    tier: "low",  description: "The heaviest place. The contrast is sharpest here.",                action: "You don't have to climb out today. Reach for one better thought." },
];

const PROCESSES = [
  { id: "rampage",    name: "Rampage of Appreciation", emoji: "💛", color: "#F7D76B", tagline: "Flood your field with gratitude",       tiers: ["high","mid"],       type: "freeflow",
    description: "A flowing stream of thankfulness — keep reaching for more things to appreciate, building momentum until you're vibrating at a new level.",
    steps: [
      { prompt: "Start anywhere. What's one thing — no matter how small — that you genuinely appreciate right now?", placeholder: "I appreciate…" },
      { prompt: "Keep going. Reach for another. Let it be easy.", placeholder: "And I appreciate…" },
      { prompt: "Notice how you feel. Reach for more.", placeholder: "I also love and appreciate…" },
      { prompt: "You're building momentum now. What else?", placeholder: "More appreciation flows for…" },
      { prompt: "Last one — make it big or tiny. Both work.", placeholder: "And finally, I appreciate…" },
    ],
    completion: "That's a rampage. You just shifted your point of attraction. Notice the lightness." },

  { id: "placemat",   name: "The Placemat Process",    emoji: "📋", color: "#79C99E", tagline: "Delegate to the Universe",              tiers: ["mid","low"],        type: "twoColumn",
    description: "Divide your to-do list into two columns: what YOU will do today, and what you're handing to the Universe.",
    leftLabel: "My job today", leftPlaceholder: "Things I'll actually take action on…",
    rightLabel: "Universe's job", rightPlaceholder: "Things I'm releasing and trusting…",
    completion: "You've drawn a clean line. Work your column with confidence and truly release the other." },

  { id: "pivot",      name: "The Pivot Practice",      emoji: "🔄", color: "#6DC8E0", tagline: "Turn contrast into clarity",            tiers: ["low","mid"],        type: "pivot",
    description: "Every unwanted thing tells you what you DO want. Transform contrast into rocket fuel for manifestation.",
    steps: [
      { label: "What don't you want?",                    prompt: "Name what's bothering you. Be honest.",                                   placeholder: "I don't want / I don't like…" },
      { label: "What do you DO want?",                    prompt: "Flip it. What does this contrast reveal you're reaching for?",             placeholder: "What I really want is…" },
      { label: "How would having that feel?",             prompt: "Drop into the feeling of having what you want.",                           placeholder: "Having this would feel like…" },
      { label: "One aligned action or thought",           prompt: "What small step or shift moves you toward what you want?",                 placeholder: "One thing I can do or think right now…" },
    ],
    completion: "You just transformed contrast into clarity. That desire is now activated in your vibrational field." },

  { id: "wibni",      name: "Wouldn't It Be Nice If…", emoji: "🌠", color: "#A090B8", tagline: "Soften your way into possibility",      tiers: ["low","mid"],        type: "freeflow",
    description: "When desire feels too big or tense, this gentle phrase opens the door without pressure.",
    steps: [
      { prompt: "Start gently. What's something you'd love but feels a little out of reach?", placeholder: "Wouldn't it be nice if…" },
      { prompt: "Keep the softness. Reach for another possibility.",                          placeholder: "Wouldn't it be nice if…" },
      { prompt: "Let it get a little bigger. Stay playful.",                                  placeholder: "Wouldn't it be nice if…" },
      { prompt: "One more. Notice how your body feels as you write this.",                    placeholder: "Wouldn't it be nice if…" },
    ],
    completion: "Desires stated softly are received most fully. These are now in motion." },

  { id: "scripting",  name: "Scripting",                emoji: "✍️", color: "#D4956A", tagline: "Write your life into existence",        tiers: ["high","mid"],       type: "freeflow",
    description: "Write about your desired life as if it's already happening — present tense, first person, full feeling.",
    steps: [
      { prompt: "Set the scene. Where are you, what's the date, what's happening?",          placeholder: "It's a beautiful morning and I am…" },
      { prompt: "Describe the details. What do you see, feel, hear?",                        placeholder: "I notice how…" },
      { prompt: "What are you thinking and feeling in this scene?",                           placeholder: "I feel so…" },
      { prompt: "Close your script with gratitude for this reality.",                         placeholder: "I'm so grateful that…" },
    ],
    completion: "You've written a scene your subconscious will work to match. Read this again before sleep." },

  { id: "focuswheel", name: "Focus Wheel",              emoji: "🎯", color: "#B5C9A0", tagline: "Build belief one spoke at a time",      tiers: ["mid","low"],        type: "focuswheel",
    description: "Build a bridge from where you are to where you want to be — 12 genuine statements that move you closer.",
    completion: "You've built a vibrational bridge. Genuine belief is everything." },

  { id: "intention",  name: "Intention Setting",         emoji: "🕯", color: "#C4A8D4", tagline: "Direct your energy with purpose",       tiers: ["high","mid","low"], type: "freeflow",
    description: "An intention isn't a goal — it's a declaration of how you choose to show up. Setting one anchors your energy before the day, a conversation, or a creative session.",
    steps: [
      { prompt: "What is one area of your life, work, or day you want to bring focused energy to right now?", placeholder: "I'm focusing my energy on…" },
      { prompt: "What is your intention for this? Finish this sentence: 'I intend to…' — let it be a feeling as much as an action.", placeholder: "I intend to…" },
      { prompt: "What would it look like if this intention were fully expressed today? Describe the version of you who is living it.", placeholder: "When I'm fully in this intention, I am…" },
      { prompt: "Choose one word to carry with you as an anchor for this intention.", placeholder: "My word is…" },
    ],
    completion: "Your intention is set. Return to your anchor word whenever you feel pulled off center." },

  { id: "morning-pages", name: "Morning Pages",          emoji: "🌅", color: "#F9C784", tagline: "Clear the mental clutter",              tiers: ["high","mid","low"], type: "freeflow",
    description: "Morning Pages are three stream-of-consciousness entries written without editing or filtering. They clear the mental static so your true voice and clarity can emerge.",
    steps: [
      { prompt: "Page 1 — Just start writing. Don't edit, don't filter. Whatever is in your head right now, pour it out.", placeholder: "Right now I'm thinking about…" },
      { prompt: "Page 2 — Keep going. What's beneath the surface? What are you really feeling, wanting, or avoiding?", placeholder: "Underneath all of that…" },
      { prompt: "Page 3 — What wants to emerge now that the noise has cleared? What do you know that you didn't know before you started?", placeholder: "What I know now is…" },
    ],
    completion: "The clutter is cleared. What remains is you — your real thoughts, your real voice, your real knowing." },

  { id: "future-self", name: "Future Self Letter",        emoji: "💌", color: "#A8C8E8", tagline: "Receive wisdom from who you're becoming", tiers: ["high","mid","low"], type: "freeflow",
    description: "Your future self — the one who has already figured it out — has a message for you. This process invites you to write that letter, dropping into the wisdom of who you're becoming.",
    steps: [
      { prompt: "Set the scene. Your future self is writing to you from 1, 3, or 5 years from now — a version of you who has arrived. Where are they? What does their life look like?", placeholder: "Dear [your name], I'm writing to you from…" },
      { prompt: "What does your future self most want you to know right now? What do they wish they had trusted sooner?", placeholder: "What I want you to know is…" },
      { prompt: "What does your future self want to tell you about the worry, doubt, or struggle you're currently holding?", placeholder: "About what you're going through right now…" },
      { prompt: "How does your future self close the letter? What is their final encouragement, reminder, or loving nudge?", placeholder: "With all my love, I want to leave you with this…" },
    ],
    completion: "That wisdom was always yours. Your future self is not a stranger — they are the you that already knows." },

  { id: "positive-aspects", name: "Positive Aspects",    emoji: "🔍", color: "#88C9A0", tagline: "Find the gold in any situation",        tiers: ["mid","low"],        type: "freeflow",
    description: "The Positive Aspects process trains your mind to find what's working — in a person, situation, or area of life that feels heavy. What you look for, you find more of.",
    steps: [
      { prompt: "Name the person, situation, or area of life you want to work with. Be specific.", placeholder: "I'm focusing on…" },
      { prompt: "List every positive aspect you can genuinely find. Don't force it — find what's real. Start small if you need to.", placeholder: "One positive aspect is…" },
      { prompt: "Go deeper. What has this person or situation given you, taught you, or made possible?", placeholder: "Because of this, I have…" },
      { prompt: "What is one thing you can appreciate about this right now that you couldn't see before?", placeholder: "Something I can genuinely appreciate now is…" },
    ],
    completion: "You just rewired your point of focus. What you appreciate, appreciates." },

  { id: "the-grid",   name: "The Grid",                  emoji: "⚡", color: "#B0A8D4", tagline: "Shift your beliefs one truth at a time", tiers: ["mid","low"],        type: "freeflow",
    description: "The Grid helps you neutralize a charged belief by finding the general positive principle behind what you want — then building evidence that it's already true in other areas of your life.",
    steps: [
      { prompt: "What is the belief or situation that feels heavy or stuck right now?", placeholder: "The belief or situation I want to shift is…" },
      { prompt: "What is the general positive principle or feeling at the heart of what you want? (e.g. 'Things work out for me', 'I am supported', 'Good things come to me')", placeholder: "The positive principle I'm reaching for is…" },
      { prompt: "Find 3 areas of your life where this principle is ALREADY true. Be specific — pull from real experiences.", placeholder: "Evidence that this is already true: In my [area], I can see that…" },
      { prompt: "How does it feel to recognize this evidence? What becomes possible when you hold this as true?", placeholder: "When I accept this as already true, I feel…" },
    ],
    completion: "The grid is activated. A belief shifts when evidence outweighs doubt — and you just built that evidence." },

  { id: "gratitude",  name: "Gratitude List",           emoji: "🙏", color: "#F5C842", tagline: "The fastest frequency shift",           tiers: ["high","mid","low"], type: "list",
    description: "List what you're grateful for. Specificity creates more momentum than generality.",
    prompt: "List everything you're grateful for today. Be specific. Let it surprise you.",
    placeholder: "I'm grateful for…", minItems: 5,
    completion: "Gratitude is the great equalizer. Your frequency just rose." },
];

const VISION_CATEGORIES = [
  { id: "life",          label: "Life & Lifestyle",      emoji: "🏡", color: "#F9A03F", prompt: "Describe your ideal day, your home, how you spend your time…" },
  { id: "work",          label: "Work & Purpose",        emoji: "✨", color: "#F5C842", prompt: "Describe your work, your impact, how it feels to do what you love…" },
  { id: "relationships", label: "Love & Relationships",  emoji: "💛", color: "#F7D76B", prompt: "Describe the quality of your relationships, how you feel loved…" },
  { id: "health",        label: "Health & Vitality",     emoji: "🌿", color: "#79C99E", prompt: "Describe how your body feels, your energy, your wellness practices…" },
  { id: "abundance",     label: "Abundance & Freedom",   emoji: "🌊", color: "#6DC8E0", prompt: "Describe your financial freedom, what you have, what you give…" },
];

// ─── STORAGE ──────────────────────────────────────────────────────────────────

function ls(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; } }
function todayKey() { return new Date().toISOString().split("T")[0]; }
function weekDates() {
  const today = new Date(); const day = today.getDay();
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() - day + i); return d; });
}
function dKey(d) { return d.toISOString().split("T")[0]; }

// ─── IMAGE UTILS ──────────────────────────────────────────────────────────────

function compressImage(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width: w, height: h } = img;
        const max = 700;
        if (w > max || h > max) { if (w > h) { h = Math.round(h * max / w); w = max; } else { w = Math.round(w * max / h); h = max; } }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        let q = 0.78, result = canvas.toDataURL("image/jpeg", q);
        while (result.length > 200 * 1024 * 1.37 && q > 0.3) { q -= 0.08; result = canvas.toDataURL("image/jpeg", q); }
        resolve(result);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const C = {
  app: { minHeight: "100vh", background: "#0C0B14", color: "#EAE8FF", fontFamily: "'Lora', Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "80px", position: "relative", overflow: "hidden" },
  grain: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`, backgroundSize: "200px" },
  glow: (color) => ({ position: "fixed", top: "-220px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, ${color}0C 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0, transition: "background 0.7s ease" }),
  wrap: (v) => ({ width: "100%", maxWidth: "520px", padding: "0 20px", position: "relative", zIndex: 1, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(14px)", transition: "opacity 0.28s ease, transform 0.28s ease" }),
  nav: { position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(12,11,20,0.96)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "center", zIndex: 100, padding: "0" },
  navBtn: (active, color = "#F5C842") => ({ flex: 1, maxWidth: "120px", padding: "12px 6px 16px", background: "none", border: "none", color: active ? color : "#444466", cursor: "pointer", fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", transition: "color 0.2s" }),
  hdr: { textAlign: "center", padding: "42px 0 20px" },
  ey: (c = "#F5C842") => ({ fontSize: "10px", letterSpacing: "3.5px", textTransform: "uppercase", color: c, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, display: "block", marginBottom: "8px" }),
  h1: { fontSize: "30px", lineHeight: 1.15, margin: "0 0 10px", background: "linear-gradient(135deg,#EAE8FF 0%,#F5C842 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  h2: (c = "#EAE8FF") => ({ fontSize: "22px", color: c, margin: "6px 0 8px", lineHeight: 1.2 }),
  sub: { fontSize: "14px", color: "#7777AA", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65, margin: 0 },
  card: (a) => ({ background: "rgba(255,255,255,0.038)", borderRadius: "20px", border: `1px solid ${a ? a + "2A" : "rgba(255,255,255,0.07)"}`, padding: "22px", marginBottom: "14px", backdropFilter: "blur(10px)" }),
  lbl: (c = "#F5C842") => ({ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: c, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, marginBottom: "10px", display: "block" }),
  btn: (bg = "#F5C842", fg = "#0C0B14") => ({ background: bg, color: fg, border: "none", borderRadius: "14px", padding: "14px 22px", fontSize: "14px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", width: "100%", marginTop: "10px", letterSpacing: "0.3px", transition: "opacity 0.2s" }),
  ghost: (c = "#555570") => ({ background: "transparent", color: c, border: `1px solid ${c}44`, borderRadius: "12px", padding: "11px 18px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", width: "100%", marginTop: "8px" }),
  ta: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "12px", padding: "14px", color: "#EAE8FF", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", resize: "none", lineHeight: 1.7, outline: "none", boxSizing: "border-box", minHeight: "100px" },
  inp: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "12px", padding: "13px 14px", color: "#EAE8FF", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" },
  prog: (pct, c) => ({ height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.07)", marginTop: "8px", overflow: "hidden", children: <div style={{ height: "100%", width: `${pct}%`, background: c, borderRadius: "2px", transition: "width 0.4s ease" }} /> }),
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function ProgressBar({ pct, color }) {
  return (
    <div style={{ height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.07)", marginTop: "8px" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "2px", transition: "width 0.4s ease" }} />
    </div>
  );
}

function BackBtn({ onClick, label = "← Back", color = "#555570" }) {
  return <button onClick={onClick} style={{ ...C.ghost(color), width: "auto", display: "inline-block", marginBottom: "20px" }}>{label}</button>;
}

// ─── EGS CHECK-IN ─────────────────────────────────────────────────────────────

function EGSCheckin({ egsHistory, onSave, onClose }) {
  const [step, setStep] = useState("pick"); // pick | reflect | action | done
  const [selected, setSelected] = useState(null);
  const [journal, setJournal] = useState("");
  const [v, setV] = useState(true);
  const today = new Date();
  const existing = egsHistory[todayKey()];

  function go(s) { setV(false); setTimeout(() => { setStep(s); setV(true); }, 220); }

  function finish() {
    const entry = { level: selected, journal, ts: Date.now() };
    onSave(entry);
    go("done");
  }

  const tierGroups = [
    { label: "Thriving", color: "#F5C842", tiers: EGS_LEVELS.filter(l => l.tier === "high") },
    { label: "Reaching", color: "#79C99E", tiers: EGS_LEVELS.filter(l => l.tier === "mid") },
    { label: "Navigating", color: "#9DAAB5", tiers: EGS_LEVELS.filter(l => l.tier === "low") },
  ];

  return (
    <div style={C.wrap(v)}>
      <BackBtn onClick={onClose} label="← Home" />

      {step === "pick" && (
        <>
          <span style={C.ey()}>The Sweet Spot Practice · Check-in</span>
          <h2 style={C.h2()}>Where are you right now?</h2>
          <p style={{ ...C.sub, marginBottom: "20px" }}>Choose the feeling that resonates most honestly.</p>

          {tierGroups.map(group => (
            <div key={group.label} style={{ marginBottom: "18px" }}>
              <span style={C.lbl(group.color)}>{group.label}</span>
              {group.tiers.map(level => (
                <div key={level.id} onClick={() => setSelected(level)} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "13px 16px", borderRadius: "14px", cursor: "pointer", background: selected?.id === level.id ? `${level.color}18` : "rgba(255,255,255,0.03)", border: `1px solid ${selected?.id === level.id ? level.color : "rgba(255,255,255,0.06)"}`, marginBottom: "7px", transition: "all 0.2s" }}>
                  <span style={{ fontSize: "18px" }}>{level.emoji}</span>
                  <span style={{ fontSize: "14px", fontFamily: "'DM Sans', sans-serif", flex: 1 }}>{level.name}</span>
                  <span style={{ fontSize: "11px", color: "#444466", fontFamily: "'DM Sans', sans-serif" }}>#{level.id}</span>
                </div>
              ))}
            </div>
          ))}

          <button style={{ ...C.btn(selected?.color || "#F5C842", selected?.textColor || "#0C0B14"), opacity: selected ? 1 : 0.4, marginBottom: "30px" }} onClick={() => selected && go("reflect")}>Continue →</button>
        </>
      )}

      {step === "reflect" && selected && (
        <>
          <span style={C.ey(selected.color)}>Step 2 of 3 · Reflect</span>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "52px", marginBottom: "10px" }}>{selected.emoji}</div>
            <h2 style={C.h2(selected.color)}>{selected.name}</h2>
            <p style={C.sub}>{selected.description}</p>
          </div>
          <div style={C.card(selected.color)}>
            <span style={C.lbl(selected.color)}>Journal prompt</span>
            <p style={{ fontSize: "14px", color: "#AAAACC", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65, marginBottom: "14px" }}>What's really going on beneath this feeling? Write without editing yourself.</p>
            <textarea style={C.ta} rows={5} value={journal} onChange={e => setJournal(e.target.value)} placeholder="Start writing here… even a few words is enough." />
          </div>
          <button style={C.btn(selected.color, selected.textColor)} onClick={() => go("action")}>Continue to Action →</button>
          <button style={C.ghost()} onClick={() => go("pick")}>← Back</button>
        </>
      )}

      {step === "action" && selected && (
        <>
          <span style={C.ey(selected.color)}>Step 3 of 3 · Act</span>
          <h2 style={C.h2()}>Your aligned next step</h2>
          <div style={{ ...C.card(selected.color), marginTop: "8px" }}>
            <span style={C.lbl(selected.color)}>From {selected.name}</span>
            <p style={{ fontSize: "17px", color: "#EAE8FF", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.75, margin: 0 }}>{selected.action}</p>
          </div>
          <div style={C.card()}>
            <span style={C.lbl()}>The path of least resistance</span>
            <p style={{ fontSize: "14px", color: "#AAAACC", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, margin: 0 }}>You don't need to leap to Joy in one day. Reach for the <em>next</em> better-feeling thought. One genuine shift is a victory.</p>
          </div>
          <button style={C.btn(selected.color, selected.textColor)} onClick={finish}>Complete Check-in ✓</button>
          <button style={C.ghost()} onClick={() => go("reflect")}>← Back</button>
        </>
      )}

      {step === "done" && selected && (
        <>
          <div style={{ textAlign: "center", padding: "40px 0 20px" }}>
            <div style={{ fontSize: "52px", marginBottom: "14px" }}>🌟</div>
            <h2 style={C.h2()}>Check-in complete.</h2>
            <p style={{ ...C.sub, fontSize: "15px", marginTop: "8px" }}>You showed up for yourself today. That's everything.</p>
          </div>
          <div style={{ ...C.card(selected.color), textAlign: "center" }}>
            <div style={{ fontSize: "13px", color: "#555570", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>You checked in at</div>
            <div style={{ fontSize: "22px", color: selected.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{selected.emoji} {selected.name}</div>
            {journal && <p style={{ fontSize: "14px", color: "#888899", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", lineHeight: 1.65, margin: "14px 0 0" }}>"{journal.length > 120 ? journal.slice(0, 120) + "…" : journal}"</p>}
          </div>
          <button style={C.btn()} onClick={onClose}>← Back to Home</button>
        </>
      )}
    </div>
  );
}

// ─── PROCESS RUNNER ───────────────────────────────────────────────────────────

function ProcessRunner({ process, onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [twoCol, setTwoCol] = useState({ left: "", right: "" });
  const [listItems, setListItems] = useState([""]);
  const [visionAnswers, setVisionAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [v, setV] = useState(true);

  function go(fn) { setV(false); setTimeout(() => { fn(); setV(true); }, 220); }

  function save() {
    const entry = { processId: process.id, processName: process.name, ts: Date.now(), answers, twoCol, listItems };
    const hist = ls("process_history", []);
    lsSet("process_history", [entry, ...hist].slice(0, 100));
    onComplete && onComplete(entry);
    go(() => setDone(true));
  }

  if (done) return (
    <div style={C.wrap(v)}>
      <div style={{ background: `${process.color}12`, border: `1px solid ${process.color}44`, borderRadius: "18px", padding: "32px 24px", marginBottom: "14px", textAlign: "center" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>{process.emoji}</div>
        <div style={{ fontSize: "20px", color: process.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, marginBottom: "12px" }}>Process Complete</div>
        <p style={{ fontSize: "15px", color: "#CCCCEE", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.75, margin: 0 }}>{process.completion}</p>
      </div>
      <button style={C.btn(process.color)} onClick={onBack}>← Back to Library</button>
    </div>
  );

  const stepBar = (total, current) => (
    <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
      {Array.from({ length: total }, (_, i) => <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i <= current ? process.color : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />)}
    </div>
  );

  if (process.type === "freeflow") {
    const cur = process.steps[step]; const isLast = step === process.steps.length - 1;
    return (
      <div style={C.wrap(v)}>
        <BackBtn onClick={onBack} color={process.color} />
        <span style={C.ey(process.color)}>{process.name} · {step + 1} of {process.steps.length}</span>
        {stepBar(process.steps.length, step)}
        <div style={C.card(process.color)}>
          <p style={{ fontSize: "15px", color: "#EAE8FF", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, margin: "0 0 14px" }}>{cur.prompt}</p>
          <textarea style={C.ta} rows={4} placeholder={cur.placeholder} value={answers[step] || ""} onChange={e => setAnswers(p => ({ ...p, [step]: e.target.value }))} />
        </div>
        <button style={{ ...C.btn(process.color), opacity: answers[step] ? 1 : 0.4 }} onClick={() => { if (!answers[step]) return; isLast ? save() : go(() => setStep(s => s + 1)); }}>{isLast ? "Complete ✓" : "Next →"}</button>
        {step > 0 && <button style={C.ghost()} onClick={() => go(() => setStep(s => s - 1))}>← Back</button>}
      </div>
    );
  }

  if (process.type === "pivot") {
    const cur = process.steps[step]; const isLast = step === process.steps.length - 1;
    return (
      <div style={C.wrap(v)}>
        <BackBtn onClick={onBack} color={process.color} />
        <span style={C.ey(process.color)}>{process.name} · {step + 1} of {process.steps.length}</span>
        {stepBar(process.steps.length, step)}
        <div style={C.card(process.color)}>
          <span style={C.lbl(process.color)}>{cur.label}</span>
          <p style={{ fontSize: "14px", color: "#AAAACC", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65, margin: "0 0 12px" }}>{cur.prompt}</p>
          <textarea style={C.ta} rows={4} placeholder={cur.placeholder} value={answers[step] || ""} onChange={e => setAnswers(p => ({ ...p, [step]: e.target.value }))} />
        </div>
        <button style={{ ...C.btn(process.color), opacity: answers[step] ? 1 : 0.4 }} onClick={() => { if (!answers[step]) return; isLast ? save() : go(() => setStep(s => s + 1)); }}>{isLast ? "Complete ✓" : "Next →"}</button>
        {step > 0 && <button style={C.ghost()} onClick={() => go(() => setStep(s => s - 1))}>← Back</button>}
      </div>
    );
  }

  if (process.type === "twoColumn") return (
    <div style={C.wrap(v)}>
      <BackBtn onClick={onBack} color={process.color} />
      <span style={C.ey(process.color)}>{process.name}</span>
      <p style={{ ...C.sub, marginBottom: "18px" }}>{process.description}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        {[["left", process.leftLabel, process.leftPlaceholder, "#79C99E"], ["right", process.rightLabel, process.rightPlaceholder, "#F5C842"]].map(([side, label, ph, col]) => (
          <div key={side} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "14px", border: `1px solid ${col}30`, padding: "14px" }}>
            <span style={C.lbl(col)}>{side === "right" ? "✨ " : ""}{label}</span>
            <textarea style={{ ...C.ta, minHeight: "160px", fontSize: "13px" }} placeholder={ph} value={twoCol[side]} onChange={e => setTwoCol(p => ({ ...p, [side]: e.target.value }))} />
          </div>
        ))}
      </div>
      <button style={{ ...C.btn(process.color), opacity: (twoCol.left || twoCol.right) ? 1 : 0.4 }} onClick={() => { if (!twoCol.left && !twoCol.right) return; save(); }}>Complete ✓</button>
    </div>
  );

  if (process.type === "focuswheel") return (
    <div style={C.wrap(v)}>
      <BackBtn onClick={onBack} color={process.color} />
      <span style={C.ey(process.color)}>Focus Wheel · {Object.values(answers).filter(Boolean).length} of 12</span>
      <p style={{ ...C.sub, marginBottom: "16px" }}>{process.description}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{ background: answers[i] ? `${process.color}14` : "rgba(255,255,255,0.03)", border: `1px solid ${answers[i] ? process.color + "40" : "rgba(255,255,255,0.06)"}`, borderRadius: "12px", padding: "12px" }}>
            <div style={{ fontSize: "10px", color: "#555570", fontFamily: "'DM Sans', sans-serif", marginBottom: "6px" }}>{i === 0 ? "🎯 Core desire" : `Spoke ${i}`}</div>
            <textarea style={{ ...C.ta, minHeight: "60px", fontSize: "13px", padding: "8px" }} placeholder={i === 0 ? "I want to feel…" : "A true thought…"} value={answers[i] || ""} onChange={e => setAnswers(p => ({ ...p, [i]: e.target.value }))} />
          </div>
        ))}
      </div>
      <button style={{ ...C.btn(process.color), opacity: Object.values(answers).filter(Boolean).length >= 1 ? 1 : 0.4 }} onClick={() => { if (!Object.values(answers).filter(Boolean).length) return; save(); }}>Complete Wheel ✓</button>
    </div>
  );

  if (process.type === "list") return (
    <div style={C.wrap(v)}>
      <BackBtn onClick={onBack} color={process.color} />
      <span style={C.ey(process.color)}>{process.name}</span>
      <p style={{ ...C.sub, marginBottom: "18px" }}>{process.prompt}</p>
      {listItems.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ color: process.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px", minWidth: "20px" }}>{i + 1}.</span>
          <input style={C.inp} placeholder={process.placeholder} value={item} onChange={e => { const n = [...listItems]; n[i] = e.target.value; setListItems(n); }} onKeyDown={e => { if (e.key === "Enter" && item.trim()) setListItems(p => [...p, ""]); }} />
        </div>
      ))}
      <button style={{ ...C.ghost(process.color), width: "auto", display: "inline-block", marginTop: "4px" }} onClick={() => setListItems(p => [...p, ""])}>+ Add another</button>
      <button style={{ ...C.btn(process.color), opacity: listItems.filter(Boolean).length >= (process.minItems || 1) ? 1 : 0.4, marginTop: "16px" }} onClick={() => { if (listItems.filter(Boolean).length < (process.minItems || 1)) return; save(); }}>
        Complete ✓ {listItems.filter(Boolean).length < process.minItems ? `(${process.minItems - listItems.filter(Boolean).length} more needed)` : ""}
      </button>
    </div>
  );

  return null;
}

// ─── VISION BOARD ─────────────────────────────────────────────────────────────

function UploadZone({ onUpload, color, count, max }) {
  const ref = useRef();
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const remaining = max - count;

  async function handleFiles(files) {
    if (!files?.length || remaining <= 0) return;
    setLoading(true);
    const valid = Array.from(files).filter(f => f.type.startsWith("image/")).slice(0, remaining);
    const compressed = await Promise.all(valid.map(compressImage));
    onUpload(compressed);
    setLoading(false);
  }

  if (remaining <= 0) return <div style={{ textAlign: "center", padding: "8px 0", fontSize: "12px", color: "#444466", fontFamily: "'DM Sans', sans-serif" }}>✓ {max}/{max} images added</div>;

  return (
    <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => !loading && ref.current?.click()}
      style={{ border: `2px dashed ${dragging ? color : color + "55"}`, borderRadius: "14px", padding: "22px 16px", textAlign: "center", cursor: loading ? "default" : "pointer", background: dragging ? color + "0A" : "rgba(255,255,255,0.02)", transition: "all 0.2s", marginBottom: "4px" }}>
      <input ref={ref} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
      {loading ? <div style={{ color, fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600 }}>✦ Saving…</div> : (
        <>
          <div style={{ fontSize: "26px", marginBottom: "8px" }}>🖼</div>
          <div style={{ fontSize: "13px", color, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, marginBottom: "3px" }}>Tap to upload · or drag & drop</div>
          <div style={{ fontSize: "11px", color: "#444466", fontFamily: "'DM Sans', sans-serif" }}>{remaining} spot{remaining !== 1 ? "s" : ""} remaining</div>
        </>
      )}
    </div>
  );
}

function VisionCategory({ cat, data, onSave, onBack }) {
  const [images, setImages] = useState(data.images || []);
  const [text, setText] = useState(data.text || "");
  const [saved, setSaved] = useState(false);
  const [v, setV] = useState(false);
  useEffect(() => setTimeout(() => setV(true), 40), []);

  function handleUpload(imgs) { const next = [...images, ...imgs].slice(0, 6); setImages(next); onSave({ images: next, text }); }
  function handleDelete(idx) { const next = images.filter((_, i) => i !== idx); setImages(next); onSave({ images: next, text }); }
  function handleSaveText() { onSave({ images, text }); setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div style={C.wrap(v)}>
      <BackBtn onClick={onBack} label="← Vision Board" color={cat.color} />
      <span style={C.ey(cat.color)}>{cat.emoji} {cat.label}</span>
      <h2 style={C.h2()}>Your {cat.label} Vision</h2>
      <p style={{ ...C.sub, marginBottom: "20px" }}>Images + words together make the vision vivid and real.</p>

      <div style={C.card(cat.color)}>
        <span style={C.lbl(cat.color)}>📸 Vision Images</span>
        {images.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "12px" }}>
            {images.map((src, i) => (
              <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: "10px", overflow: "hidden", border: `1px solid ${cat.color}33` }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={() => handleDelete(i)} style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(12,11,20,0.88)", border: "none", borderRadius: "50%", width: "22px", height: "22px", color: "#EAE8FF", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              </div>
            ))}
          </div>
        )}
        <UploadZone onUpload={handleUpload} color={cat.color} count={images.length} max={6} />
        <p style={{ fontSize: "11px", color: "#333355", fontFamily: "'DM Sans', sans-serif", textAlign: "center", margin: "8px 0 0" }}>Saved to your browser · persists between visits</p>
      </div>

      <div style={C.card(cat.color)}>
        <span style={C.lbl(cat.color)}>✍️ Written Vision</span>
        <p style={{ fontSize: "13px", color: "#7777AA", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65, margin: "0 0 12px" }}>Write in present tense, as if it's already real.</p>
        <textarea style={C.ta} rows={5} placeholder={cat.prompt} value={text} onChange={e => setText(e.target.value)} />
        <button style={C.btn(cat.color)} onClick={handleSaveText}>{saved ? "✓ Saved" : "Save Written Vision"}</button>
      </div>

      {images.length > 0 && text && (
        <div style={{ ...C.card(cat.color), background: `${cat.color}08` }}>
          <span style={C.lbl(cat.color)}>✨ Preview</span>
          <div style={{ display: "grid", gridTemplateColumns: images.length >= 2 ? "1fr 1fr" : "1fr", gap: "8px", marginBottom: "12px" }}>
            {images.slice(0, 2).map((src, i) => <div key={i} style={{ borderRadius: "10px", overflow: "hidden", aspectRatio: "4/3" }}><img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>)}
          </div>
          <p style={{ fontSize: "14px", color: "#CCCCEE", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", lineHeight: 1.75, margin: 0 }}>"{text.length > 180 ? text.slice(0, 180) + "…" : text}"</p>
        </div>
      )}
    </div>
  );
}

function VisionBoard({ board, onSave }) {
  const [active, setActive] = useState(null);
  const [v, setV] = useState(false);
  useEffect(() => setTimeout(() => setV(true), 40), []);

  if (active) return <VisionCategory cat={active} data={board[active.id] || {}} onSave={d => onSave(active.id, d)} onBack={() => setActive(null)} />;

  const totalImgs = VISION_CATEGORIES.reduce((a, c) => a + (board[c.id]?.images?.length || 0), 0);
  const totalText = VISION_CATEGORIES.filter(c => board[c.id]?.text?.trim()).length;
  const complete = VISION_CATEGORIES.filter(c => (board[c.id]?.images?.length > 0) || board[c.id]?.text?.trim()).length;
  const maxImgs = VISION_CATEGORIES.length * 6;

  return (
    <div style={C.wrap(v)}>
      <div style={C.hdr}>
        <span style={C.ey()}>The Sweet Spot Practice · Vision</span>
        <h1 style={C.h1}>See It. Feel It.<br />Call It In.</h1>
        <p style={C.sub}>Build a living picture of the life you're calling in — images and words, side by side.</p>
      </div>

      <div style={C.card()}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", textAlign: "center", marginBottom: "14px" }}>
          {[["Sections", `${complete}/5`, "#F5C842"], ["Images", totalImgs, "#F9A03F"], ["Written", `${totalText}/5`, "#79C99E"]].map(([l, val, c]) => (
            <div key={l}><div style={{ fontSize: "22px", color: c, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{val}</div><div style={{ fontSize: "10px", color: "#444466", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px" }}>{l}</div></div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span style={{ fontSize: "10px", color: "#444466", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "1.5px" }}>Image Storage</span>
          <span style={{ fontSize: "11px", color: totalImgs / maxImgs > 0.8 ? "#D4956A" : "#79C99E", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{totalImgs}/{maxImgs}</span>
        </div>
        <ProgressBar pct={Math.round(totalImgs / maxImgs * 100)} color={totalImgs / maxImgs > 0.8 ? "#D4956A" : "#79C99E"} />
      </div>

      <span style={C.lbl()}>Vision Sections</span>
      {VISION_CATEGORIES.map(cat => {
        const d = board[cat.id] || {};
        const imgs = d.images?.length || 0;
        const hasText = !!d.text?.trim();
        const has = imgs > 0 || hasText;
        return (
          <div key={cat.id} onClick={() => setActive(cat)} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderRadius: "18px", cursor: "pointer", background: has ? `${cat.color}0A` : "rgba(255,255,255,0.03)", border: `1px solid ${has ? cat.color + "40" : "rgba(255,255,255,0.07)"}`, marginBottom: "10px", transition: "all 0.2s" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "12px", flexShrink: 0, overflow: "hidden", background: has ? `${cat.color}20` : "rgba(255,255,255,0.06)", border: `1px solid ${has ? cat.color + "44" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: imgs > 0 ? "0" : "20px" }}>
              {imgs > 0 ? <img src={d.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : cat.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "15px", color: has ? cat.color : "#EAE8FF", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, marginBottom: "3px" }}>{cat.label}</div>
              <div style={{ fontSize: "12px", color: "#444466", fontFamily: "'DM Sans', sans-serif" }}>{imgs > 0 ? `${imgs} image${imgs !== 1 ? "s" : ""}` : "No images yet"}{hasText ? " · written ✓" : ""}</div>
            </div>
            <span style={{ color: cat.color, opacity: has ? 1 : 0.3, fontSize: "18px" }}>→</span>
          </div>
        );
      })}

      <div style={{ ...C.card(), textAlign: "center", padding: "26px 22px" }}>
        <div style={{ fontSize: "26px", marginBottom: "10px" }}>🌟</div>
        <p style={{ fontSize: "14px", color: "#CCCCEE", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", lineHeight: 1.8, margin: "0 0 8px" }}>"A vision board isn't wishful thinking — it's deliberate alignment. Every image, every word, is a signal sent to the Universe."</p>
        <span style={{ fontSize: "12px", color: "#444466", fontFamily: "'DM Sans', sans-serif" }}>— Jaclyn Cruz · The Sweet Spot Life</span>
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────

function Home({ egsHistory, processHistory, visionBoard, onStartCheckin, onOpenProcess, onOpenVision }) {
  const [v, setV] = useState(false);
  useEffect(() => setTimeout(() => setV(true), 40), []);

  const todayEntry = egsHistory[todayKey()];
  const egsLevel = todayEntry?.level;
  const week = weekDates();

  function getFeatured(level) {
    if (!level) return PROCESSES[0];
    if (level.tier === "high") return PROCESSES.find(p => p.id === "rampage");
    if (level.tier === "mid") return PROCESSES.find(p => p.id === "placemat");
    return PROCESSES.find(p => p.id === "pivot");
  }
  const featured = getFeatured(egsLevel);

  return (
    <div style={C.wrap(v)}>
      <div style={C.hdr}>
        <span style={C.ey()}>The Sweet Spot Practice</span>
        <h1 style={C.h1}>Good{new Date().getHours() < 12 ? " morning" : new Date().getHours() < 17 ? " afternoon" : " evening"}.</h1>
        <p style={C.sub}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
      </div>

      {/* EGS Today */}
      <div style={C.card(egsLevel?.color)}>
        <span style={C.lbl(egsLevel?.color || "#F5C842")}>Today's Vibration</span>
        {todayEntry ? (
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ fontSize: "28px" }}>{egsLevel.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "15px", color: egsLevel.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{egsLevel.name}</div>
              <div style={{ fontSize: "12px", color: "#555570", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>EGS Level {egsLevel.id} · Processes matched to your state</div>
            </div>
            <button onClick={onStartCheckin} style={{ background: "none", border: "none", color: "#444466", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>Update</button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: "14px", color: "#666688", fontFamily: "'DM Sans', sans-serif", margin: "0 0 10px" }}>Start your day with a check-in to get personalized process recommendations.</p>
            <button style={C.btn()} onClick={onStartCheckin}>Begin Check-in ✨</button>
          </>
        )}
      </div>

      {/* Week streak */}
      <div style={C.card()}>
        <span style={C.lbl()}>This Week</span>
        <div style={{ display: "flex", gap: "6px", justifyContent: "space-between" }}>
          {week.map((date, i) => {
            const k = dKey(date); const isToday = k === todayKey();
            const egsEntry = egsHistory[k];
            const didProcess = processHistory.some(h => new Date(h.ts).toISOString().split("T")[0] === k);
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                <div style={{ fontSize: "10px", color: isToday ? "#F5C842" : "#333355", fontFamily: "'DM Sans', sans-serif" }}>{"SMTWTFS"[date.getDay()]}</div>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: egsEntry ? egsEntry.level.color + "CC" : (isToday ? "rgba(245,200,66,0.12)" : "rgba(255,255,255,0.04)"), border: isToday ? "2px solid #F5C842" : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>
                  {egsEntry ? egsEntry.level.emoji : ""}
                </div>
                {didProcess && <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#F5C842" }} />}
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: "11px", color: "#333355", fontFamily: "'DM Sans', sans-serif", margin: "10px 0 0", textAlign: "center" }}>Colored circles = check-in · gold dot = process completed</p>
      </div>

      {/* Featured process */}
      {featured && (
        <>
          <span style={C.lbl()}>✨ {egsLevel ? "Recommended for you" : "Featured Practice"}</span>
          <div style={{ ...C.card(featured.color), cursor: "pointer" }} onClick={() => onOpenProcess(featured)}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "30px" }}>{featured.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "15px", color: featured.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, marginBottom: "4px" }}>{featured.name}</div>
                <div style={{ fontSize: "13px", color: "#888899", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>{featured.description.slice(0, 100)}…</div>
              </div>
            </div>
            <button style={C.btn(featured.color)}>Begin This Practice →</button>
          </div>
        </>
      )}

      {/* Vision board teaser */}
      <div style={{ ...C.card(), cursor: "pointer", background: "rgba(249,160,63,0.06)", borderColor: "rgba(249,160,63,0.2)" }} onClick={onOpenVision}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "28px" }}>🖼</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "15px", color: "#F9A03F", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, marginBottom: "3px" }}>Vision Board</div>
            <div style={{ fontSize: "13px", color: "#666688", fontFamily: "'DM Sans', sans-serif" }}>
              {VISION_CATEGORIES.filter(c => (visionBoard[c.id]?.images?.length > 0) || visionBoard[c.id]?.text?.trim()).length} of 5 sections built
            </div>
          </div>
          <span style={{ color: "#F9A03F", fontSize: "18px" }}>→</span>
        </div>
      </div>

      {/* Recent */}
      {processHistory.length > 0 && (
        <>
          <span style={{ ...C.lbl(), marginTop: "4px" }}>Recent Practices</span>
          {processHistory.slice(0, 3).map((h, i) => {
            const p = PROCESSES.find(p => p.id === h.processId); if (!p) return null;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: "9px", cursor: "pointer" }} onClick={() => onOpenProcess(p)}>
                <span style={{ fontSize: "20px" }}>{p.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", color: "#EAE8FF", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: "11px", color: "#444466", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>{new Date(h.ts).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
                <span style={{ color: "#444466" }}>→</span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ─── LIBRARY ──────────────────────────────────────────────────────────────────

function Library({ egsLevel, onOpenProcess }) {
  const [filter, setFilter] = useState("all");
  const [v, setV] = useState(false);
  useEffect(() => setTimeout(() => setV(true), 40), []);

  const filtered = filter === "all" ? PROCESSES : PROCESSES.filter(p => p.tiers.includes(filter));
  const chips = [["all", "All", "#F5C842"], ["high", "Thriving", "#F7D76B"], ["mid", "Reaching", "#79C99E"], ["low", "Navigating", "#9DAAB5"]];

  return (
    <div style={C.wrap(v)}>
      <div style={C.hdr}>
        <span style={C.ey()}>The Sweet Spot Practice · Library</span>
        <h1 style={{ ...C.h1, fontSize: "26px" }}>All Practices</h1>
        <p style={C.sub}>12 processes for every emotional state</p>
      </div>
      <div style={{ display: "flex", gap: "7px", marginBottom: "20px", flexWrap: "wrap" }}>
        {chips.map(([val, label, col]) => (
          <button key={val} onClick={() => setFilter(val)} style={{ padding: "7px 15px", borderRadius: "20px", border: `1px solid ${filter === val ? col : col + "33"}`, background: filter === val ? col + "22" : "transparent", color: filter === val ? col : "#444466", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>{label}</button>
        ))}
      </div>
      {filtered.map(p => (
        <div key={p.id} onClick={() => onOpenProcess(p)} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "18px", borderRadius: "18px", background: "rgba(255,255,255,0.04)", border: `1px solid ${p.color}20`, cursor: "pointer", marginBottom: "10px", transition: "all 0.2s" }}>
          <span style={{ fontSize: "24px" }}>{p.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "15px", color: "#EAE8FF", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, marginBottom: "3px" }}>{p.name}</div>
            <div style={{ fontSize: "12px", color: "#555570", fontFamily: "'DM Sans', sans-serif", marginBottom: "7px" }}>{p.tagline}</div>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {p.tiers.map(t => <span key={t} style={{ padding: "2px 9px", borderRadius: "20px", fontSize: "10px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, background: (t === "high" ? "#F7D76B" : t === "mid" ? "#79C99E" : "#9DAAB5") + "20", color: t === "high" ? "#F7D76B" : t === "mid" ? "#79C99E" : "#9DAAB5", border: `1px solid ${(t === "high" ? "#F7D76B" : t === "mid" ? "#79C99E" : "#9DAAB5")}40` }}>{t === "high" ? "Thriving" : t === "mid" ? "Reaching" : "Navigating"}</span>)}
            </div>
          </div>
          <span style={{ color: p.color, fontSize: "18px" }}>→</span>
        </div>
      ))}
    </div>
  );
}

// ─── JOURNAL ──────────────────────────────────────────────────────────────────

function Journal({ processHistory, egsHistory }) {
  const [v, setV] = useState(false);
  useEffect(() => setTimeout(() => setV(true), 40), []);
  const allEntries = [
    ...processHistory.map(h => ({ ...h, _type: "process" })),
    ...Object.entries(egsHistory).map(([k, e]) => ({ ...e, _type: "egs", dateKey: k })),
  ].sort((a, b) => (b.ts || 0) - (a.ts || 0));

  return (
    <div style={C.wrap(v)}>
      <div style={C.hdr}>
        <span style={C.ey()}>The Sweet Spot Practice · Journal</span>
        <h1 style={{ ...C.h1, fontSize: "26px" }}>Practice History</h1>
        <p style={C.sub}>{allEntries.length} total {allEntries.length === 1 ? "entry" : "entries"}</p>
      </div>
      {allEntries.length === 0 ? (
        <div style={{ ...C.card(), textAlign: "center", padding: "40px 24px" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🌱</div>
          <p style={{ fontSize: "14px", color: "#666688", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65, margin: 0 }}>Your practices will appear here. Begin a check-in or process to build your history.</p>
        </div>
      ) : allEntries.map((entry, i) => {
        if (entry._type === "egs") {
          const l = entry.level;
          return (
            <div key={`egs-${i}`} style={{ ...C.card(l?.color), marginBottom: "12px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "22px" }}>{l?.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", color: l?.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>EGS Check-in · {l?.name}</div>
                  <div style={{ fontSize: "11px", color: "#444466", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>{entry.dateKey} · Level {l?.id}</div>
                </div>
              </div>
              {entry.journal && <p style={{ fontSize: "13px", color: "#888899", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", lineHeight: 1.65, margin: "10px 0 0" }}>"{entry.journal.length > 120 ? entry.journal.slice(0, 120) + "…" : entry.journal}"</p>}
            </div>
          );
        }
        const p = PROCESSES.find(pr => pr.id === entry.processId); if (!p) return null;
        const firstAnswer = Object.values(entry.answers || {})[0] || entry.twoCol?.left || (entry.listItems || []).find(Boolean) || "";
        return (
          <div key={`proc-${i}`} style={{ ...C.card(p.color), marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: firstAnswer ? "10px" : "0" }}>
              <span style={{ fontSize: "22px" }}>{p.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: p.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: "11px", color: "#444466", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>{new Date(entry.ts).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
              </div>
            </div>
            {firstAnswer && <p style={{ fontSize: "13px", color: "#888899", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", lineHeight: 1.65, margin: 0 }}>"{firstAnswer.length > 130 ? firstAnswer.slice(0, 130) + "…" : firstAnswer}"</p>}
          </div>
        );
      })}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("home");
  const [subView, setSubView] = useState(null); // "checkin" | "process" | "vision"
  const [activeProcess, setActiveProcess] = useState(null);
  const [egsHistory, setEgsHistory] = useState({});
  const [processHistory, setProcessHistory] = useState([]);
  const [visionBoard, setVisionBoard] = useState({});
  const [glowColor, setGlowColor] = useState("#F5C842");

  useEffect(() => {
    setEgsHistory(ls("egs_history", {}));
    setProcessHistory(ls("process_history", []));
    setVisionBoard(ls("visionboard_v3", {}));
  }, []);

  const todayEGS = egsHistory[todayKey()];

  function saveEGS(entry) {
    const next = { ...egsHistory, [todayKey()]: entry };
    setEgsHistory(next); lsSet("egs_history", next);
  }

  function saveVision(catId, data) {
    const next = { ...visionBoard, [catId]: data };
    setVisionBoard(next); lsSet("visionboard_v3", next);
  }

  function openProcess(p) { setActiveProcess(p); setSubView("process"); setGlowColor(p.color); }
  function closeProcess() { setSubView(null); setActiveProcess(null); setProcessHistory(ls("process_history", [])); setGlowColor("#F5C842"); }

  const TABS = [
    { id: "home",    icon: "🏠", label: "Home" },
    { id: "library", icon: "📚", label: "Library" },
    { id: "vision",  icon: "🖼",  label: "Vision" },
    { id: "journal", icon: "📓", label: "Journal" },
  ];

  function handleTabChange(t) {
    setSubView(null); setActiveProcess(null);
    setTab(t);
    setGlowColor(t === "vision" ? "#F9A03F" : "#F5C842");
  }

  return (
    <div style={C.app}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={C.grain} />
      <div style={C.glow(glowColor)} />

      {/* Content */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {subView === "checkin" && (
          <EGSCheckin egsHistory={egsHistory} onSave={saveEGS} onClose={() => { setSubView(null); setGlowColor("#F5C842"); }} />
        )}
        {subView === "process" && activeProcess && (
          <ProcessRunner process={activeProcess} onComplete={() => setProcessHistory(ls("process_history", []))} onBack={closeProcess} />
        )}
        {!subView && tab === "home" && (
          <Home egsHistory={egsHistory} processHistory={processHistory} visionBoard={visionBoard}
            onStartCheckin={() => { setSubView("checkin"); setGlowColor(todayEGS?.level?.color || "#F5C842"); }}
            onOpenProcess={openProcess}
            onOpenVision={() => handleTabChange("vision")} />
        )}
        {!subView && tab === "library" && (
          <Library egsLevel={todayEGS?.level} onOpenProcess={openProcess} />
        )}
        {!subView && tab === "vision" && (
          <VisionBoard board={visionBoard} onSave={saveVision} />
        )}
        {!subView && tab === "journal" && (
          <Journal processHistory={processHistory} egsHistory={egsHistory} />
        )}
      </div>

      {/* Bottom Nav */}
      {!subView && (
        <nav style={C.nav}>
          {TABS.map(({ id, icon, label }) => (
            <button key={id} style={C.navBtn(tab === id)} onClick={() => handleTabChange(id)}>
              <span style={{ fontSize: "19px" }}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
