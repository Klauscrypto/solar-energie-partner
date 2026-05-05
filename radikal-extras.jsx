// radikal-extras.jsx — extra sections appended to radikal.html
// Exposes window.RadExtras = { PPACalc, KaufVsPPA, AboutDoris, GebietsKarte, Foerderung }

(function () {
  const { useState, useEffect, useRef, useMemo } = React;
  // Bindings are set on window by radikal.html main script before App renders.
  // Use getters so each access reads the live value (COL is mutated in place).
  const D = window.SITE_DATA;
  const COL = new Proxy({}, { get: (_, k) => window.__RAD_COL[k] });
  const useTweak = (...a) => window.__RAD_useTweak(...a);
  const useReveal = (...a) => window.__RAD_useReveal(...a);
  const fonts = new Proxy({}, { get: (_, k) => window.__RAD_fonts[k] });

  // ────────────────────────────────────────
  // 1) PPA-RECHNER LIVE — extended block
  // ────────────────────────────────────────
  function PPACalc() {
    const [profile, setProfile] = useState("gewerbe");
    const presets = {
      eigenheim: { kwh: 4500,  min: 2000,  max: 30000,    step: 500,   netz: 0.34, ppa: 0.16 },
      gewerbe:   { kwh: 80000, min: 20000, max: 2000000,  step: 10000, netz: 0.31, ppa: 0.17 },
    };
    const p = presets[profile];
    const [kwh, setKwh]           = useState(p.kwh);
    const [ppaPrice, setPpaPrice] = useState(p.ppa);
    useEffect(() => { setKwh(presets[profile].kwh); setPpaPrice(presets[profile].ppa); }, [profile]);
    const diff   = Math.max(p.netz - ppaPrice, 0);
    const yearly = Math.round(kwh * diff);
    const twenty = yearly * 20;
    const co2    = Math.round(kwh * 0.4);

    return (
      <section id="rechner" style={{ background: COL.cyan, color: COL.black, padding: "80px 24px", borderTop: `4px solid ${COL.black}`, position: "relative", overflow: "hidden" }}>
        <div ref={useReveal()} className="rv" style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            ░░░ RECHNER_v2.4 ░░░ LIVE ░░░ KEINE_ANMELDUNG ░░░
          </div>
          <h2 style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: "clamp(56px,11vw,180px)", lineHeight: 0.85, letterSpacing: "-0.05em", margin: 0, textTransform: "uppercase" }}>
            <span style={{ background: COL.black, color: COL.cyan, padding: "0 .1em", display: "inline-block", transform: "rotate(-1deg)" }}>WAS</span>{" "}
            sparst du?<br/>
            <span style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 400, textTransform: "lowercase" }}>schieb den</span>{" "}
            <span style={{ background: COL.pink, color: COL.black, padding: "0 .1em", display: "inline-block", transform: "skew(-4deg)" }}>REGLER.</span>
          </h2>
        </div>

        {/* Profile toggle */}
        <div style={{ display: "inline-flex", border: `3px solid ${COL.black}`, marginBottom: 24, background: COL.white }}>
          {[["eigenheim", "■ EIGENHEIM"], ["gewerbe", "■ GEWERBE"]].map(([k, l]) => (
            <button key={k} onClick={() => setProfile(k)} style={{
              padding: "12px 24px", border: "none", cursor: "crosshair",
              background: profile === k ? COL.black : "transparent",
              color: profile === k ? COL.yellow : COL.black,
              fontFamily: fonts.mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em",
            }}>{l}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 0.8fr", gap: 32, alignItems: "stretch" }}>
          {/* Left: sliders + breakdown */}
          <div style={{ background: COL.white, border: `3px solid ${COL.black}`, padding: 28, position: "relative" }}>
            <div style={{ position: "absolute", top: -14, left: 16, background: COL.black, color: COL.cyan, padding: "0 12px", fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>► EINGABE</div>

            {/* kWh slider */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontFamily: fonts.mono, fontSize: 12, textTransform: "uppercase" }}>
              <span>JAHRESVERBRAUCH</span>
              <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{kwh.toLocaleString("de-DE")} kWh</span>
            </div>
            <input type="range" min={p.min} max={p.max} step={p.step} value={kwh} onChange={e => setKwh(+e.target.value)}
              style={{ width: "100%", accentColor: COL.pink, height: 24 }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.mono, fontSize: 10, opacity: 0.5, marginTop: 4 }}>
              <span>{p.min.toLocaleString("de-DE")}</span>
              <span>{p.max.toLocaleString("de-DE")}</span>
            </div>

            {/* PPA price slider */}
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: `2px dashed ${COL.black}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontFamily: fonts.mono, fontSize: 12, textTransform: "uppercase" }}>
                <span>PPA-PREIS</span>
                <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700, color: COL.black }}>{(ppaPrice * 100).toFixed(1)} ct/kWh</span>
              </div>
              <input type="range" min={0.08} max={0.26} step={0.005} value={ppaPrice} onChange={e => setPpaPrice(+e.target.value)}
                style={{ width: "100%", accentColor: COL.black, height: 24 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.mono, fontSize: 10, opacity: 0.5, marginTop: 4 }}>
                <span>8 ct</span>
                <span>26 ct</span>
              </div>
            </div>

            {/* Price breakdown */}
            <div style={{ marginTop: 20, borderTop: `2px dashed ${COL.black}`, paddingTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, textTransform: "uppercase", opacity: 0.6 }}>NETZ-PREIS</div>
                <div style={{ fontFamily: fonts.heading, fontSize: 40, fontWeight: 800, lineHeight: 1, color: COL.red }}>{(p.netz*100).toFixed(0)}<span style={{ fontSize: 16 }}>ct</span></div>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, opacity: 0.6 }}>= {Math.round(kwh*p.netz).toLocaleString("de-DE")} €/J.</div>
              </div>
              <div>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, textTransform: "uppercase", opacity: 0.6 }}>PPA-PREIS</div>
                <div style={{ fontFamily: fonts.heading, fontSize: 40, fontWeight: 800, lineHeight: 1, color: COL.black }}>{(ppaPrice*100).toFixed(1)}<span style={{ fontSize: 16 }}>ct</span></div>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, opacity: 0.6 }}>= {Math.round(kwh*ppaPrice).toLocaleString("de-DE")} €/J.</div>
              </div>
            </div>
          </div>

          {/* Middle: result mega */}
          <div style={{ background: COL.black, color: COL.yellow, border: `3px solid ${COL.black}`, padding: 28, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
            <div style={{ position: "absolute", top: -14, right: 16, background: COL.pink, color: COL.black, padding: "0 12px", fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>► ERGEBNIS</div>
            <div>
              <div style={{ fontFamily: fonts.mono, fontSize: 11, textTransform: "uppercase", opacity: 0.6, marginBottom: 4 }}>ERSPARNIS / JAHR</div>
              <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: "clamp(80px,9vw,140px)", lineHeight: 0.85, letterSpacing: "-0.04em", color: COL.cyan, fontVariantNumeric: "tabular-nums" }}>
                {yearly.toLocaleString("de-DE")}<span style={{ fontSize: ".4em", color: COL.pink }}>€</span>
              </div>
              <div style={{ fontFamily: fonts.mono, fontSize: 11, opacity: 0.5, marginTop: 8 }}>
                {(diff*100).toFixed(1)} ct/kWh Differenz
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${COL.yellow}`, marginTop: 20, paddingTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, opacity: 0.6, textTransform: "uppercase" }}>20 JAHRE</div>
                <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 32, color: COL.pink, fontVariantNumeric: "tabular-nums" }}>{twenty.toLocaleString("de-DE")} €</div>
              </div>
              <div>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, opacity: 0.6, textTransform: "uppercase" }}>CO₂ / JAHR</div>
                <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 32, color: COL.cyan, fontVariantNumeric: "tabular-nums" }}>{co2.toLocaleString("de-DE")} kg</div>
              </div>
            </div>
            <div style={{ fontFamily: fonts.mono, fontSize: 9, opacity: 0.5, marginTop: 14, lineHeight: 1.4, textTransform: "uppercase" }}>
              ⚠ ESTIMATE. exakte rechnung in beratung. preise indikativ. keine zusicherung.
            </div>
          </div>

          {/* Third column: 2 extra bullets */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, justifyContent: "center" }}>
            {[
              ["Optimal für Logistik, Industrie & Landwirtschaft", "Spezialisiert auf Hallendächer mit hohem Eigenverbrauch – dort rechnet sich PPA am stärksten."],
              ["24/7 Notfall-Hotline", "Direkter Draht zu unserem Serviceteam – nicht zur Warteschleife."],
            ].map(([h, b], i) => (
              <div key={i} style={{ borderTop: i === 0 ? "none" : `2px dashed rgba(0,0,0,0.15)`, paddingTop: i === 0 ? 0 : 24, paddingBottom: 24 }}>
                <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 15, textTransform: "uppercase", letterSpacing: "-0.01em", marginBottom: 8 }}>► {h}</div>
                <div style={{ fontFamily: fonts.serif, fontSize: 14, lineHeight: 1.55, opacity: 0.75 }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ────────────────────────────────────────
  // 2) KAUF vs. PPA — comparison
  // ────────────────────────────────────────
  function KaufVsPPA() {
    const rows = [
      ["Kapitaleinsatz",        "8.000 € – keine Grenzen", "0 €"],
      ["Wartung & Reparatur",   "Eigentümer-Sache",      "im Vertrag enthalten"],
      ["Versicherung",          "extra abzuschließen",   "wir kümmern uns"],
      ["Förderung beantragen",  "selbst",                "wir machen das"],
      ["Bilanz / GuV",          "Aktivierung als AV",    "Operating-Lease"],
      ["Strom-Preis",           "kalkulierter Eigenstrom","fester PPA-Tarif"],
      ["Vertragslaufzeit",      "lebenslang",            "20 Jahre + Option"],
      ["Reparatur-Risiko",      "100 % beim Eigentümer", "100 % bei uns"],
      ["Cashflow Jahr 1",       "negativ",               "sofort positiv"],
      ["ESG-Reporting",         "Eigenangabe",           "fertig dokumentiert"],
    ];
    return (
      <section style={{ background: COL.yellow, padding: "80px 24px", borderTop: `4px solid ${COL.black}` }}>
        <div ref={useReveal()} className="rv" style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 12, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>
            ░░░ DUELL ░░░ KAUF vs. PPA ░░░ KEINE_VERSCHWIEGENHEIT ░░░
          </div>
          <h2 style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: "clamp(56px,10vw,160px)", lineHeight: 0.85, letterSpacing: "-0.05em", margin: 0, textTransform: "uppercase" }}>
            <span style={{ background: COL.black, color: COL.yellow, padding: "0 .1em", display: "inline-block", transform: "rotate(-1deg)" }}>KAUF</span>{" "}
            <span style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 400, textTransform: "lowercase" }}>oder</span>{" "}
            <span style={{ background: COL.pink, color: COL.black, padding: "0 .1em", display: "inline-block", transform: "skew(-4deg)" }}>PPA?</span>
          </h2>
          <p style={{ fontFamily: fonts.serif, fontSize: 22, fontStyle: "italic", maxWidth: 640, marginTop: 16 }}>
            Es gibt keinen Sieger. Es gibt nur die Frage: <strong>Was passt zu deinem Cashflow?</strong>
          </p>
        </div>

        <div className="kauf-vs-ppa-table" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", border: `3px solid ${COL.black}`, background: COL.white, fontFamily: fonts.mono, fontSize: 13 }}>
          {/* Header row */}
          <div style={{ background: COL.black, color: COL.yellow, padding: "16px 20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>► KRITERIUM</div>
          <div style={{ background: COL.pink, color: COL.black, padding: "16px 20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", borderLeft: `3px solid ${COL.black}` }}>KAUF</div>
          <div style={{ background: COL.cyan, color: COL.black, padding: "16px 20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", borderLeft: `3px solid ${COL.black}` }}>PPA</div>

          {rows.map(([crit, kauf, ppa], i) => (
            <React.Fragment key={i}>
              <div style={{ padding: "14px 20px", borderTop: `1px solid ${COL.black}`, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em" }}>{crit}</div>
              <div style={{ padding: "14px 20px", borderTop: `1px solid ${COL.black}`, borderLeft: `3px solid ${COL.black}`, fontFamily: fonts.serif, fontStyle: "italic", fontSize: 15 }}>{kauf}</div>
              <div style={{ padding: "14px 20px", borderTop: `1px solid ${COL.black}`, borderLeft: `3px solid ${COL.black}`, fontFamily: fonts.serif, fontStyle: "italic", fontSize: 15, fontWeight: 700, background: i % 2 === 0 ? "transparent" : "rgba(0,255,234,0.15)" }}>{ppa}</div>
            </React.Fragment>
          ))}
        </div>
        </div>

        <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          <div style={{ background: COL.pink, border: `3px solid ${COL.black}`, padding: 24 }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>► WANN KAUF?</div>
            <p style={{ fontFamily: fonts.serif, fontSize: 17, lineHeight: 1.4, fontStyle: "italic", margin: 0 }}>
              Wenn dir <strong>Eigentum</strong> wichtiger ist als Cashflow. Wenn du <strong>Kapital frei</strong> hast und es lange binden willst.
            </p>
          </div>
          <div style={{ background: COL.cyan, border: `3px solid ${COL.black}`, padding: 24 }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>► WANN PPA?</div>
            <p style={{ fontFamily: fonts.serif, fontSize: 17, lineHeight: 1.4, fontStyle: "italic", margin: 0 }}>
              Wenn du <strong>kein Geld bindest</strong>. Wenn dein <strong>Stromverbrauch hoch</strong> ist. Wenn du <strong>keinen Bock auf Wartung</strong> hast.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ────────────────────────────────────────
  // 3) ÜBER UNS — Doris + Werte
  // ────────────────────────────────────────
  function AboutDoris() {
    const werte = [
      ["EHRLICH", "Wenn sich was nicht rechnet, sagen wirs.", COL.pink],
      ["FACHBETRIEBE", "Eigenes Festpersonal. Keine Einzelunternehmer.", COL.cyan],
      ["SCHNELL", "Anlagen in 1–5 Tagen fertig.", COL.orange],
      ["DA", "24/7 Notfall. Echte Menschen.", COL.yellow],
    ];
    return (
      <section id="ueberuns" style={{ background: COL.black, color: COL.yellow, padding: "80px 24px", borderTop: `4px solid ${COL.black}` }}>
        <div ref={useReveal()} className="rv" style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 12, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16, color: COL.cyan }}>
            ░░░ KAPITEL_07 ░░░ ÜBER UNS ░░░ DEGGENDORF ░░░
          </div>
          <h2 style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: "clamp(56px,11vw,180px)", lineHeight: 0.85, letterSpacing: "-0.05em", margin: 0, textTransform: "uppercase" }}>
            HANDWERK<br/>
            <span style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 400, textTransform: "lowercase" }}>mit</span>{" "}
            <span style={{ background: COL.cyan, color: COL.black, padding: "0 .1em", display: "inline-block", transform: "rotate(-2deg)" }}>HALTUNG.</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 40, alignItems: "start" }}>
          {/* Doris card */}
          <div className="lift" style={{ background: COL.yellow, color: COL.black, border: `3px solid ${COL.yellow}`, padding: 0, transform: "rotate(-1deg)", position: "relative" }}>
            <div style={{ position: "relative", borderBottom: `3px solid ${COL.black}`, overflow: "hidden" }}>
              <img src="doris-warhol.jpg" alt="Doris Pilsner-Albrecht" style={{ width: "100%", display: "block" }} />
              <div style={{ position: "absolute", top: 12, right: 12, background: COL.black, color: COL.yellow, padding: "4px 10px", fontFamily: fonts.mono, fontSize: 10, fontWeight: 700, transform: "rotate(4deg)" }}>INHABERIN</div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ fontFamily: fonts.heading, fontSize: 32, fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 0.95 }}>DORIS<br/>PILSNER-<br/>ALBRECHT</div>
              <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginTop: 8, opacity: 0.7 }}>► Geschäftsführerin · Pilsner Vertriebs GmbH</div>
              <p style={{ fontFamily: fonts.serif, fontSize: 16, lineHeight: 1.4, fontStyle: "italic", marginTop: 14, marginBottom: 0 }}>
                "Ich verkaufe nur, was ich auch meiner Mutter aufs Dach setzen würde. Punkt."
              </p>
            </div>
          </div>

          {/* Body + werte */}
          <div>
            <p style={{ fontFamily: fonts.serif, fontSize: 22, lineHeight: 1.4, fontStyle: "italic", margin: 0, opacity: 0.95 }}>
              {D.about.body}
            </p>
            <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {werte.map(([k, v, c], i) => (
                <div key={i} className="lift" style={{ background: c, color: COL.black, border: `3px solid ${COL.yellow}`, padding: 20, transform: `rotate(${[1,-1,2,-2][i]||0}deg)` }}>
                  <div style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: 32, lineHeight: 0.9, textTransform: "uppercase", letterSpacing: "-0.03em" }}>{k}</div>
                  <div style={{ fontFamily: fonts.mono, fontSize: 12, marginTop: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Strip of points */}
            <div style={{ marginTop: 28, border: `3px solid ${COL.yellow}`, padding: 0 }}>
              {D.about.points.map(([k, v], i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "200px 1fr", borderTop: i ? `1px solid ${COL.yellow}` : "none", padding: "12px 16px", fontFamily: fonts.mono, fontSize: 12, alignItems: "center" }}>
                  <span style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: COL.cyan }}>► {k}</span>
                  <span style={{ opacity: 0.85 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ────────────────────────────────────────
  // 4) GEBIETS-KARTE — abstract Bayern
  // ────────────────────────────────────────
  function GebietsKarte() {
    // Grid of abstract dots representing locations
    const cities = [
      { n: "Deggendorf",  t: "HQ",          x: 62, y: 55, big: true },
      { n: "Straubing",    t: "PPA 380kWp", x: 50, y: 50 },
      { n: "Plattling",    t: "160 kWp",    x: 58, y: 53 },
      { n: "Passau",       t: "8.4 kWp",    x: 75, y: 65 },
      { n: "Regensburg",   t: "PPA 750kWp", x: 42, y: 45 },
      { n: "Landshut",     t: "Komplett",   x: 45, y: 60 },
      { n: "München",      t: "12 kWp",     x: 38, y: 70 },
      { n: "Nürnberg",     t: "PPA 220",    x: 28, y: 30 },
      { n: "Würzburg",     t: "180 kWp",    x: 18, y: 22 },
      { n: "Augsburg",     t: "9 kWp",      x: 30, y: 65 },
      { n: "Ingolstadt",   t: "Gewerbe",    x: 38, y: 50 },
      { n: "Cham",         t: "PV+Speicher",x: 60, y: 35 },
    ];
    return (
      <section style={{ background: COL.cyan, color: COL.black, padding: "80px 24px", borderTop: `4px solid ${COL.black}`, position: "relative", overflow: "hidden" }}>
        <div ref={useReveal()} className="rv" style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 12, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>
            ░░░ EINSATZGEBIET ░░░ HQ:DEGGENDORF ░░░ BUNDESWEIT ░░░
          </div>
          <h2 style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: "clamp(56px,10vw,160px)", lineHeight: 0.85, letterSpacing: "-0.05em", margin: 0, textTransform: "uppercase" }}>
            BAYERN<br/>
            <span style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 400, textTransform: "lowercase" }}>plus</span>{" "}
            <span style={{ background: COL.black, color: COL.cyan, padding: "0 .1em", display: "inline-block", transform: "skew(-4deg)" }}>RUNDHERUM.</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "start" }}>
          {/* Abstract map */}
          <div style={{ background: COL.yellow, border: `3px solid ${COL.black}`, position: "relative", aspectRatio: "1.2/1", overflow: "hidden" }}>
            {/* Grid backdrop */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              {[...Array(11)].map((_,i) => <line key={"h"+i} x1="0" y1={i*10} x2="100" y2={i*10} stroke={COL.black} strokeWidth="0.1" opacity="0.3"/>)}
              {[...Array(11)].map((_,i) => <line key={"v"+i} x1={i*10} y1="0" x2={i*10} y2="100" stroke={COL.black} strokeWidth="0.1" opacity="0.3"/>)}
              {/* Stylized Bayern blob */}
              <path d="M15,18 Q10,30 14,50 Q8,65 22,75 Q35,85 50,80 Q72,82 80,68 Q88,55 78,40 Q82,25 65,18 Q45,12 30,15 Q20,14 15,18 Z"
                fill={COL.pink} stroke={COL.black} strokeWidth="0.6" opacity="0.6"/>
            </svg>
            {/* Pins */}
            {cities.map((c, i) => (
              <div key={i} style={{ position: "absolute", left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%,-50%)", textAlign: "center" }}>
                <div style={{
                  width: c.big ? 22 : 12, height: c.big ? 22 : 12,
                  background: c.big ? COL.black : COL.white,
                  border: `2px solid ${COL.black}`, borderRadius: "50%",
                  margin: "0 auto",
                  boxShadow: c.big ? `0 0 0 4px ${COL.cyan}, 0 0 0 6px ${COL.black}` : "none",
                  animation: c.big ? "pulse 2s ease-in-out infinite" : "none",
                }}/>
                <div style={{
                  marginTop: 4, fontFamily: fonts.mono, fontSize: c.big ? 11 : 9, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: ".03em", whiteSpace: "nowrap",
                  background: c.big ? COL.black : "transparent",
                  color: c.big ? COL.yellow : COL.black,
                  padding: c.big ? "2px 6px" : 0,
                }}>{c.n}</div>
                {c.big && <div style={{ fontFamily: fonts.mono, fontSize: 9, marginTop: 2, color: COL.black }}>HAUPTQUARTIER</div>}
              </div>
            ))}
            {/* Compass */}
            <div style={{ position: "absolute", bottom: 16, right: 16, background: COL.black, color: COL.yellow, padding: 12, fontFamily: fonts.mono, fontSize: 10, fontWeight: 700, textAlign: "center", border: `2px solid ${COL.black}` }}>
              N<br/>↑<br/>SÜDOST<br/>BAYERN
            </div>
            {/* Scale bar */}
            <div style={{ position: "absolute", bottom: 16, left: 16, fontFamily: fonts.mono, fontSize: 10, fontWeight: 700, color: COL.black }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 60, height: 6, background: `repeating-linear-gradient(90deg, ${COL.black} 0 10px, ${COL.white} 10px 20px)`, border: `1px solid ${COL.black}` }}/>
                <span>~ 100 KM</span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <div style={{ background: COL.black, color: COL.yellow, padding: 24, border: `3px solid ${COL.black}`, marginBottom: 16 }}>
              <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: COL.cyan, marginBottom: 8 }}>► HQ</div>
              <div style={{ fontFamily: fonts.heading, fontSize: 36, fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 0.95 }}>{D.brand.location}</div>
              <div style={{ fontFamily: fonts.mono, fontSize: 12, marginTop: 8, opacity: 0.8 }}>{D.brand.address}</div>
              <div style={{ fontFamily: fonts.mono, fontSize: 12, marginTop: 4, color: COL.cyan }}>{D.brand.phone}</div>
            </div>

            <div style={{ background: COL.white, border: `3px solid ${COL.black}`, padding: 0 }}>
              <div style={{ background: COL.black, color: COL.yellow, padding: "10px 16px", fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>► EINSATZRADIUS</div>
              {[
                ["Bayern",            "Standard-Gebiet",   "alle Regionen"],
                ["Baden-Württemberg", "Standard-Gebiet",   "alle Regionen"],
                ["Bundesweit",        "auf Anfrage",       "ab 100 kWp"],
                ["Großprojekte",      "wir kommen hin",    "deutschlandweit"],
                ["Ausland",           "Einzelfall",        "auf Anfrage"],
              ].map(([reg, st, dist], i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 0.8fr", borderTop: `1px solid ${COL.black}`, padding: "10px 16px", fontFamily: fonts.mono, fontSize: 12, alignItems: "center" }}>
                  <span style={{ fontWeight: 700, textTransform: "uppercase" }}>{reg}</span>
                  <span style={{ fontFamily: fonts.serif, fontStyle: "italic" }}>{st}</span>
                  <span style={{ textAlign: "right", color: COL.red, fontWeight: 700 }}>{dist}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, fontFamily: fonts.serif, fontSize: 18, fontStyle: "italic", lineHeight: 1.4 }}>
              Du bist <strong>weiter weg</strong>? Erstgespräch ist trotzdem <strong>gratis</strong>. Anruf reicht.
            </div>
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.15)}}`}</style>
      </section>
    );
  }

  // ────────────────────────────────────────
  // 5) FÖRDERUNG 2026
  // ────────────────────────────────────────
  function Foerderung() {
    const programs = [
      { code: "KfW-270", name: "Erneuerbare Energien Standard", body: "Zinsgünstiger Kredit für PV, Speicher, Wärmepumpe. Bis 100 % Investitionssumme.", max: "bis 50 Mio €", level: "BUND", color: COL.cyan },
      { code: "KfW-442", name: "Solarstrom für Elektroautos", body: "Zuschuss für PV + Speicher + Wallbox als Komplettlösung. Antrag vor Kauf!", max: "bis 10.200 €", level: "BUND", color: COL.pink },
      { code: "BAFA",    name: "Bundesförderung effiziente Gebäude", body: "Heizungstausch + Wärmepumpe. Bis zu 70 % der Investitionskosten.", max: "bis 23.500 €", level: "BUND", color: COL.orange },
      { code: "10000-Häuser", name: "Bayern: PV-Speicher-Bonus", body: "Landesförderung für Eigenheim-Speicher in Bayern. Ergänzung zur KfW.", max: "bis 3.200 €", level: "BAYERN", color: COL.yellow },
      { code: "EEG-2023", name: "Einspeise-Vergütung", body: "Garantierte Einspeisung über 20 Jahre. Aktueller Tarif richtet sich nach Anlagengröße.", max: "8,11 ct/kWh", level: "BUND", color: COL.cyan },
      { code: "Komm.",  name: "Kommunale Programme", body: "Viele Städte/Landkreise haben eigene Töpfe. Wir prüfen für dein Projekt — kostenfrei.", max: "varies", level: "LOKAL", color: COL.pink },
    ];
    return (
      <section style={{ background: COL.pink, color: COL.black, padding: "80px 24px", borderTop: `4px solid ${COL.black}` }}>
        <div ref={useReveal()} className="rv" style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 12, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>
            ░░░ KAPITEL_08 ░░░ FÖRDERUNG 2026 ░░░ FREIES_GELD ░░░
          </div>
          <h2 style={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: "clamp(56px,11vw,180px)", lineHeight: 0.85, letterSpacing: "-0.05em", margin: 0, textTransform: "uppercase" }}>
            <span style={{ background: COL.black, color: COL.yellow, padding: "0 .1em", display: "inline-block", transform: "rotate(-1deg)" }}>FREIES</span><br/>
            <span style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 400, textTransform: "lowercase" }}>geld vom</span>{" "}
            <span style={{ background: COL.cyan, color: COL.black, padding: "0 .1em", display: "inline-block", transform: "skew(-4deg)" }}>STAAT.</span>
          </h2>
          <p style={{ fontFamily: fonts.serif, fontSize: 22, fontStyle: "italic", maxWidth: 720, marginTop: 16, lineHeight: 1.4 }}>
            Wir kennen die Programme. Wir füllen die Anträge. Wir streiten mit der Behörde. Du musst nur unterschreiben.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {programs.map((p, i) => (
            <div key={i} ref={useReveal()} className="rv lift" style={{ background: p.color, border: `3px solid ${COL.black}`, padding: 20, position: "relative", transform: `rotate(${[1,-1,1.5,-1.5,0.5,-0.5][i]||0}deg)` }}>
              <div style={{ position: "absolute", top: -14, left: 14, background: COL.black, color: COL.yellow, padding: "4px 10px", fontFamily: fonts.mono, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>{p.level}</div>
              <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 6, opacity: 0.7 }}>► {p.code}</div>
              <h3 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 800, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 12px" }}>{p.name}</h3>
              <p style={{ fontFamily: fonts.serif, fontSize: 14, lineHeight: 1.4, margin: "0 0 16px" }}>{p.body}</p>
              <div style={{ borderTop: `2px dashed ${COL.black}`, paddingTop: 10, fontFamily: fonts.mono, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>
                MAX: <span style={{ color: COL.red, fontSize: 16 }}>{p.max}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, background: COL.black, color: COL.yellow, padding: 24, border: `3px solid ${COL.black}`, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: COL.cyan, marginBottom: 6 }}>► UNSER ANGEBOT</div>
            <div style={{ fontFamily: fonts.heading, fontSize: 32, fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1 }}>FÖRDER-CHECK. KOSTENFREI.</div>
            <p style={{ fontFamily: fonts.serif, fontSize: 16, fontStyle: "italic", marginTop: 10, marginBottom: 0, opacity: 0.9 }}>
              30 Minuten — wir prüfen Bund, Land und Kommune für dein konkretes Projekt. Du bekommst eine Liste mit Beträgen, Fristen und Bedingungen.
            </p>
          </div>
          <a href="#kontakt" className="lift" style={{ background: COL.pink, color: COL.black, padding: "20px 28px", border: `3px solid ${COL.yellow}`, fontFamily: fonts.heading, fontWeight: 800, fontSize: 18, textTransform: "uppercase", textDecoration: "none", letterSpacing: "-0.01em" }}>[→] CHECK STARTEN</a>
        </div>
      </section>
    );
  }

  window.RadExtras = { PPACalc, KaufVsPPA, AboutDoris, GebietsKarte, Foerderung };
})();
