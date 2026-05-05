// Solar Energie Partner — Hi-Fi Prototyp
// Editorial × Technical Hybrid mit drei Theme-Varianten via Tweaks

const D = window.SITE_DATA;
const { useState, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────────────────
// Themes
// ─────────────────────────────────────────────────────────────────────────
const THEMES = {
  editorial: {
    name: "Editorial",
    bg: "#f4f1ea",
    bgAlt: "#ebe6db",
    bgInk: "#15140f",
    ink: "#15140f",
    inkSoft: "#65615a",
    accent: "#d97706", // warmes Bernstein
    accentInk: "#15140f",
    rule: "rgba(21,20,15,0.14)",
    chip: "rgba(21,20,15,0.05)",
    serif: '"Fraunces", Georgia, serif',
    sans: '"Inter", -apple-system, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
  technical: {
    name: "Technical",
    bg: "#0d0e0c",
    bgAlt: "#15170f",
    bgInk: "#0d0e0c",
    ink: "#eef0e6",
    inkSoft: "#8d9286",
    accent: "#c4f04a", // elektrisches Limette/Solar
    accentInk: "#0d0e0c",
    rule: "rgba(238,240,230,0.15)",
    chip: "rgba(238,240,230,0.06)",
    serif: '"Fraunces", Georgia, serif',
    sans: '"Inter", -apple-system, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
  craft: {
    name: "Handwerk",
    bg: "#ece7dc",
    bgAlt: "#dad3c0",
    bgInk: "#1a1814",
    ink: "#1a1814",
    inkSoft: "#5a544a",
    accent: "#a8431f", // Terracotta
    accentInk: "#f7f3eb",
    rule: "rgba(26,24,20,0.16)",
    chip: "rgba(26,24,20,0.05)",
    serif: '"Fraunces", Georgia, serif',
    sans: '"Inter", -apple-system, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Layout primitives
// ─────────────────────────────────────────────────────────────────────────
const Container = ({ children, style }) => (
  <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px", ...style }}>
    {children}
  </div>
);

const Eyebrow = ({ children, t }) => (
  <div style={{
    fontFamily: t.mono, fontSize: 11, letterSpacing: "0.12em",
    textTransform: "uppercase", color: t.inkSoft, fontWeight: 500,
  }}>{children}</div>
);

const Rule = ({ t, style }) => (
  <div style={{ height: 1, background: t.rule, ...style }} />
);

const Tag = ({ children, t, accent }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "4px 10px", borderRadius: 999, fontSize: 11,
    fontFamily: t.mono, letterSpacing: "0.06em", textTransform: "uppercase",
    background: accent ? t.accent : t.chip,
    color: accent ? t.accentInk : t.ink,
    border: accent ? "none" : `0.5px solid ${t.rule}`,
  }}>{children}</span>
);

// "Sun mark" — geometric, not illustrative — used as a subtle brand glyph
const SunMark = ({ size = 28, color, t }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="5" fill={color || t.accent} />
    {[...Array(8)].map((_, i) => {
      const a = (i * Math.PI) / 4;
      const x1 = 14 + Math.cos(a) * 8.5;
      const y1 = 14 + Math.sin(a) * 8.5;
      const x2 = 14 + Math.cos(a) * 12;
      const y2 = 14 + Math.sin(a) * 12;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color || t.accent} strokeWidth="1.5" strokeLinecap="round" />;
    })}
  </svg>
);

// Striped placeholder for missing imagery — labeled in mono
const Placeholder = ({ label, t, ratio = "16 / 10", style, dark }) => (
  <div style={{
    aspectRatio: ratio, width: "100%",
    background: dark
      ? `repeating-linear-gradient(135deg, ${t.bgInk}, ${t.bgInk} 8px, #1c1d18 8px, #1c1d18 16px)`
      : `repeating-linear-gradient(135deg, ${t.bgAlt}, ${t.bgAlt} 8px, ${t.bg} 8px, ${t.bg} 16px)`,
    border: `0.5px solid ${t.rule}`, borderRadius: 4,
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", overflow: "hidden", ...style,
  }}>
    <span style={{
      fontFamily: t.mono, fontSize: 11, color: dark ? "#5a5d50" : t.inkSoft,
      letterSpacing: "0.08em", textTransform: "uppercase",
      background: dark ? "#0d0e0c" : t.bg, padding: "6px 10px",
      border: `0.5px solid ${t.rule}`,
    }}>{label}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────
// Header / Nav
// ─────────────────────────────────────────────────────────────────────────
function Header({ t }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div style={{
        background: t.bgInk, color: t.ink === t.bgInk ? "#eef0e6" : "#f4f1ea",
        fontFamily: t.mono, fontSize: 11, letterSpacing: "0.04em",
        padding: "8px 0",
      }}>
        <Container style={{ display: "flex", justifyContent: "space-between" }}>
          <span>⚡ Neu 2026 · PPA-Stromverträge ohne Kapitaleinsatz</span>
          <span style={{ opacity: 0.7 }}>Vorteil online berechnen →</span>
        </Container>
      </div>
      {/* Sticky header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? `${t.bg}f0` : t.bg,
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `0.5px solid ${t.rule}` : "0.5px solid transparent",
        transition: "all 0.2s",
      }}>
        <Container style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 32px",
        }}>
          <a href="#top" style={{
            display: "flex", alignItems: "center", gap: 10,
            textDecoration: "none", color: t.ink,
          }}>
            <SunMark t={t} size={26} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
              <span style={{ fontFamily: t.serif, fontSize: 19, fontWeight: 500, letterSpacing: "-0.01em" }}>
                Solar Energie Partner
              </span>
              <span style={{ fontFamily: t.mono, fontSize: 9.5, color: t.inkSoft, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Pilsner Vertriebs GmbH · seit 2014
              </span>
            </div>
          </a>
          <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {D.nav.map(n => (
              <a key={n.id} href={`#${n.id}`} style={{
                color: t.ink, textDecoration: "none", fontSize: 13.5,
                fontFamily: t.sans, fontWeight: 450,
              }}
              onMouseOver={e => e.currentTarget.style.color = t.accent}
              onMouseOut={e => e.currentTarget.style.color = t.ink}
              >{n.label}</a>
            ))}
            <a href="#kontakt" style={{
              padding: "10px 18px", background: t.ink, color: t.bg,
              borderRadius: 999, fontSize: 13, fontFamily: t.sans, fontWeight: 500,
              textDecoration: "none", letterSpacing: "0.01em",
            }}>Termin vereinbaren →</a>
          </nav>
        </Container>
      </header>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────
function Hero({ t }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!heroRef.current) return;
      const r = heroRef.current.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - r.left) / r.width - 0.5) * 2,
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      });
    };
    const el = heroRef.current;
    el?.addEventListener("mousemove", onMove);
    return () => el?.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="top" ref={heroRef} style={{ position: "relative", paddingTop: 56, paddingBottom: 40 }}>
      <Container>
        {/* Top metadata strip */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingBottom: 32, borderBottom: `0.5px solid ${t.rule}`, marginBottom: 56,
        }}>
          <Eyebrow t={t}>Bayern · Bundesweit · {new Date().getFullYear()}</Eyebrow>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "end" }}>
          {/* Left: massive headline */}
          <div>
            <Eyebrow t={t}>{D.hero.eyebrow}</Eyebrow>
            <h1 style={{
              fontFamily: t.serif, fontSize: "clamp(56px, 7.5vw, 112px)",
              lineHeight: 0.93, letterSpacing: "-0.035em", fontWeight: 400,
              margin: "24px 0 0", color: t.ink, textWrap: "balance",
            }}>
              {D.hero.title.map((line, i) => (
                <span key={i} style={{ display: "block" }}>
                  {i === D.hero.titleAccent ? (
                    <em style={{
                      fontStyle: "italic", color: t.accent,
                      fontVariationSettings: '"opsz" 144',
                    }}>{line}</em>
                  ) : line}
                </span>
              ))}
            </h1>
            <p style={{
              fontFamily: t.serif, fontSize: 19, lineHeight: 1.5,
              color: t.inkSoft, maxWidth: 480, marginTop: 36, fontWeight: 400,
            }}>{D.hero.sub}</p>
            <div style={{ display: "flex", gap: 14, marginTop: 36 }}>
              <a href="#kontakt" style={{
                padding: "16px 26px", background: t.accent, color: t.accentInk,
                borderRadius: 999, fontFamily: t.sans, fontSize: 14, fontWeight: 500,
                textDecoration: "none", letterSpacing: "0.01em",
              }}>{D.hero.primaryCta} →</a>
              <a href="#ppa" style={{
                padding: "16px 26px", background: "transparent", color: t.ink,
                border: `1px solid ${t.ink}`, borderRadius: 999,
                fontFamily: t.sans, fontSize: 14, fontWeight: 500,
                textDecoration: "none",
              }}>{D.hero.secondaryCta}</a>
            </div>
          </div>

          {/* Right: hero visual + key stat */}
          <div style={{ position: "relative" }}>
            <div style={{
              transform: `translate(${mouse.x * 6}px, ${mouse.y * 4}px)`,
              transition: "transform 0.3s cubic-bezier(.2,.8,.2,1)",
            }}>
              <Placeholder t={t} ratio="4 / 5" label="Hallendach · 380 kWp · Straubing" />
            </div>
            {/* Floating live data card */}
            <div style={{
              position: "absolute", left: -32, bottom: 48, width: 240,
              background: t.bgInk, color: t.ink === t.bgInk ? "#eef0e6" : "#f4f1ea",
              padding: "20px 22px", borderRadius: 4,
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              transform: `translate(${mouse.x * -10}px, ${mouse.y * -6}px)`,
              transition: "transform 0.4s cubic-bezier(.2,.8,.2,1)",
            }}>
              <div style={{
                fontFamily: t.mono, fontSize: 10, opacity: 0.6,
                textTransform: "uppercase", letterSpacing: "0.1em",
                marginBottom: 10, display: "flex", justifyContent: "space-between",
              }}>
                <span>Live · heute</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: t.accent }} /> Aktiv
                </span>
              </div>
              <div style={{ fontFamily: t.serif, fontSize: 44, lineHeight: 1, letterSpacing: "-0.02em" }}>
                2.847<span style={{ fontSize: 18, opacity: 0.5, marginLeft: 4 }}>kWh</span>
              </div>
              <div style={{ fontFamily: t.mono, fontSize: 11, opacity: 0.6, marginTop: 6 }}>
                Erzeugt von verbundenen Anlagen
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `0.5px solid rgba(255,255,255,0.12)`, display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: t.serif, fontSize: 28, lineHeight: 1, letterSpacing: "-0.02em" }}>250+</span>
                <span style={{ fontFamily: t.mono, fontSize: 11, opacity: 0.6 }}>Realisierte Anlagen</span>
              </div>
              {/* mini bar chart */}
              <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 32, marginTop: 14 }}>
                {[0.3, 0.5, 0.45, 0.7, 0.85, 0.92, 0.78, 0.6, 0.5, 0.4, 0.3, 0.2].map((h, i) => (
                  <div key={i} style={{
                    flex: 1, height: `${h * 100}%`, background: t.accent, opacity: 0.4 + h * 0.6,
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div style={{
          marginTop: 100, padding: "32px 0",
          borderTop: `0.5px solid ${t.rule}`, borderBottom: `0.5px solid ${t.rule}`,
          display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 24,
        }}>
          {D.trustBar.map((item, i) => (
            <div key={i} style={{ borderLeft: i > 0 ? `0.5px solid ${t.rule}` : "none", paddingLeft: i > 0 ? 24 : 0 }}>
              <div style={{ fontFamily: t.serif, fontSize: 17, fontWeight: 500, color: t.ink, lineHeight: 1.15 }}>
                {item.k}
              </div>
              <div style={{ fontFamily: t.sans, fontSize: 12.5, color: t.inkSoft, marginTop: 4 }}>
                {item.v}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Big Stats
// ─────────────────────────────────────────────────────────────────────────
function BigStats({ t }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ background: t.bgInk, color: t.ink === t.bgInk ? "#eef0e6" : "#f4f1ea", padding: "120px 0" }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {D.bigStats.map((s, i) => (
            <div key={i} style={{
              padding: "0 32px",
              borderLeft: i > 0 ? "0.5px solid rgba(255,255,255,0.15)" : "none",
            }}>
              <div style={{ fontFamily: t.serif, fontSize: "clamp(64px, 6vw, 96px)", lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 400 }}>
                <AnimatedNumber value={s.n} active={visible} t={t} />
                {s.u && <span style={{ fontSize: "0.4em", opacity: 0.6, marginLeft: 4 }}>{s.u}</span>}
              </div>
              <div style={{ fontFamily: t.sans, fontSize: 16, fontWeight: 500, marginTop: 20 }}>{s.l}</div>
              <div style={{ fontFamily: t.mono, fontSize: 11, opacity: 0.5, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.s}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function AnimatedNumber({ value, active, t }) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!active) return;
    const target = parseFloat(String(value).replace(/[^0-9.−-]/g, "").replace("−", "-")) || 0;
    const isNeg = String(value).startsWith("−") || String(value).startsWith("-");
    const isPlus = String(value).endsWith("+");
    const isFloat = String(value).includes(".");
    let start = 0;
    const duration = 1400;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = start + (Math.abs(target) - start) * eased;
      const out = isFloat ? v.toFixed(1) : Math.round(v).toString();
      setDisplay(`${isNeg ? "−" : ""}${out}${isPlus ? "+" : ""}`);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, value]);
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{display}</span>;
}

// ─────────────────────────────────────────────────────────────────────────
// Audience tabs (Privat / Gewerbe)
// ─────────────────────────────────────────────────────────────────────────
function Audiences({ t }) {
  const [tab, setTab] = useState("privat");
  const a = D.audiences[tab];

  return (
    <section id="leistungen" style={{ padding: "140px 0", background: t.bg }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginBottom: 48, alignItems: "end", gap: 80 }}>
          <div>
            <Eyebrow t={t}>Was Sie bekommen</Eyebrow>
            <h2 style={{
              fontFamily: t.serif, fontSize: "clamp(48px, 5.5vw, 80px)",
              lineHeight: 0.95, letterSpacing: "-0.03em", fontWeight: 400,
              margin: "20px 0 0", textWrap: "balance",
            }}>
              Maßgeschneidert für <em style={{ color: t.accent, fontStyle: "italic" }}>Ihren Bedarf</em>
            </h2>
          </div>
          <div style={{ display: "flex", gap: 0, alignSelf: "end", justifyContent: "flex-end" }}>
            {[["privat", "Für Zuhause"], ["gewerbe", "Für Unternehmen"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                padding: "14px 28px", border: `1px solid ${t.ink}`,
                borderRight: k === "privat" ? "none" : `1px solid ${t.ink}`,
                background: tab === k ? t.ink : "transparent",
                color: tab === k ? t.bg : t.ink,
                fontFamily: t.sans, fontSize: 14, fontWeight: 500,
                cursor: "pointer", transition: "all 0.2s",
                borderRadius: k === "privat" ? "999px 0 0 999px" : "0 999px 999px 0",
              }}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 64, alignItems: "start" }}>
          <div>
            <Placeholder t={t} ratio="4 / 5" label={tab === "privat" ? "Eigenheim · Pfettendach · Ost-West" : "Hallendach · Logistik · 380 kWp"} />
          </div>
          <div>
            <Tag t={t}>{a.tag}</Tag>
            <h3 style={{
              fontFamily: t.serif, fontSize: "clamp(40px, 4.5vw, 64px)", lineHeight: 0.98,
              letterSpacing: "-0.025em", fontWeight: 400, margin: "20px 0 28px", textWrap: "balance",
            }}>
              {a.title.map((line, i) => (
                <span key={i} style={{ display: "block" }}>
                  {i === 1 ? <em style={{ color: t.accent, fontStyle: "italic" }}>{line}</em> : line}
                </span>
              ))}
            </h3>
            <p style={{ fontFamily: t.sans, fontSize: 16, lineHeight: 1.6, color: t.inkSoft, marginBottom: 32, maxWidth: 580 }}>
              {a.lead}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: t.rule, border: `0.5px solid ${t.rule}` }}>
              {a.bullets.map(([h, b], i) => (
                <div key={i} style={{ padding: "20px 22px", background: t.bg }}>
                  <div style={{ fontFamily: t.serif, fontSize: 17, fontWeight: 500, marginBottom: 6 }}>{h}</div>
                  <div style={{ fontFamily: t.sans, fontSize: 13.5, color: t.inkSoft, lineHeight: 1.5 }}>{b}</div>
                </div>
              ))}
            </div>
            <a href="#kontakt" style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginTop: 32,
              padding: "14px 24px", background: t.ink, color: t.bg,
              borderRadius: 999, fontFamily: t.sans, fontSize: 14, fontWeight: 500,
              textDecoration: "none",
            }}>{a.cta} →</a>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Services Grid
// ─────────────────────────────────────────────────────────────────────────
function Services({ t }) {
  const [hover, setHover] = useState(null);

  return (
    <section style={{ padding: "140px 0", background: t.bgAlt }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "end", marginBottom: 64 }}>
          <div>
            <Eyebrow t={t}>Unser Angebot</Eyebrow>
            <h2 style={{
              fontFamily: t.serif, fontSize: "clamp(48px, 5.5vw, 80px)",
              lineHeight: 0.95, letterSpacing: "-0.03em", fontWeight: 400,
              margin: "20px 0 0", textWrap: "balance",
            }}>
              Sechs Bereiche, <em style={{ color: t.accent, fontStyle: "italic" }}>ein Ansprechpartner</em>
            </h2>
          </div>
          <p style={{ fontFamily: t.sans, fontSize: 16, lineHeight: 1.6, color: t.inkSoft }}>
            Statt jeden Gewerk-Mix selbst koordinieren zu müssen, bekommen Sie alles aus einer Hand – mit klaren Verantwortlichkeiten.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: t.rule, border: `0.5px solid ${t.rule}` }}>
          {D.services.map((s, i) => (
            <div key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{
                padding: "36px 32px 32px", background: hover === i ? t.bg : t.bgAlt,
                cursor: "pointer", transition: "background 0.2s",
                minHeight: 320, display: "flex", flexDirection: "column",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
                <span style={{ fontFamily: t.mono, fontSize: 12, color: t.inkSoft, fontWeight: 500 }}>
                  {s.no}
                </span>
                <span style={{ fontFamily: t.mono, fontSize: 10, color: t.inkSoft, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {s.cat}
                </span>
              </div>
              <h3 style={{
                fontFamily: t.serif, fontSize: 32, fontWeight: 400,
                letterSpacing: "-0.02em", lineHeight: 1.05, margin: "0 0 16px",
              }}>{s.title}</h3>
              <p style={{ fontFamily: t.sans, fontSize: 14, lineHeight: 1.55, color: t.inkSoft, flex: 1 }}>
                {s.body}
              </p>
              <div style={{
                marginTop: 24, fontFamily: t.sans, fontSize: 13, fontWeight: 500,
                color: hover === i ? t.accent : t.ink, transition: "color 0.2s",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                Details ansehen <span style={{ transform: hover === i ? "translateX(4px)" : "none", transition: "transform 0.2s" }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PPA Hero Block
// ─────────────────────────────────────────────────────────────────────────
function PPABlock({ t }) {
  return (
    <section id="ppa" style={{
      padding: "140px 0", background: t.bgInk,
      color: t.ink === t.bgInk ? "#eef0e6" : "#f4f1ea",
      position: "relative", overflow: "hidden",
    }}>
      {/* decorative grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: `linear-gradient(${t.accent} 1px, transparent 1px), linear-gradient(90deg, ${t.accent} 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />
      <Container style={{ position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <Eyebrow t={{ ...t, inkSoft: t.accent }}>⚡ Stromvertrag · Power Purchase Agreement</Eyebrow>
            <h2 style={{
              fontFamily: t.serif, fontSize: "clamp(56px, 6vw, 88px)",
              lineHeight: 0.95, letterSpacing: "-0.035em", fontWeight: 400,
              margin: "24px 0 32px", textWrap: "balance",
            }}>
              {D.ppa.title.map((line, i) => (
                <span key={i} style={{ display: "block" }}>
                  {i === 1 ? <em style={{ color: t.accent, fontStyle: "italic" }}>{line}</em> : line}
                </span>
              ))}
            </h2>
            <p style={{ fontFamily: t.sans, fontSize: 17, lineHeight: 1.6, opacity: 0.75, maxWidth: 540, marginBottom: 36 }}>
              {D.ppa.body}
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              <a href="#kontakt" style={{
                padding: "16px 26px", background: t.accent, color: t.accentInk,
                borderRadius: 999, fontFamily: t.sans, fontSize: 14, fontWeight: 500,
                textDecoration: "none",
              }}>Vorteil online prüfen →</a>
              <a href="#kontakt" style={{
                padding: "16px 26px", background: "transparent",
                color: t.ink === t.bgInk ? "#eef0e6" : "#f4f1ea",
                border: `1px solid rgba(255,255,255,0.3)`,
                borderRadius: 999, fontFamily: t.sans, fontSize: 14, fontWeight: 500,
                textDecoration: "none",
              }}>Gespräch vereinbaren</a>
            </div>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1,
            background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.1)",
          }}>
            {D.ppa.stats.map((s, i) => (
              <div key={i} style={{ padding: "40px 32px", background: t.bgInk }}>
                <div style={{ fontFamily: t.serif, fontSize: 72, lineHeight: 1, letterSpacing: "-0.03em", fontWeight: 400, color: t.accent }}>
                  {s.v}<span style={{ fontSize: "0.5em", opacity: 0.7 }}>{s.u}</span>
                </div>
                <div style={{ fontFamily: t.mono, fontSize: 11, opacity: 0.6, marginTop: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Process timeline
// ─────────────────────────────────────────────────────────────────────────
function Process({ t }) {
  return (
    <section id="prozess" style={{ padding: "140px 0", background: t.bg }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "end", marginBottom: 80 }}>
          <div>
            <Eyebrow t={t}>Unser Vorgehen</Eyebrow>
            <h2 style={{
              fontFamily: t.serif, fontSize: "clamp(48px, 5.5vw, 80px)",
              lineHeight: 0.95, letterSpacing: "-0.03em", fontWeight: 400,
              margin: "20px 0 0", textWrap: "balance",
            }}>
              Vier Etappen, <em style={{ color: t.accent, fontStyle: "italic" }}>klar definiert</em>
            </h2>
          </div>
          <p style={{ fontFamily: t.sans, fontSize: 16, lineHeight: 1.6, color: t.inkSoft }}>
            Sie wissen jederzeit, wo wir stehen, was als Nächstes kommt und wer wofür verantwortlich ist.
          </p>
        </div>

        <div style={{ position: "relative" }}>
          {/* timeline */}
          <div style={{ position: "absolute", top: 32, left: 0, right: 0, height: 1, background: t.rule }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
            {D.process.map((p, i) => (
              <div key={i}>
                <div style={{
                  width: 64, height: 64, borderRadius: 999,
                  background: t.bg, border: `1px solid ${t.ink}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: t.serif, fontSize: 24, color: t.ink,
                  position: "relative", marginBottom: 28,
                }}>{p.no}</div>
                <h3 style={{ fontFamily: t.serif, fontSize: 26, fontWeight: 500, letterSpacing: "-0.015em", margin: "0 0 12px" }}>
                  {p.title}
                </h3>
                <p style={{ fontFamily: t.sans, fontSize: 14, lineHeight: 1.55, color: t.inkSoft }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Bureaucracy
// ─────────────────────────────────────────────────────────────────────────
function Bureaucracy({ t }) {
  return (
    <section style={{ padding: "120px 0", background: t.bgAlt }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }}>
          <div style={{ position: "sticky", top: 100 }}>
            <div style={{
              fontFamily: t.serif, fontSize: 96, lineHeight: 1, letterSpacing: "-0.04em",
              color: t.accent, fontWeight: 400, marginBottom: 12,
            }}>100<span style={{ fontSize: "0.5em", opacity: 0.7 }}>%</span></div>
            <Eyebrow t={t}>Wir kümmern uns um den Papierkram</Eyebrow>
            <h2 style={{
              fontFamily: t.serif, fontSize: "clamp(36px, 4vw, 56px)",
              lineHeight: 1, letterSpacing: "-0.025em", fontWeight: 400,
              margin: "20px 0 24px", textWrap: "balance",
            }}>
              Den ganzen <em style={{ color: t.accent, fontStyle: "italic" }}>bürokratischen Aufwand</em> übernehmen wir.
            </h2>
            <p style={{ fontFamily: t.sans, fontSize: 15, lineHeight: 1.6, color: t.inkSoft, marginBottom: 24 }}>
              Eine Solaranlage hat sechs bis neun verschiedene Behörden- und Förderprozesse im Hintergrund. Sie müssen sich um keinen einzigen davon kümmern – wir erledigen das vollständig im Hintergrund.
            </p>
            <div style={{
              fontFamily: t.mono, fontSize: 12, color: t.inkSoft,
              padding: "10px 14px", background: t.chip, display: "inline-block",
              border: `0.5px solid ${t.rule}`,
            }}>⏱ Spart Ihnen 15–25 Stunden Aufwand</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: t.rule, border: `0.5px solid ${t.rule}` }}>
            {D.bureaucracy.map(([h, b], i) => (
              <div key={i} style={{ padding: "22px 24px", background: t.bgAlt }}>
                <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                  <span style={{ fontFamily: t.mono, fontSize: 11, color: t.inkSoft, fontVariantNumeric: "tabular-nums" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: t.serif, fontSize: 17, fontWeight: 500, marginBottom: 4 }}>{h}</div>
                    <div style={{ fontFamily: t.sans, fontSize: 13, lineHeight: 1.5, color: t.inkSoft }}>{b}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Future tech (smart grid)
// ─────────────────────────────────────────────────────────────────────────
function Future({ t }) {
  return (
    <section style={{ padding: "140px 0", background: t.bg }}>
      <Container>
        <div style={{ marginBottom: 64, maxWidth: 720 }}>
          <Eyebrow t={t}>Zukunftsfähig aufgestellt</Eyebrow>
          <h2 style={{
            fontFamily: t.serif, fontSize: "clamp(48px, 5.5vw, 80px)",
            lineHeight: 0.95, letterSpacing: "-0.03em", fontWeight: 400,
            margin: "20px 0 0", textWrap: "balance",
          }}>
            Solaranlagen, die <em style={{ color: t.accent, fontStyle: "italic" }}>mitdenken</em>
          </h2>
          <p style={{ fontFamily: t.sans, fontSize: 17, lineHeight: 1.6, color: t.inkSoft, marginTop: 28, maxWidth: 580 }}>
            Die Zeiten der starren Photovoltaik-Anlage sind vorbei. Mit Smart-Meter-Pflicht, dynamischen Stromtarifen und virtuellen Kraftwerken entstehen neue Sparpotenziale – wir machen Ihre Anlage dafür bereit.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {D.future.map((f, i) => (
            <div key={i} style={{
              padding: "32px 28px", background: t.bgAlt,
              border: `0.5px solid ${t.rule}`,
              minHeight: 280, display: "flex", flexDirection: "column",
            }}>
              <Tag t={t} accent={i === 1}>{f.tag}</Tag>
              <h3 style={{
                fontFamily: t.serif, fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em",
                lineHeight: 1.1, margin: "20px 0 14px",
              }}>{f.title}</h3>
              <p style={{ fontFamily: t.sans, fontSize: 14, lineHeight: 1.55, color: t.inkSoft, flex: 1 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────────────────
function Projects({ t }) {
  return (
    <section id="referenzen" style={{ padding: "140px 0", background: t.bgAlt }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "end", marginBottom: 56 }}>
          <div>
            <Eyebrow t={t}>Realisierte Projekte</Eyebrow>
            <h2 style={{
              fontFamily: t.serif, fontSize: "clamp(48px, 5.5vw, 80px)",
              lineHeight: 0.95, letterSpacing: "-0.03em", fontWeight: 400,
              margin: "20px 0 0", textWrap: "balance",
            }}>
              Vom Kleinprojekt bis zur <em style={{ color: t.accent, fontStyle: "italic" }}>Gewerbeanlage</em>
            </h2>
          </div>
          <p style={{ fontFamily: t.sans, fontSize: 16, lineHeight: 1.6, color: t.inkSoft }}>
            Auswahl unserer Arbeiten der letzten Monate – jede Anlage einzigartig, jede mit eigenen Herausforderungen.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {D.projects.map((p, i) => (
            <article key={i} style={{ cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.querySelector('.proj-img').style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.querySelector('.proj-img').style.transform = 'scale(1)'}
            >
              <div style={{ overflow: "hidden", marginBottom: 20 }}>
                <div className="proj-img" style={{ transition: "transform 0.5s cubic-bezier(.2,.8,.2,1)" }}>
                  <Placeholder t={t} ratio="4 / 3" label={p.title} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <Tag t={t}>{p.tag}</Tag>
                <span style={{ fontFamily: t.mono, fontSize: 11, color: t.inkSoft, letterSpacing: "0.04em" }}>
                  {p.spec}
                </span>
              </div>
              <h3 style={{ fontFamily: t.serif, fontSize: 26, fontWeight: 500, letterSpacing: "-0.015em", margin: "0 0 10px", lineHeight: 1.15 }}>
                {p.title}
              </h3>
              <p style={{ fontFamily: t.sans, fontSize: 14, lineHeight: 1.55, color: t.inkSoft }}>
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────────────────
function Testimonials({ t }) {
  return (
    <section style={{ padding: "140px 0", background: t.bg }}>
      <Container>
        <div style={{ marginBottom: 56, maxWidth: 720 }}>
          <Eyebrow t={t}>Was Kunden zurückmelden</Eyebrow>
          <h2 style={{
            fontFamily: t.serif, fontSize: "clamp(48px, 5.5vw, 80px)",
            lineHeight: 0.95, letterSpacing: "-0.03em", fontWeight: 400,
            margin: "20px 0 0", textWrap: "balance",
          }}>
            Erfahrungen aus <em style={{ color: t.accent, fontStyle: "italic" }}>erster Hand</em>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {D.testimonials.map((tm, i) => (
            <figure key={i} style={{
              margin: 0, padding: "36px 32px", background: t.bgAlt,
              border: `0.5px solid ${t.rule}`,
              display: "flex", flexDirection: "column", minHeight: 360,
            }}>
              <div style={{ fontFamily: t.serif, fontSize: 64, color: t.accent, lineHeight: 0.6, marginBottom: 20 }}>"</div>
              <div style={{ color: t.accent, fontSize: 13, marginBottom: 16, letterSpacing: "0.1em" }}>★★★★★</div>
              <blockquote style={{
                margin: 0, fontFamily: t.serif, fontSize: 19, lineHeight: 1.4,
                fontWeight: 400, letterSpacing: "-0.005em", flex: 1,
              }}>{tm.quote}</blockquote>
              <figcaption style={{ marginTop: 24, display: "flex", gap: 12, alignItems: "center", paddingTop: 20, borderTop: `0.5px solid ${t.rule}` }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 999, background: t.accent,
                  color: t.accentInk, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: t.serif, fontSize: 14, fontWeight: 500,
                }}>{tm.initials}</div>
                <div>
                  <div style={{ fontFamily: t.sans, fontSize: 14, fontWeight: 500 }}>{tm.name}</div>
                  <div style={{ fontFamily: t.mono, fontSize: 11, color: t.inkSoft, marginTop: 2 }}>{tm.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// About
// ─────────────────────────────────────────────────────────────────────────
function About({ t }) {
  return (
    <section id="ueberuns" style={{ padding: "140px 0", background: t.bgAlt }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 80, alignItems: "start" }}>
          <div>
            <div style={{ position: "relative" }}>
              <Placeholder t={t} ratio="4 / 5" label="Team-Foto · Werkhalle Deggendorf" />
              <div style={{
                position: "absolute", bottom: 24, left: 24, padding: "10px 16px",
                background: t.bg, fontFamily: t.mono, fontSize: 11,
                color: t.inkSoft, letterSpacing: "0.06em", textTransform: "uppercase",
                border: `0.5px solid ${t.rule}`,
              }}>{D.brand.founded} · Gegründet in Deggendorf</div>
            </div>
          </div>

          <div>
            <Eyebrow t={t}>Wer wir sind</Eyebrow>
            <h2 style={{
              fontFamily: t.serif, fontSize: "clamp(48px, 5.5vw, 80px)",
              lineHeight: 0.95, letterSpacing: "-0.03em", fontWeight: 400,
              margin: "20px 0 32px", textWrap: "balance",
            }}>
              {D.about.title.map((line, i) => (
                <span key={i} style={{ display: "block" }}>
                  {i === 1 ? <em style={{ color: t.accent, fontStyle: "italic" }}>{line}</em> : line}
                </span>
              ))}
            </h2>
            <p style={{ fontFamily: t.sans, fontSize: 16, lineHeight: 1.6, color: t.inkSoft, marginBottom: 36, maxWidth: 580 }}>
              {D.about.body}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {D.about.points.map(([h, b], i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "180px 1fr", gap: 32,
                  padding: "20px 0", borderTop: `0.5px solid ${t.rule}`,
                  alignItems: "baseline",
                }}>
                  <div style={{ fontFamily: t.serif, fontSize: 18, fontWeight: 500 }}>{h}</div>
                  <div style={{ fontFamily: t.sans, fontSize: 14, color: t.inkSoft, lineHeight: 1.5 }}>{b}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────
function FAQ({ t }) {
  const [open, setOpen] = useState(0);
  return (
    <section style={{ padding: "140px 0", background: t.bg }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 80 }}>
          <div>
            <Eyebrow t={t}>Häufige Fragen</Eyebrow>
            <h2 style={{
              fontFamily: t.serif, fontSize: "clamp(40px, 5vw, 64px)",
              lineHeight: 0.95, letterSpacing: "-0.03em", fontWeight: 400,
              margin: "20px 0 24px", textWrap: "balance",
            }}>
              Was Sie <em style={{ color: t.accent, fontStyle: "italic" }}>oft fragen</em>
            </h2>
            <p style={{ fontFamily: t.sans, fontSize: 15, lineHeight: 1.6, color: t.inkSoft }}>
              Wenn Ihre Frage hier nicht steht, rufen Sie an: {D.brand.phone}.
            </p>
          </div>
          <div>
            {D.faq.map(([q, a], i) => (
              <div key={i} style={{ borderTop: `0.5px solid ${t.rule}`, ...(i === D.faq.length - 1 ? { borderBottom: `0.5px solid ${t.rule}` } : {}) }}>
                <button onClick={() => setOpen(open === i ? -1 : i)} style={{
                  width: "100%", padding: "24px 0", border: "none", background: "transparent",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer", textAlign: "left", color: t.ink,
                }}>
                  <span style={{ fontFamily: t.serif, fontSize: 21, fontWeight: 500, letterSpacing: "-0.01em", paddingRight: 32 }}>
                    {q}
                  </span>
                  <span style={{
                    width: 32, height: 32, borderRadius: 999,
                    border: `1px solid ${t.ink}`, display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                    transform: open === i ? "rotate(45deg)" : "none",
                    transition: "transform 0.3s",
                  }}>+</span>
                </button>
                <div style={{
                  maxHeight: open === i ? 400 : 0, overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(.2,.8,.2,1), padding 0.3s",
                  padding: open === i ? "0 0 24px" : "0",
                }}>
                  <p style={{
                    fontFamily: t.sans, fontSize: 15, lineHeight: 1.65,
                    color: t.inkSoft, margin: 0, maxWidth: 640,
                  }}>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Contact
// ─────────────────────────────────────────────────────────────────────────
function Contact({ t }) {
  const [form, setForm] = useState({
    vorname: "", nachname: "", email: "", phone: "", interest: "", note: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const fieldStyle = {
    width: "100%", padding: "14px 16px", background: t.bg,
    border: `0.5px solid ${t.rule}`, fontFamily: t.sans, fontSize: 15,
    color: t.ink, outline: "none", borderRadius: 4,
    transition: "border-color 0.2s",
  };

  return (
    <section id="kontakt" style={{ padding: "140px 0 100px", background: t.bgAlt }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 80 }}>
          <div>
            <Eyebrow t={t}>Direkter Kontakt</Eyebrow>
            <h2 style={{
              fontFamily: t.serif, fontSize: "clamp(48px, 5.5vw, 80px)",
              lineHeight: 0.95, letterSpacing: "-0.03em", fontWeight: 400,
              margin: "20px 0 28px", textWrap: "balance",
            }}>
              Lassen Sie uns <em style={{ color: t.accent, fontStyle: "italic" }}>kurz reden</em>
            </h2>
            <p style={{ fontFamily: t.sans, fontSize: 16, lineHeight: 1.6, color: t.inkSoft, marginBottom: 40 }}>
              Ein Erstgespräch dauert meist 20 bis 40 Minuten. Sie erfahren konkrete Zahlen für Ihre Situation und ob sich ein Projekt lohnt – oder eher nicht. Beides ist okay.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <a href={`tel:${D.brand.phone}`} style={{
                padding: "20px 0", borderTop: `0.5px solid ${t.rule}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                color: t.ink, textDecoration: "none",
              }}>
                <div>
                  <div style={{ fontFamily: t.mono, fontSize: 11, color: t.inkSoft, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Anrufen</div>
                  <div style={{ fontFamily: t.serif, fontSize: 22, fontWeight: 500 }}>{D.brand.phone}</div>
                </div>
                <span style={{ fontSize: 22, color: t.inkSoft }}>→</span>
              </a>
              <a href={`mailto:${D.brand.email}`} style={{
                padding: "20px 0", borderTop: `0.5px solid ${t.rule}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                color: t.ink, textDecoration: "none",
              }}>
                <div>
                  <div style={{ fontFamily: t.mono, fontSize: 11, color: t.inkSoft, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Mailen</div>
                  <div style={{ fontFamily: t.serif, fontSize: 22, fontWeight: 500 }}>{D.brand.email}</div>
                </div>
                <span style={{ fontSize: 22, color: t.inkSoft }}>→</span>
              </a>
              <div style={{
                padding: "20px 0", borderTop: `0.5px solid ${t.rule}`, borderBottom: `0.5px solid ${t.rule}`,
              }}>
                <div style={{ fontFamily: t.mono, fontSize: 11, color: t.inkSoft, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Vorbeikommen</div>
                <div style={{ fontFamily: t.serif, fontSize: 18, fontWeight: 500 }}>{D.brand.address}</div>
              </div>
            </div>
          </div>

          <form onSubmit={submit} style={{
            background: t.bg, padding: 40, border: `0.5px solid ${t.rule}`,
          }}>
            {submitted ? (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 999, background: t.accent, color: t.accentInk, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>✓</div>
                <h3 style={{ fontFamily: t.serif, fontSize: 28, fontWeight: 500, margin: "0 0 12px" }}>Vielen Dank!</h3>
                <p style={{ fontFamily: t.sans, fontSize: 15, color: t.inkSoft, margin: 0 }}>
                  Wir antworten innerhalb von 24 Stunden.
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <input style={fieldStyle} placeholder="Vorname" value={form.vorname} onChange={e => setForm({ ...form, vorname: e.target.value })} required />
                  <input style={fieldStyle} placeholder="Nachname" value={form.nachname} onChange={e => setForm({ ...form, nachname: e.target.value })} required />
                </div>
                <input style={{ ...fieldStyle, marginBottom: 16 }} type="email" placeholder="E-Mail" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <input style={{ ...fieldStyle, marginBottom: 16 }} placeholder="Telefon (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                <select style={{ ...fieldStyle, marginBottom: 16 }} value={form.interest} onChange={e => setForm({ ...form, interest: e.target.value })} required>
                  <option value="">Wofür interessieren Sie sich?</option>
                  {D.formInterests.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
                <textarea style={{ ...fieldStyle, minHeight: 120, fontFamily: t.sans, resize: "vertical" }} placeholder="Worum geht es konkret? (optional)" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                <button type="submit" style={{
                  width: "100%", marginTop: 20, padding: "18px",
                  background: t.ink, color: t.bg, border: "none",
                  fontFamily: t.sans, fontSize: 15, fontWeight: 500, cursor: "pointer",
                  borderRadius: 999, letterSpacing: "0.01em",
                }}>Anfrage absenden →</button>
                <div style={{ fontFamily: t.mono, fontSize: 11, color: t.inkSoft, marginTop: 16, textAlign: "center", letterSpacing: "0.04em" }}>
                  Wir antworten innerhalb von 24 Stunden · keine Verkaufsfalle
                </div>
              </>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────
function Footer({ t }) {
  return (
    <footer style={{ background: t.bgInk, color: t.ink === t.bgInk ? "#eef0e6" : "#f4f1ea", padding: "80px 0 32px" }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 64, marginBottom: 60 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <SunMark t={t} size={28} />
              <span style={{ fontFamily: t.serif, fontSize: 22, fontWeight: 500 }}>Solar Energie Partner</span>
            </div>
            <p style={{ fontFamily: t.sans, fontSize: 14, lineHeight: 1.6, opacity: 0.6, maxWidth: 380 }}>
              Spezialisiert auf Solaranlagen, Stromspeicher und PPA-Stromverträge. Ehrlich beraten, sauber installiert, langfristig betreut.
            </p>
            <p style={{ fontFamily: t.mono, fontSize: 11, opacity: 0.5, marginTop: 16, letterSpacing: "0.04em" }}>
              Eine Marke der Pilsner Vertriebs GmbH
            </p>
          </div>
          {[
            ["Leistungen", ["PV-Anlagen", "Speicher", "PPA-Verträge", "Ladelösungen", "Wärmepumpen", "Service"]],
            ["Information", ["Über uns", "Projekte", "Karriere", "Förderungen", "FAQ"]],
            ["Kontakt", [D.brand.address.split(",")[0], "94469 Deggendorf", D.brand.phone, D.brand.email]],
          ].map(([title, items]) => (
            <div key={title}>
              <div style={{ fontFamily: t.mono, fontSize: 11, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>
                {title}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map(it => (
                  <li key={it} style={{ fontFamily: t.sans, fontSize: 14, opacity: 0.8 }}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          paddingTop: 24, borderTop: "0.5px solid rgba(255,255,255,0.12)",
          display: "flex", justifyContent: "space-between",
          fontFamily: t.mono, fontSize: 11, opacity: 0.5, letterSpacing: "0.04em",
        }}>
          <span>© 2026 Solar Energie Partner — eine Marke der Pilsner Vertriebs GmbH</span>
          <span style={{ display: "flex", gap: 24 }}>
            <span>Impressum</span><span>Datenschutz</span><span>AGB</span>
          </span>
        </div>
      </Container>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "editorial",
  "accentColor": "",
  "italicAccents": true
}/*EDITMODE-END*/;

function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const baseTheme = THEMES[tw.theme] || THEMES.editorial;
  const t = tw.accentColor ? { ...baseTheme, accent: tw.accentColor } : baseTheme;

  // Inject body bg
  useEffect(() => {
    document.body.style.background = t.bg;
    document.body.style.color = t.ink;
  }, [t]);

  return (
    <div style={{ background: t.bg, color: t.ink, minHeight: "100vh" }}>
      <Header t={t} />
      <Hero t={t} />
      <BigStats t={t} />
      <Audiences t={t} />
      <Services t={t} />
      <PPABlock t={t} />
      <Process t={t} />
      <Bureaucracy t={t} />
      <Future t={t} />
      <Projects t={t} />
      <Testimonials t={t} />
      <About t={t} />
      <FAQ t={t} />
      <Contact t={t} />
      <Footer t={t} />

      <TweaksPanel title="Design-Varianten">
        <TweakSection label="Theme">
          <TweakRadio
            label="Stil"
            value={tw.theme}
            options={[
              { value: "editorial", label: "Editorial" },
              { value: "technical", label: "Tech" },
              { value: "craft", label: "Handwerk" },
            ]}
            onChange={(v) => setTweak("theme", v)}
          />
        </TweakSection>
        <TweakSection label="Akzentfarbe">
          <TweakColor
            label="Custom"
            value={tw.accentColor || baseTheme.accent}
            onChange={(v) => setTweak("accentColor", v)}
          />
          <TweakButton
            label="Theme-Standard"
            secondary
            onClick={() => setTweak("accentColor", "")}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
