import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const stoicQuotes = [
  { text: "You have power over your mind, not outside events.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "He who is brave is free.", author: "Seneca" },
  { text: "It's not what happens to you, but how you react that matters.", author: "Epictetus" },
  { text: "Make the best use of what is in your power, and take the rest as it happens.", author: "Epictetus" },
  { text: "No person has the power to have everything they want, but it is in their power not to want what they don't have.", author: "Seneca" },
  { text: "Confine yourself to the present.", author: "Marcus Aurelius" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
  { text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca" },
];

const HABITS = [
  { id: "playbook", label: "Trading Playbook", sub: "1 playbook review", icon: "📈", type: "daily", group: "trading" },
  { id: "market_scan", label: "Market Scan", sub: "Universe prep", icon: "🔭", type: "daily", group: "trading" },
  { id: "read", label: "Read", sub: "5–10 pages", icon: "📖", type: "daily", group: "mind" },
  { id: "journal", label: "Daily Journal", sub: "Reflect & log", icon: "✍️", type: "daily", group: "mind" },
  { id: "walk", label: "Daily Walk", sub: "Get outside", icon: "🚶", type: "daily", group: "body" },
  { id: "eat_clean", label: "Eat Clean", sub: "Within calorie limits", icon: "🥗", type: "daily", group: "body" },
  { id: "train", label: "Train", sub: "2–4× this week", icon: "🏋️", type: "weekly", group: "body" },
  { id: "phone_limits", label: "Phone Limits", sub: "Morning + afternoon only", icon: "📵", type: "daily", group: "screen" },
  { id: "screen_off", label: "Screen Off Time", sub: "No screens after cutoff", icon: "🌙", type: "daily", group: "screen" },
  { id: "trade_review", label: "Weekly Trade Review", sub: "Sundays", icon: "📋", type: "weekly", group: "trading" },
];

const modeConfig = {
  trading: { label: "Trading Mode", color: "#22c55e", bg: "rgba(34,197,94,0.1)", desc: "YouTube & X unlocked as work tools" },
  off: { label: "Off Mode", color: "#f97316", bg: "rgba(249,115,22,0.1)", desc: "Screen drift tracking active" },
};

const groupColors = { trading: "#60a5fa", mind: "#a78bfa", body: "#34d399", screen: "#f87171" };
const groupLabels = { trading: "Trading", mind: "Mind", body: "Body", screen: "Screen" };

function getToday() {
  return new Date().toISOString().split("T")[0];
}
function getDayOfWeek() {
  return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
}
function getDate() {
  return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

// ─── Login Screen ───────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif",
    }}>
      <div style={{ maxWidth: 400, width: "100%", padding: "0 24px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 24, color: "#f5f3ee", fontWeight: "normal", margin: "0 0 8px" }}>
            Habit OS
          </h1>
          <p style={{ fontSize: 12, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
            Your daily discipline system
          </p>
        </div>

        {!sent ? (
          <>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 20, lineHeight: 1.6 }}>
              Enter your email — we'll send you a magic link. No password needed.
            </p>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 8,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#f5f3ee", fontSize: 14, fontFamily: "'Georgia', serif",
                outline: "none", boxSizing: "border-box", marginBottom: 12,
              }}
            />
            {error && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 12 }}>{error}</p>}
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%", padding: "12px", borderRadius: 8,
                background: loading ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)", color: "#f5f3ee",
                fontSize: 13, fontFamily: "'Georgia', serif", cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.05em",
              }}
            >
              {loading ? "Sending..." : "Send Magic Link →"}
            </button>
          </>
        ) : (
          <div style={{
            padding: "20px 24px", borderRadius: 8, background: "rgba(34,197,94,0.06)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}>
            <p style={{ color: "#22c55e", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
              ✓ Link sent to <strong>{email}</strong><br />
              <span style={{ color: "#555", fontSize: 12 }}>Check your inbox and click the link to sign in.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
function HabitApp({ user }) {
  const [quote] = useState(() => stoicQuotes[new Date().getDate() % stoicQuotes.length]);
  const [mode, setMode] = useState("trading");
  const [checked, setChecked] = useState({});
  const [animating, setAnimating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  // Load today's habit logs from Supabase
  useEffect(() => {
    const loadHabits = async () => {
      const { data, error } = await supabase
        .from("habit_logs")
        .select("habit_id, completed")
        .eq("user_id", user.id)
        .eq("date", getToday());

      if (!error && data) {
        const map = {};
        data.forEach(row => { map[row.habit_id] = row.completed; });
        setChecked(map);
      }
      setLoading(false);
    };
    loadHabits();
  }, [user.id]);

  const toggle = async (habitId) => {
    const newVal = !checked[habitId];
    setAnimating(habitId);
    setTimeout(() => setAnimating(null), 400);
    setChecked(prev => ({ ...prev, [habitId]: newVal }));
    setSaving(habitId);

    // Upsert into Supabase
    const { error } = await supabase
      .from("habit_logs")
      .upsert({
        user_id: user.id,
        habit_id: habitId,
        date: getToday(),
        completed: newVal,
      }, { onConflict: "user_id,habit_id,date" });

    if (error) {
      console.error("Save error:", error);
      // Revert on error
      setChecked(prev => ({ ...prev, [habitId]: !newVal }));
    }
    setSaving(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const completed = Object.values(checked).filter(Boolean).length;
  const total = HABITS.length;
  const pct = Math.round((completed / total) * 100);

  const grouped = HABITS.reduce((acc, h) => {
    acc[h.group] = acc[h.group] || [];
    acc[h.group].push(h);
    return acc;
  }, {});

  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f", display: "flex",
      alignItems: "center", justifyContent: "center",
      color: "#444", fontFamily: "'Georgia', serif", fontSize: 13, letterSpacing: "0.1em",
    }}>
      Loading your day...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e6e0", fontFamily: "'Georgia', serif", padding: "0 0 60px" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.4,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
      }} />

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ paddingTop: 40, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#666", textTransform: "uppercase", marginBottom: 6 }}>
                {getDayOfWeek()} · {getDate()}
              </div>
              <h1 style={{ fontSize: 28, fontWeight: "normal", margin: 0, letterSpacing: "-0.02em", color: "#f5f3ee" }}>
                Today
              </h1>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              {/* Mode Toggle */}
              <div style={{ display: "flex", gap: 6 }}>
                {Object.entries(modeConfig).map(([key, cfg]) => (
                  <button key={key} onClick={() => setMode(key)} style={{
                    padding: "6px 14px", borderRadius: 20,
                    border: mode === key ? `1px solid ${cfg.color}` : "1px solid rgba(255,255,255,0.1)",
                    background: mode === key ? cfg.bg : "transparent",
                    color: mode === key ? cfg.color : "#555",
                    fontSize: 11, fontFamily: "'Georgia', serif",
                    letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.2s",
                  }}>
                    {cfg.label}
                  </button>
                ))}
              </div>
              {/* Sign out */}
              <button onClick={handleSignOut} style={{
                background: "none", border: "none", color: "#333", fontSize: 10,
                cursor: "pointer", letterSpacing: "0.08em", fontFamily: "'Georgia', serif",
                textTransform: "uppercase",
              }}>
                Sign out
              </button>
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: modeConfig[mode].color, opacity: 0.7, letterSpacing: "0.05em" }}>
            {modeConfig[mode].desc}
          </div>
        </div>

        {/* Stoic Quote */}
        <div style={{
          margin: "28px 0", padding: "20px 24px",
          borderLeft: "2px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.02)", borderRadius: "0 8px 8px 0",
        }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#c8c4bc", fontStyle: "italic", letterSpacing: "0.01em" }}>
            "{quote.text}"
          </p>
          <p style={{ margin: "10px 0 0", fontSize: 11, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            — {quote.author}
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>Daily Progress</span>
            <span style={{ fontSize: 11, color: pct === 100 ? "#22c55e" : "#666" }}>{completed}/{total} · {pct}%</span>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
            <div style={{
              height: "100%", borderRadius: 2,
              background: pct === 100 ? "#22c55e" : "linear-gradient(90deg, #60a5fa, #a78bfa)",
              width: `${pct}%`, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
        </div>

        {/* Habit Groups */}
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} style={{ marginBottom: 28 }}>
            <div style={{
              fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
              color: groupColors[group], marginBottom: 10, opacity: 0.7,
            }}>
              {groupLabels[group]}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {items.map(habit => {
                const done = checked[habit.id];
                const isAnim = animating === habit.id;
                const isSaving = saving === habit.id;
                const rgb = groupColors[group].match(/\d+/g)?.slice(0, 3).join(',') || "255,255,255";
                return (
                  <div key={habit.id} onClick={() => !isSaving && toggle(habit.id)} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "13px 16px", borderRadius: 8,
                    background: done ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)",
                    border: done ? `1px solid rgba(${rgb}, 0.2)` : "1px solid rgba(255,255,255,0.04)",
                    cursor: isSaving ? "wait" : "pointer",
                    transition: "all 0.2s",
                    transform: isAnim ? "scale(0.98)" : "scale(1)",
                    userSelect: "none", opacity: isSaving ? 0.6 : 1,
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                      border: done ? `1.5px solid ${groupColors[group]}` : "1.5px solid rgba(255,255,255,0.15)",
                      background: done ? groupColors[group] : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s", fontSize: 11,
                    }}>
                      {done && <span style={{ color: "#0a0a0f", fontWeight: "bold" }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 16, opacity: done ? 1 : 0.5 }}>{habit.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: done ? "#f5f3ee" : "#888", transition: "color 0.2s" }}>
                        {habit.label}
                      </div>
                      <div style={{ fontSize: 11, color: done ? "#555" : "#444", marginTop: 1 }}>
                        {habit.sub}
                      </div>
                    </div>
                    {habit.type === "weekly" && (
                      <span style={{
                        fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
                        color: groupColors[group], padding: "2px 7px", borderRadius: 10,
                        border: `1px solid ${groupColors[group]}`, opacity: 0.5,
                      }}>
                        weekly
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{
          marginTop: 16, padding: "14px 16px", borderRadius: 8,
          background: mode === "off" ? "rgba(249,115,22,0.05)" : "rgba(34,197,94,0.04)",
          border: `1px solid ${mode === "off" ? "rgba(249,115,22,0.15)" : "rgba(34,197,94,0.12)"}`,
          fontSize: 11, color: "#555", letterSpacing: "0.04em", lineHeight: 1.6,
        }}>
          {mode === "off"
            ? "🔴  Off Mode — YouTube & X drift will be logged if accessed"
            : "🟢  Trading Mode — platforms available. Switch to Off Mode when done."}
        </div>

      </div>
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f", display: "flex",
      alignItems: "center", justifyContent: "center",
      color: "#333", fontFamily: "'Georgia', serif", fontSize: 13,
    }}>
      ...
    </div>
  );

  return session ? <HabitApp user={session.user} /> : <LoginScreen />;
}