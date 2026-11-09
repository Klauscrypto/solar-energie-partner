#!/usr/bin/env python3
"""
Solar Energie Partner — KI-Blog-Generator
Wird täglich via GitHub Actions ausgeführt.
Gerade Tage → Ratgeber  |  Ungerade Tage → Blog-Artikel

Umgebungsvariablen:
  ANTHROPIC_API_KEY  — Pflichtfeld (GitHub Secret)

Aufruf:
  python3 scripts/generate-blog.py            # echter Lauf (Claude-API)
  python3 scripts/generate-blog.py --mock     # Trockenlauf ohne API-Aufruf
                                              # (schreibt Dateien wie ein echter Lauf,
                                              #  nur auf einer Kopie des Repos verwenden)
  python3 scripts/generate-blog.py --sync     # nur Index/Sitemap aus blog/*.html abgleichen

Regeln:
  - Bereits vorhandene Artikel-Dateien werden NIE überschrieben.
  - Benutzte Slugs = Dateien in blog/ (nicht nur der Index).
  - Der Index wird nicht gekappt; Artikel ohne Index-Eintrag werden nachgetragen.
  - sitemap.xml (Abschnitt zwischen den BLOG-ARTICLES-Markern) wird mitgeschrieben.
"""

import os
import sys
import json
import re
import datetime
import html
from pathlib import Path


# ── Konfiguration ────────────────────────────────────────────────────────────

SITE_URL    = "https://solar-energie-partner.de"
ROOT_DIR    = Path(__file__).resolve().parent.parent
BLOG_DIR    = ROOT_DIR / "blog"
SITEMAP     = ROOT_DIR / "sitemap.xml"
SITEMAP_START = "<!-- BLOG-ARTICLES:START (automatisch, generate-blog.py) -->"
SITEMAP_END   = "<!-- BLOG-ARTICLES:END -->"
CARDS_START   = "<!-- STATIC-CARDS:START (automatisch, generate-blog.py) -->"
CARDS_END     = "<!-- STATIC-CARDS:END -->"
# BLOG_TODAY=JJJJ-MM-TT nur für Tests (Trockenlauf mit anderem Datum)
TODAY       = (datetime.date.fromisoformat(os.environ["BLOG_TODAY"])
               if os.environ.get("BLOG_TODAY") else datetime.date.today())
IS_RATGEBER = TODAY.day % 2 == 0   # Gerade Tage = Ratgeber, ungerade = Blog

ARTICLE_TOPICS_BLOG = [
    "Lohnt sich Photovoltaik 2026 noch?",
    "Warum steigen Strompreise weiter?",
    "PPA vs. Kauf: Was ist 2026 sinnvoller?",
    "Speicher richtig dimensionieren — Schritt für Schritt",
    "Eigenverbrauch erhöhen: 5 Tipps die wirklich helfen",
    "Wärmepumpe + PV: Synergie oder Mythos?",
    "Repowering alter PV-Anlagen: Wann lohnt es sich?",
    "Wallbox und PV kombinieren",
    "Null-Energie-Haus mit Solar in Bayern — realistisch?",
    "Wie lange hält eine Solaranlage wirklich?",
    "E-Auto laden mit Solarstrom — so geht's richtig",
    "Balkonkraftwerk vs. Dachanlage: Ehrlicher Vergleich",
    "Stromspeicher ohne PV — sinnvoll oder nicht?",
    "Einspeisevergütung 2026 — lohnt der Vergleich?",
    "Solaranlage bei Eigenheim-Kauf: Was prüfen?",
    "Warum viele PV-Anlagen in Bayern zu klein geplant werden",
    "Mieterstrommodell: Lohnt sich das für Vermieter?",
    "PV-Anlage im Winter: Was Betreiber wirklich erwarten können",
    "Flachdach-PV für Gewerbe: Die ehrliche Rechnung",
    "Solaranlage auf dem Denkmalschutz-Haus — geht das?",
    "Warum Ost-West-Ausrichtung oft besser ist als Süd",
    "Blackout-Vorsorge mit PV und Speicher — wie realistisch?",
    "PV-Rendite berechnen: Was Verkäufer verschweigen",
    "Netzüberlastung in Bayern: Warum Speicher wichtiger werden",
    "Bifaziale Module: Lohnen sich die Mehrkosten?",
    "Hauskauf mit alter PV-Anlage: Worauf achten?",
    "Gewerbe-Strom selbst erzeugen: Was sich 2026 rechnet",
    "Photovoltaik auf Carport — oft unterschätzte Option",
    "Solaranlage und Hausverkauf: Wertsteigerung oder Last?",
    "Warum günstige PV-Angebote oft teuer werden",
    "Eigenheim ohne Gasanschluss — geht das mit PV?",
    "Wie viel Dach brauche ich wirklich für PV in Bayern?",
    "Batterielebensdauer: Was nach 10 Jahren wirklich passiert",
    "Sonnenstunden in Deggendorf vs. Rest von Deutschland",
    "Verbrauchsanalyse vor PV-Kauf: Warum die meisten es falsch machen",
    "Peak Shaving mit PV: Lastspitzen im Gewerbe senken",
    "Was kostet Solarstrom wirklich — Vollkostenrechnung",
    "Dachsanierung und PV: Was gleichzeitig erledigen?",
    "Direktvermarktung von Solarstrom: Lohnt sich das?",
    "Netzanschluss-Verzögerungen in Bayern — was steckt dahinter?",
    "Photovoltaik-Finanzierung: Leasing, Kredit oder Eigenkapital?",
    "Smart Meter Pflicht: Was ändert sich für PV-Betreiber?",
    "Stromspeicher: Lithium vs. Salzwasser vs. Redox-Flow",
    "Wann sich ein zweiter Speicher lohnt",
    "PV und Heizspirale: Überschussstrom clever nutzen",
    "Regionale Installateure vs. Großfirmen: Ehrlicher Vergleich",
    "Agri-PV in Bayern: Landwirtschaft und Solar kombinieren",
    "Fassaden-PV: Nische oder Zukunft?",
    "PV im Gewerbepark: Mieterstrom als Nebengeschäft",
    "KI und Energiemanagement: Was Smart-Home-Systeme wirklich können",
    "Warum 10 kWp oft die falsche Grenze ist",
    "Gewerbe-PPA in der Praxis: Erfahrungsbericht aus Bayern",
    "Photovoltaik-Leasing für Gewerbe: Vor- und Nachteile",
    "Tracking-Systeme für PV: Sinnvoll oder überteuert?",
    "Community Solar: Gemeinsam eine Anlage betreiben in Bayern",
    "PV-Anlage auf Gewerbehalle: Typische Fehler beim Planen",
    "Eigenheim-PV im Altbau: Besonderheiten und Chancen",
    "Stromspeicher-Förderung Bayern 2026: Was gibt es noch?",
    "PV-Versicherung: Was wirklich versichert sein muss",
    "Nulleinspeisung bei Gewerbe: Sinnvoll oder Energieverschwendung?",
]

ARTICLE_TOPICS_RATGEBER = [
    "KfW 270: Antrag stellen Schritt für Schritt",
    "Marktstammdatenregister: Alles was PV-Betreiber wissen müssen",
    "Netzanschluss beantragen: Ablauf und Zeitplan",
    "EEG-Einspeisevergütung berechnen",
    "PV-Anlage versichern: Welche Police brauche ich?",
    "Dachstatik für PV: Was muss ich prüfen lassen?",
    "Steuer und PV: Was gilt 2026?",
    "Gewerbe-PPA: Checkliste für den Vertragsabschluss",
    "0% MwSt auf PV-Anlagen: Wer profitiert wie?",
    "Monitoring-Systeme für PV: Überblick und Vergleich",
    "Solaranlage anmelden: Schritt-für-Schritt-Anleitung",
    "Einspeisevertrag mit dem Netzbetreiber: Was steht drin?",
    "Garantien und Gewährleistung bei PV-Anlagen erklärt",
    "Fördermittel Bayern 2026: Vollständiger Überblick",
    "Wartungsvertrag PV: Was ist sinnvoll, was Abzocke?",
    "Angebot für PV-Anlage prüfen: Checkliste für Käufer",
    "Speicher-Förderung beantragen: Anleitung für Bayern",
    "Eigenverbrauchsoptimierung: Checkliste für mehr Autarkie",
    "WEG und PV: So klappt der Beschluss in der Eigentümergemeinschaft",
    "Balkonkraftwerk anmelden: Was wirklich gilt 2026",
    "Photovoltaik-Anlage abschreiben: Steuerliche Anleitung",
    "Smart Meter einbauen lassen: Schritt-für-Schritt",
    "Einspeisemanagement: Was bedeutet das für meine Anlage?",
    "PV-Anlage bei Hausverkauf: Was zu beachten ist",
    "Stromspeicher warten: Was einmal im Jahr geprüft werden muss",
    "Netzverträglichkeitsprüfung: Was steckt dahinter?",
    "PV-Anlagegröße berechnen: Formel und Beispiele für Bayern",
    "Förderprogramme für Gewerbe-PV in Bayern 2026",
    "Stromspeicher kaufen: Worauf bei der Auswahl achten",
    "Ertragsgarantie prüfen: Was Hersteller wirklich versprechen",
    "EEG-Einspeisevergütung richtig versteuern",
    "Notstrombetrieb mit PV und Speicher einrichten",
    "Wärmepumpe und PV kombinieren: Planungsleitfaden",
    "Wallbox mit PV verbinden: Technische Anforderungen",
    "PV-Anlage reinigen: Wann, wie, womit?",
    "Speicherkapazität berechnen: Schritt-für-Schritt-Anleitung",
    "PV-Anlage finanzieren: KfW, Sparkasse oder Solar-Leasing?",
    "Mieterstrom-Modell einrichten: Rechtliche Grundlagen",
    "Schattenanalyse für PV: Methoden im Vergleich",
    "Wechselrichter tauschen: Anleitung und Kosten",
    "PV-Ertrag steigern: Optimierer oder Mikrowechselrichter?",
    "Gebäudeenergiegesetz und PV: Was Hausbesitzer wissen müssen",
    "Stromspeicher-Garantie prüfen: Worauf achten?",
    "PV-Anlage bei Erbschaft: Steuer und Übertragung",
    "Eigenheim-PV planen: Checkliste von Dach bis Einspeisung",
    "Lastganganalyse für Gewerbe: Wie funktioniert das?",
    "Inselanlagen für Bayern: Wann sinnvoll, wann nicht?",
    "PV-Anlage auf Garagen und Nebengebäuden: Was erlaubt ist",
    "Photovoltaik und Denkmalschutz: Was ist genehmigungsfähig?",
    "Gewerblicher Eigenverbrauch: Steuerliche Behandlung 2026",
    "Direktvermarktung anmelden: Wer macht das und wie?",
    "PV-Anlage auf Pachtland: Was im Vertrag stehen muss",
    "Dachausrichtung und Neigungswinkel: Was wirklich zählt",
    "Energieausweis und PV: Was sich für Hausbesitzer ändert",
    "CO₂-Bilanz einer PV-Anlage: Fakten und Amortisation",
    "Einspeisemanagement abschalten: Wann und wie?",
    "Speicherförderung 2026: Aktuelle Konditionen in Bayern",
    "Repowering beantragen: Ablauf und Förderung",
    "PV-Anlage auf dem Flachdach: Aufständerung und Statik",
    "Eigenheim-PV und Grundbuch: Was eingetragen werden muss",
]


def existing_slugs() -> set[str]:
    """Alle Slugs, für die bereits eine Datei in blog/ existiert."""
    return {p.stem for p in BLOG_DIR.glob("*.html") if p.stem != "index"}


def pick_topic(used_slugs: set[str]) -> tuple[str, str] | None:
    """Wählt ein noch nicht verwendetes Thema. None, wenn alle Themen vergeben sind."""
    topics = ARTICLE_TOPICS_RATGEBER if IS_RATGEBER else ARTICLE_TOPICS_BLOG
    for topic in topics:
        slug_candidate = slugify(topic)
        if slug_candidate not in used_slugs:
            return topic, slug_candidate
    # Keine Themen mehr: lieber nichts erzeugen als ein Thema doppelt.
    return None


def slugify(text: str) -> str:
    text = text.lower()
    text = text.replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:60]


def load_index() -> dict:
    """Lädt den Artikel-Index aus blog/index.html."""
    idx_path = BLOG_DIR / "index.html"
    content = idx_path.read_text(encoding="utf-8")
    m = re.search(r"const ARTICLES = (\[.*?\]);", content, re.DOTALL)
    if m:
        try:
            return json.loads(m.group(1))
        except json.JSONDecodeError:
            pass
    return []


def _parse_date(d: str) -> datetime.date:
    try:
        return datetime.datetime.strptime(d, "%d.%m.%Y").date()
    except (ValueError, TypeError):
        return datetime.date(1970, 1, 1)


def article_meta_from_file(path: Path) -> dict:
    """Liest Titel, Tag und Datum aus einer bestehenden Artikel-Datei."""
    content = path.read_text(encoding="utf-8")
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", content, re.DOTALL)
    title = html.unescape(re.sub(r"<[^>]+>", "", h1.group(1)).strip()) if h1 else path.stem
    meta = re.search(r'<span class="tag">([^<]+)</span>\s*<span>([0-9.]+)</span>', content)
    tag = meta.group(1).strip().lower() if meta else "blog"
    date = meta.group(2).strip() if meta else TODAY.strftime("%d.%m.%Y")
    first_p = re.search(r"<p[^>]*>(.*?)</p>", content.split("<article>", 1)[-1], re.DOTALL)
    excerpt = html.unescape(re.sub(r"<[^>]+>", "", first_p.group(1)).strip()) if first_p else title
    if len(excerpt) > 160:
        excerpt = excerpt[:157].rsplit(" ", 1)[0] + " …"
    return {"slug": path.stem, "title": title, "excerpt": excerpt, "tag": tag, "date": date}


def sync_index(articles: list[dict]) -> list[dict]:
    """Ergänzt Artikel-Dateien ohne Index-Eintrag, entfernt Einträge ohne Datei,
    entfernt doppelte Slugs und sortiert neueste zuerst. Keine Obergrenze."""
    files = existing_slugs()
    seen: set[str] = set()
    result = []
    for a in articles:
        if a.get("slug") in files and a["slug"] not in seen:
            seen.add(a["slug"])
            result.append(a)
    for slug in sorted(files - seen):
        result.append(article_meta_from_file(BLOG_DIR / f"{slug}.html"))
        print(f"Index: nachgetragen {slug}")
    result.sort(key=lambda a: _parse_date(a.get("date")), reverse=True)
    return result


def _static_cards(articles: list[dict]) -> str:
    """Statische Karten für Crawler/ohne JS; renderGrid() ersetzt sie im Browser."""
    e = html.escape
    out = []
    for a in articles:
        tag = e(a["tag"])
        out.append(
            f'    <a class="card" href="{e(a["slug"])}.html"><div class="card-top">'
            f'<span class="card-tag {tag}">{tag.upper()}</span>'
            f'<h2>{e(a["title"])}</h2><p>{e(a["excerpt"])}</p></div>'
            f'<div class="card-bottom"><span>{e(a["date"])}</span><span class="arrow">→</span></div></a>'
        )
    return "\n".join(out)


def save_index(articles: list[dict]) -> None:
    """Schreibt den Artikel-Index (JS-Array + statische Karten) in blog/index.html zurück."""
    idx_path = BLOG_DIR / "index.html"
    content = idx_path.read_text(encoding="utf-8")
    # "</" escapen, damit ein Titel das <script> nicht beenden kann
    articles_json = json.dumps(articles, ensure_ascii=False, indent=2).replace("</", "<\\/")
    new_content = re.sub(
        r"const ARTICLES = \[.*?\];",
        lambda _m: f"const ARTICLES = {articles_json};",
        content,
        flags=re.DOTALL,
    )
    cards = f"{CARDS_START}\n{_static_cards(articles)}\n    {CARDS_END}"
    if CARDS_START in new_content:
        new_content = re.sub(
            re.escape(CARDS_START) + r".*?" + re.escape(CARDS_END),
            lambda _m: cards,
            new_content,
            flags=re.DOTALL,
        )
    else:
        new_content = new_content.replace(
            "<!-- Articles injected by generate-blog.py -->",
            "<!-- Articles injected by generate-blog.py -->\n    " + cards,
            1,
        )
    idx_path.write_text(new_content, encoding="utf-8")


def save_sitemap(articles: list[dict]) -> None:
    """Schreibt alle Blog-Artikel in sitemap.xml (zwischen den Markern)."""
    if not SITEMAP.exists():
        print("WARN: sitemap.xml fehlt, übersprungen")
        return
    content = SITEMAP.read_text(encoding="utf-8")
    lines = []
    for a in articles:
        lastmod = _parse_date(a.get("date"))
        lm = f"<lastmod>{lastmod.isoformat()}</lastmod>" if lastmod.year > 1970 else ""
        lines.append(
            f"  <url><loc>{SITE_URL}/blog/{html.escape(a['slug'])}.html</loc>{lm}"
            f"<changefreq>monthly</changefreq><priority>0.6</priority></url>"
        )
    block = f"{SITEMAP_START}\n" + "\n".join(lines) + f"\n  {SITEMAP_END}"
    if SITEMAP_START in content:
        content = re.sub(
            re.escape(SITEMAP_START) + r".*?" + re.escape(SITEMAP_END),
            lambda _m: block,
            content,
            flags=re.DOTALL,
        )
    else:
        content = content.replace("</urlset>", f"  {block}\n</urlset>", 1)
    SITEMAP.write_text(content, encoding="utf-8")


def generate_article(topic: str, tag: str) -> tuple[str, str, str]:
    """
    Lässt Claude den Artikel generieren.
    Gibt (html_body, excerpt, h1_title) zurück.
    """
    try:
        import anthropic
    except ImportError:
        print("ERROR: anthropic package not installed. Run: pip install anthropic")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    article_type = "Ratgeber (praktische Anleitung / Checkliste)" if IS_RATGEBER else "Blog-Artikel (Meinung, Analyse, Praxisbericht)"

    system = """Du bist Content-Autor für Solar Energie Partner, eine inhabergeführte Firma aus Deggendorf (Bayern).
Die Marke ist direkt, ehrlich, leicht provokant — kein Werbesprech, kein Bullshit.
Zielgruppe: Eigenheimbesitzer und Gewerbetreibende in Bayern, die ernsthaft über PV nachdenken.
Schreib auf Deutsch. Duze den Leser. Keine Emojis. Keine Bullet-Points ohne Mehrwert.
Die Inhalte müssen faktisch korrekt und stand 2026 sein.
Nenne keine konkreten Förderbeträge, Einspeisevergütungssätze oder Zinssätze, sondern verweise
auf die aktuellen Angaben von KfW, BAFA bzw. Bundesnetzagentur (Sätze ändern sich halbjährlich).
Das KfW-Programm 442 und das bayerische 10.000-Häuser-/PV-Speicher-Programm gibt es nicht mehr;
stelle sie nicht als verfügbar dar."""

    prompt = f"""Erstelle einen {article_type} zum Thema: **{topic}**

Struktur:
- H1: prägnante, SEO-freundliche Überschrift (Thema + Deggendorf/Bayern wo passend)
- 1 kurzer Einleitungsabsatz (3–4 Sätze, Kernutzen sofort klar)
- 3–5 Abschnitte mit H2-Überschriften (je 150–250 Wörter)
- 1 konkreter Handlungshinweis am Ende (kein allgemeines CTA, sondern echte Info)

Ausgabe: reines HTML (nur was ins <article>-Tag kommt, kein <html>/<head>/<body>).
Kein Markdown. Nur <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>.
Direkt nach dem HTML: eine Zeile "EXCERPT: " gefolgt von maximal 160 Zeichen Zusammenfassung."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        system=system,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text

    # Excerpt extrahieren
    excerpt_match = re.search(r"EXCERPT:\s*(.+)", raw)
    excerpt = excerpt_match.group(1).strip()[:200] if excerpt_match else topic

    # HTML-Body: alles bis EXCERPT
    html_body = raw.split("EXCERPT:")[0].strip()

    # H1 extrahieren
    h1_match = re.search(r"<h1[^>]*>(.*?)</h1>", html_body, re.DOTALL)
    title = re.sub(r"<[^>]+>", "", h1_match.group(1)).strip() if h1_match else topic

    return html_body, excerpt, title


def mock_article(topic: str, tag: str) -> tuple[str, str, str]:
    """Ersatz für generate_article() im Trockenlauf (kein API-Aufruf)."""
    body = f"<h1>{html.escape(topic)} <Test & \"Mock\"></h1>\n<p>Trockenlauf-Inhalt.</p>"
    return body, f"Mock-Excerpt zu {topic}", f'{topic} <Test & "Mock">'


def build_article_page(slug: str, html_body: str, title: str, tag: str) -> str:
    title = html.escape(title, quote=True)
    tag_color = {"ratgeber": "#00ffea", "blog": "#ff00aa", "aktuell": "#fdfd00"}.get(tag, "#fdfd00")
    tag_text_color = "#0a0a0a" if tag != "blog" else "#ffffff"
    date_str = TODAY.strftime("%d.%m.%Y")

    return f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title} — Solar Energie Partner</title>
<meta name="description" content="{title}. Praxiswissen von Solar Energie Partner aus Deggendorf." />
<link rel="canonical" href="{SITE_URL}/blog/{slug}.html" />
<link rel="stylesheet" href="../fonts/fonts.css" />
<style>
  *,*::before,*::after{{box-sizing:border-box}}
  html,body{{margin:0;padding:0;background:#fdfd00;color:#0a0a0a;font-family:"Bricolage Grotesque",system-ui,sans-serif}}
  ::selection{{background:#0a0a0a;color:#fdfd00}}
  a{{color:inherit}}
  header{{position:sticky;top:0;z-index:50;background:#0a0a0a;color:#fdfd00;border-bottom:4px solid #fdfd00;padding:10px 24px;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:"JetBrains Mono",monospace;font-size:11px;text-transform:uppercase;letter-spacing:.05em}}
  header a{{color:#fdfd00;text-decoration:none}}
  @media(max-width:768px){{header nav{{display:none}}}}
  nav{{display:flex;gap:18px;flex-wrap:wrap}}
  nav a{{color:#fdfd00;text-decoration:none}}
  .wrapper{{max-width:780px;margin:0 auto;padding:60px 24px 120px}}
  .meta{{font-family:"JetBrains Mono",monospace;font-size:11px;text-transform:uppercase;letter-spacing:.05em;display:flex;align-items:center;gap:12px;margin-bottom:32px;flex-wrap:wrap}}
  .tag{{padding:3px 10px;font-weight:700;border:2px solid #0a0a0a;background:{tag_color};color:{tag_text_color}}}
  article h1{{font-size:clamp(40px,8vw,80px);font-weight:800;line-height:.9;letter-spacing:-.04em;text-transform:uppercase;margin:0 0 32px}}
  article h2{{font-size:24px;font-weight:800;text-transform:uppercase;letter-spacing:-.02em;margin:40px 0 12px;padding-bottom:8px;border-bottom:2px solid #0a0a0a}}
  article h3{{font-size:18px;font-weight:700;margin:28px 0 8px;text-transform:uppercase}}
  article p{{font-family:"Instrument Serif",serif;font-size:19px;line-height:1.6;margin:0 0 20px}}
  article ul,article ol{{font-family:"Instrument Serif",serif;font-size:18px;line-height:1.7;padding-left:24px;margin:0 0 20px}}
  article li{{margin-bottom:6px}}
  article strong{{font-family:"Bricolage Grotesque",system-ui,sans-serif;font-weight:700}}
  .back{{display:inline-block;margin-bottom:40px;font-family:"JetBrains Mono",monospace;font-size:12px;text-transform:uppercase;letter-spacing:.05em;text-decoration:none;padding:8px 14px;border:2px solid #0a0a0a;background:#0a0a0a;color:#fdfd00}}
  .back:hover{{background:#fdfd00;color:#0a0a0a}}
  .cta-box{{background:#0a0a0a;color:#fdfd00;padding:32px;margin-top:60px;border:4px solid #0a0a0a}}
  .cta-box h2{{font-size:28px;font-weight:800;text-transform:uppercase;letter-spacing:-.03em;margin:0 0 12px}}
  .cta-box p{{font-family:"JetBrains Mono",monospace;font-size:13px;line-height:1.6;margin:0 0 20px;opacity:.85}}
  .cta-box a{{display:inline-block;padding:12px 24px;background:#fdfd00;color:#0a0a0a;font-family:"JetBrains Mono",monospace;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;text-decoration:none;border:2px solid #fdfd00}}
  footer{{background:#0a0a0a;color:#fdfd00;padding:20px 24px;font-family:"JetBrains Mono",monospace;font-size:10px;text-transform:uppercase;letter-spacing:.05em;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}}
  footer a{{color:#fdfd00;text-decoration:none}}
</style>
<script src="/analytics.js" defer data-ga="G-Y77KZSTP1G" data-umami="563a39c5-2b0b-4005-a0ac-112589d17348" data-umami-src="https://stats.pilsner-vertrieb.de/script.js" data-privacy="/datenschutz.html" data-accent="#0a0a0a"></script>
</head>
<body>
<header>
  <a href="../index.html" style="display:flex;align-items:center;gap:10px">
    <span style="display:inline-flex;width:16px;height:16px;background:#fdfd00"></span>
    <span style="font-weight:700">SOLAR // RADIKAL</span>
  </a>
  <nav>
    <a href="../eigenheim.html">→ Eigenheim</a>
    <a href="../gewerbe.html">→ Gewerbe</a>
    <a href="../speicher.html">→ Speicher</a>
    <a href="../ppa.html">→ PPA</a>
    <a href="index.html">→ Blog</a>
  </nav>
  <a href="../index.html#kontakt" style="padding:8px 14px;background:#fdfd00;color:#0a0a0a;font-weight:700">RUF_AN</a>
</header>

<div class="wrapper">
  <a href="index.html" class="back">← Zurück zum Blog</a>
  <div class="meta">
    <span class="tag">{tag.upper()}</span>
    <span>{date_str}</span>
    <span>Solar Energie Partner · Deggendorf</span>
  </div>
  <article>
    {html_body}
  </article>
  <div class="cta-box">
    <h2>Persönliche Beratung?</h2>
    <p>Kein Formular-Ping-Pong. Ruf direkt an oder schreib uns — Doris oder Thomas melden sich.</p>
    <a href="../index.html#kontakt">Jetzt Kontakt aufnehmen →</a>
  </div>
</div>

<footer>
  <span>© 2026 Solar Energie Partner · Pilsner Vertriebs GmbH · Deggendorf</span>
  <span>
    <a href="../impressum.html">Impressum</a>
    &nbsp;·&nbsp;
    <a href="../datenschutz.html">Datenschutz</a> <a href="#" data-consent-open>Cookie-Einstellungen</a> <a href="https://pilsner-digital.de/">Website: Pilsner Digital</a>
  </span>
</footer>

<!-- WhatsApp -->
<a href="https://wa.me/491753560019?text=Hallo%2C%20ich%20habe%20Ihren%20Blog%20gelesen%20und%20habe%20eine%20Frage." style="position:fixed;bottom:24px;right:24px;z-index:999;width:60px;height:60px;border-radius:50%;background:#25D366;border:3px solid #0a0a0a;box-shadow:4px 4px 0 #0a0a0a;display:flex;align-items:center;justify-content:center;text-decoration:none" title="WhatsApp">
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>
</body>
</html>
"""


def main():
    args = set(sys.argv[1:])
    mock = "--mock" in args
    sync_only = "--sync" in args

    BLOG_DIR.mkdir(exist_ok=True)
    articles = sync_index(load_index())

    if sync_only:
        save_index(articles)
        save_sitemap(articles)
        print(f"Sync fertig. Artikel im Index: {len(articles)}")
        return

    if not mock and not os.environ.get("ANTHROPIC_API_KEY"):
        print("ERROR: ANTHROPIC_API_KEY not set")
        sys.exit(1)

    used_slugs = existing_slugs() | {a["slug"] for a in articles}

    tag = "ratgeber" if IS_RATGEBER else "blog"
    picked = pick_topic(used_slugs)
    if picked is None:
        print(f"Alle {tag}-Themen sind vergeben – kein neuer Artikel. Bitte Themenliste ergänzen.")
        save_index(articles)
        save_sitemap(articles)
        return
    topic, slug = picked

    article_path = BLOG_DIR / f"{slug}.html"
    if article_path.exists():
        # Darf durch existing_slugs() nicht passieren – harte Sicherung gegen Überschreiben.
        print(f"ERROR: {article_path} existiert bereits, wird nicht überschrieben.")
        sys.exit(1)

    print(f"Generating [{tag.upper()}]{' (MOCK)' if mock else ''}: {topic}")
    print(f"Slug: {slug}")

    html_body, excerpt, title = (mock_article if mock else generate_article)(topic, tag)

    # "x" = nur neu anlegen, niemals überschreiben
    with open(article_path, "x", encoding="utf-8") as fh:
        fh.write(build_article_page(slug, html_body, title, tag))
    print(f"Written: {article_path}")

    # Index aktualisieren (neueste zuerst, keine Obergrenze)
    articles.insert(0, {
        "slug": slug,
        "title": title,
        "excerpt": excerpt,
        "tag": tag,
        "date": TODAY.strftime("%d.%m.%Y"),
    })
    save_index(articles)
    save_sitemap(articles)
    print(f"Index + Sitemap aktualisiert. Artikel gesamt: {len(articles)}")


if __name__ == "__main__":
    main()
