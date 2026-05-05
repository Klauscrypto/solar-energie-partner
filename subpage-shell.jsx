// subpage-shell.jsx — shared building blocks for all radikal subpages
// Exposes: window.RadShell = { Page, Header, Footer, PageHero, Section, BigQuote,
//                              StatGrid, FeatureGrid, Cta, Sticky, Marquee, Sticker, COL, fonts }

(function () {
  const { useState, useEffect, useRef } = React;
  const D = window.SITE_DATA;

  const COL = {
    yellow: "#fdfd00",
    black:  "#0a0a0a",
    pink:   "#ff00aa",
    cyan:   "#00ffea",
    red:    "#ff3a1f",
    orange: "#ff7a00",
    white:  "#ffffff",
  };
  const fonts = {
    heading: `"Bricolage Grotesque",system-ui,sans-serif`,
    mono:    `"JetBrains Mono",monospace`,
    serif:   `"Instrument Serif",serif`,
  };

  // ─── Header ──────────────────────────────
  function Header({ active, base = "" }) {
    const links = [
      { id: "eigenheim",  label: "Eigenheim", href: `${base}eigenheim.html` },
      { id: "gewerbe",    label: "Gewerbe", href: `${base}gewerbe.html` },
      { id: "speicher",   label: "Speicher", href: `${base}speicher.html` },
      { id: "ppa",        label: "PPA", href: `${base}ppa.html` },
      { id: "repowering", label: "Repowering", href: `${base}repowering.html` },
      { id: "referenzen", label: "Referenzen", href: `${base}referenzen.html` },
    ];
    const [t, setT] = useState(new Date());
    useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
    return (
      <header style={{
        position: "sticky", top: 0, zIndex: 50, background: COL.black, color: COL.yellow,
        borderBottom: `4px solid ${COL.yellow}`, padding: "10px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
        fontFamily: fonts.mono, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em",
      }}>
        <a href={`${base}index.html`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: COL.yellow }}>
          <span style={{ display: "inline-flex", width: 18, height: 18, background: COL.yellow }}/>
          <span style={{ fontWeight: 700 }}>SOLAR // RADIKAL</span>
        </a>
        <nav style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {links.map(n => (
            <a key={n.id} href={n.href} style={{
              color: active === n.id ? COL.black : COL.yellow,
              background: active === n.id ? COL.yellow : "transparent",
              padding: active === n.id ? "2px 8px" : "2px 0",
              textDecoration: "none", fontWeight: active === n.id ? 700 : 400,
            }}>→ {n.label}</a>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ color: COL.cyan }}>● LIVE</span>
          <span>{t.toLocaleTimeString("de-DE")}</span>
          <a href={`${base}kontakt.html`} style={{
            padding: "8px 14px", background: COL.yellow, color: COL.black,
            textDecoration: "none", fontWeight: 700,
          }}>RUF_AN</a>
        </div>
      </header>
    );
  }

  // ─── Footer ──────────────────────────────
  function Footer({ base = "" }) {
    return (
      <footer style={{ background: COL.black, color: COL.yellow, borderTop: `4px solid ${COL.yellow}` }}>
        {/* Big sitemap */}
        <div style={{ padding: "60px 24px", borderBottom: `2px solid ${COL.yellow}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 32 }}>
            <div>
              <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 56, lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
                SOLAR<br/>
                <span style={{ background: COL.yellow, color: COL.black, padding: "0 .1em", display: "inline-block" }}>RADIKAL.</span>
              </div>
              <p style={{ fontFamily: fonts.serif, fontSize: 16, fontStyle: "italic", maxWidth: 320, marginTop: 16, opacity: 0.85 }}>
                Photovoltaik. Speicher. PPA. Aus Deggendorf für Bayern, Baden-Württemberg und bundesweit auf Anfrage.
              </p>
            </div>
            {[
              ["LEISTUNG", [
                ["Eigenheim", `${base}eigenheim.html`],
                ["Gewerbe", `${base}gewerbe.html`],
                ["Speicher", `${base}speicher.html`],
                ["PPA-Vertrag", `${base}ppa.html`],
                ["Repowering", `${base}repowering.html`],
              ]],
              ["WISSEN", [
                ["Blog & Ratgeber", `${base}blog/`],
                ["FAQ", `${base}index.html#faq`],
                ["Referenzen", `${base}referenzen.html`],
              ]],
              ["FIRMA", [
                ["Über uns", `${base}ueber-uns.html`],
                ["Kontakt", `${base}kontakt.html`],
                ["Referenzen", `${base}referenzen.html`],
                ["Impressum", `${base}impressum.html`],
                ["Datenschutz", `${base}datenschutz.html`],
              ]],
              ["KONTAKT", [
                [D.brand.phone, `tel:${D.brand.phone}`],
                [D.brand.email, `mailto:${D.brand.email}`],
                ["Detterstraße 38", "#"],
                ["94469 Deggendorf", "#"],
              ]],
            ].map(([title, items], i) => (
              <div key={i}>
                <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, color: COL.cyan, marginBottom: 12, letterSpacing: ".05em" }}>► {title}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {items.map(([l, h], j) => (
                    <li key={j}><a href={h} style={{ color: COL.yellow, textDecoration: "none", fontFamily: fonts.mono, fontSize: 12, textTransform: "uppercase", letterSpacing: ".03em" }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom strip */}
        <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, fontFamily: fonts.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <span>© 2026 SOLAR_ENERGIE_PARTNER ░ PILSNER_VERTRIEBS_GMBH ░ DEGGENDORF</span>
          <span style={{ display: "flex", gap: 20 }}>
            <a href={`${base}impressum.html`} style={{ color: COL.yellow, textDecoration: "none" }}>IMPRESSUM</a>
            <a href={`${base}datenschutz.html`} style={{ color: COL.yellow, textDecoration: "none" }}>DATENSCHUTZ</a>
          </span>
        </div>
      </footer>
    );
  }

  // ─── Sticker layer (subtle) ──────────────
  function StickerLayer({ items }) {
    if (!items) return null;
    return <>
      {items.map((s, i) => (
        <div key={i} style={{
          position: "absolute", top: s.top, left: s.left, right: s.right,
          background: s.bg || COL.pink, color: s.fg || COL.black,
          border: `2px solid ${COL.black}`, padding: "6px 12px",
          fontFamily: fonts.mono, fontSize: 11, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.05em",
          transform: `rotate(${s.rot || 0}deg)`, zIndex: 5,
        }}>{s.text}</div>
      ))}
    </>;
  }

  // ─── Page hero (per-page) ────────────────
  function PageHero({ kapitel, kicker, title, sub, color = COL.yellow, accentColor = COL.pink, blackHeadlinePart, italicPart, stickers }) {
    return (
      <section style={{ position: "relative", padding: "60px 24px 80px", background: color, color: COL.black, overflow: "hidden", borderBottom: `4px solid ${COL.black}` }}>
        <StickerLayer items={stickers} />

        {/* Rotating sun corner */}
        <div style={{ position: "absolute", top: -180, right: -180, width: 500, height: 500, animation: "spin 80s linear infinite", pointerEvents: "none", opacity: 0.7 }}>
          <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
            {[...Array(36)].map((_,i)=>{const a=(i*Math.PI*2)/36;return <line key={i} x1={100+Math.cos(a)*60} y1={100+Math.sin(a)*60} x2={100+Math.cos(a)*92} y2={100+Math.sin(a)*92} stroke={COL.black} strokeWidth="1.5"/>})}
            <circle cx="100" cy="100" r="50" fill={COL.black}/>
            <circle cx="100" cy="100" r="36" fill={accentColor}/>
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, lineHeight: 1.4 }}>
            ░░░ {kapitel} ░░░ {kicker} ░░░
          </div>
          <h1 style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: "clamp(64px,13vw,200px)", lineHeight: 0.82, letterSpacing: "-0.05em", margin: 0, textTransform: "uppercase" }}>
            {title}{" "}
            {italicPart && <span style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 400, textTransform: "lowercase" }}>{italicPart}</span>}{" "}
            {blackHeadlinePart && <span style={{ background: COL.black, color: color, padding: "0 .1em", display: "inline-block", transform: "skew(-4deg)" }}>{blackHeadlinePart}</span>}
          </h1>
          {sub && <p style={{ fontFamily: fonts.serif, fontSize: 24, lineHeight: 1.4, fontStyle: "italic", marginTop: 32, maxWidth: 720, marginBottom: 0 }}>{sub}</p>}
        </div>
      </section>
    );
  }

  // ─── Generic Section header ─────────────
  function Section({ kapitel, title, italicPart, blackPart, color = COL.yellow, blackHeadlineColor, children, id }) {
    return (
      <section id={id} style={{ background: color, color: color === COL.black ? COL.yellow : COL.black, padding: "80px 24px", borderTop: `4px solid ${COL.black}` }}>
        {kapitel && <div style={{ fontFamily: fonts.mono, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, opacity: 0.8 }}>░░░ {kapitel} ░░░</div>}
        {title && (
          <h2 style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: "clamp(48px,8vw,128px)", lineHeight: 0.85, letterSpacing: "-0.04em", margin: "0 0 40px", textTransform: "uppercase" }}>
            {title}{" "}
            {italicPart && <span style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 400, textTransform: "lowercase" }}>{italicPart}</span>}{" "}
            {blackPart && <span style={{ background: color === COL.black ? COL.yellow : COL.black, color: blackHeadlineColor || color, padding: "0 .1em", display: "inline-block", transform: "skew(-4deg)" }}>{blackPart}</span>}
          </h2>
        )}
        {children}
      </section>
    );
  }

  // ─── Stat grid (repeating big numbers) ──
  function StatGrid({ items, color = COL.cyan, alt = COL.yellow }) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length},1fr)`, border: `3px solid ${COL.black}`, background: COL.white }}>
        {items.map((s, i) => (
          <div key={i} style={{ padding: "32px 24px", borderRight: i < items.length-1 ? `2px solid ${COL.black}` : "none", background: i % 2 === 0 ? color : alt, color: COL.black }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 8, opacity: 0.7 }}>► {s.l}</div>
            <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: "clamp(56px,7vw,96px)", lineHeight: 0.85, letterSpacing: "-0.04em" }}>
              {s.v}<span style={{ fontSize: ".4em", color: COL.pink }}>{s.u || ""}</span>
            </div>
            {s.s && <div style={{ fontFamily: fonts.serif, fontSize: 14, fontStyle: "italic", marginTop: 8 }}>{s.s}</div>}
          </div>
        ))}
      </div>
    );
  }

  // ─── Feature grid (cards w/ titles) ────
  function FeatureGrid({ items, cols = 3, palette }) {
    const pal = palette || [COL.pink, COL.cyan, COL.orange, COL.yellow, COL.pink, COL.cyan, COL.orange, COL.yellow];
    return (
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 16 }}>
        {items.map((f, i) => (
          <div key={i} className="lift" style={{
            background: pal[i % pal.length], border: `3px solid ${COL.black}`, padding: 24,
            position: "relative", display: "flex", flexDirection: "column", minHeight: 220, color: COL.black,
            transform: `rotate(${(i % 2 === 0 ? -0.5 : 0.5)}deg)`,
          }}>
            {f.no && <div style={{ position: "absolute", top: -14, right: -14, background: COL.black, color: COL.yellow, padding: "4px 10px", fontFamily: fonts.mono, fontSize: 11, fontWeight: 700 }}>{f.no}</div>}
            {f.tag && <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 10, opacity: 0.7 }}>┌── {f.tag} ──┐</div>}
            <h3 style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 28, lineHeight: 0.95, letterSpacing: "-0.02em", textTransform: "uppercase", margin: "0 0 10px" }}>{f.title}</h3>
            <p style={{ fontFamily: fonts.serif, fontSize: 15, lineHeight: 1.45, margin: 0, flex: 1 }}>{f.body}</p>
            {f.tail && <div style={{ marginTop: 16, fontFamily: fonts.mono, fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>→ {f.tail}</div>}
          </div>
        ))}
      </div>
    );
  }

  // ─── Big quote ─────────────────────────
  function BigQuote({ quote, by, role, color = COL.pink }) {
    return (
      <section style={{ background: color, color: COL.black, padding: "80px 24px", borderTop: `4px solid ${COL.black}` }}>
        <blockquote style={{ margin: 0, fontFamily: fonts.serif, fontSize: "clamp(32px,4.5vw,64px)", lineHeight: 1.15, fontStyle: "italic", letterSpacing: "-0.02em", maxWidth: 1100 }}>
          "<span style={{ color: COL.black }}>{quote}</span>"
        </blockquote>
        <div style={{ marginTop: 32, fontFamily: fonts.mono, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
          ► {by}{role && <span style={{ opacity: 0.6 }}> · {role}</span>}
        </div>
      </section>
    );
  }

  // ─── CTA strip ─────────────────────────
  function Cta({ kicker, big, sub, btn = "RUF_UNS_AN", href = "kontakt.html" }) {
    return (
      <section style={{ background: COL.black, color: COL.yellow, padding: "80px 24px", borderTop: `4px solid ${COL.black}` }}>
        <div style={{ fontFamily: fonts.mono, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, color: COL.cyan }}>
          ░░░ {kicker || "ENDE"} ░░░
        </div>
        <h2 style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: "clamp(56px,11vw,180px)", lineHeight: 0.85, letterSpacing: "-0.05em", margin: 0, textTransform: "uppercase" }}>
          {big}
        </h2>
        {sub && <p style={{ fontFamily: fonts.serif, fontSize: 22, fontStyle: "italic", marginTop: 16, opacity: 0.9, maxWidth: 720 }}>{sub}</p>}
        <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
          <a href={href} className="lift" style={{ background: COL.yellow, color: COL.black, padding: "20px 28px", border: `3px solid ${COL.yellow}`, fontFamily: fonts.heading, fontWeight: 800, fontSize: 18, textTransform: "uppercase", textDecoration: "none", letterSpacing: "-0.01em" }}>[→] {btn}</a>
          <a href={`tel:${D.brand.phone}`} className="lift" style={{ background: COL.pink, color: COL.black, padding: "20px 28px", border: `3px solid ${COL.yellow}`, fontFamily: fonts.heading, fontWeight: 800, fontSize: 18, textTransform: "uppercase", textDecoration: "none", letterSpacing: "-0.01em" }}>[☎] {D.brand.phone}</a>
        </div>
      </section>
    );
  }

  // ─── Marquee strip ─────────────────────
  function Marquee({ items, color = COL.black, fg = COL.yellow }) {
    return (
      <div style={{ background: color, color: fg, padding: "20px 0", overflow: "hidden", borderTop: `4px solid ${COL.black}`, borderBottom: `4px solid ${COL.black}` }}>
        <div className="mq">
          {[...Array(2)].flatMap((_,k) => items.map((s, i) => (
            <span key={`${k}-${i}`} style={{ fontFamily: fonts.heading, fontSize: 56, fontWeight: 800, padding: "0 32px", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "-0.03em" }}>★ {s}</span>
          )))}
        </div>
      </div>
    );
  }

  // ─── Page wrapper ──────────────────────
  function WhatsAppBtn() {
    return (
      <a href="https://wa.me/491753560019?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20PV-Anlage." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Kontakt" style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 999,
        width: 60, height: 60, borderRadius: "50%",
        background: "#25D366", border: "3px solid #0a0a0a",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "4px 4px 0 #0a0a0a", textDecoration: "none",
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    );
  }

  function Page({ active, children, base = "" }) {
    return <>
      <Header active={active} base={base} />
      {children}
      <Footer base={base} />
      <WhatsAppBtn />
    </>;
  }

  window.RadShell = { Page, Header, Footer, PageHero, Section, BigQuote, StatGrid, FeatureGrid, Cta, Marquee, COL, fonts };
})();
