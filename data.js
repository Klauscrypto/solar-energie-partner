// Inhalte der Solar Energie Partner Website (Pilsner Vertriebs GmbH)
window.SITE_DATA = {
  brand: {
    name: "Solar Energie Partner",
    parent: "Pilsner Vertriebs GmbH",
    location: "Deggendorf",
    address: "Detterstraße 38, 94469 Deggendorf",
    phone: "+49 991 40227560",
    email: "info@solar-energie-partner.de",
    founded: 2014,
    rating: 4.9,
    reviews: 127,
  },

  nav: [
    { id: "leistungen", label: "Leistungen" },
    { id: "ppa", label: "PPA-Stromvertrag" },
    { id: "prozess", label: "Vorgehen" },
    { id: "referenzen", label: "Projekte" },
    { id: "ueberuns", label: "Über uns" },
    { id: "kontakt", label: "Kontakt" },
  ],

  hero: {
    eyebrow: "Photovoltaik · Speicher · PPA",
    title: ["Energie,", "die sich rechnet.", "Vom ersten Tag an."],
    titleAccent: 1,
    sub: "Wir entwickeln Photovoltaik-Lösungen, die zu Ihrem Verbrauch passen – nicht zu unserem Verkaufsziel. Klare Zahlen, ehrliche Beratung, saubere Umsetzung.",
    primaryCta: "Beratungstermin buchen",
    secondaryCta: "Vorteil berechnen",
  },

  trustBar: [
    { k: "Geprüfte Partner", v: "zertifizierte Installateure" },
    { k: "30 Jahre", v: "Modulgarantie" },
    { k: "Bundesweit aktiv", v: "Hauptstandort Bayern" },
    { k: "250+ Anlagen", v: "seit Firmengründung" },
    { k: "Bis −50% Strompreis", v: "im PPA-Modell" },
    { k: "Bis 80% Einsparung", v: "mit eigener Anlage" },
  ],

  bigStats: [
    { n: "250+", l: "Realisierte Anlagen", s: "Privat & Gewerbe, bundesweit" },
    { n: "12", u: "Jahre", l: "Erfahrung im Markt", s: "Planung, Bau & Betrieb" },
    { n: "−50", u: "%", l: "Weniger Stromkosten", s: "im PPA-Modell möglich" },
    { n: "30", u: "Jahre", l: "Modulgarantie", s: "Langlebig & geprüft" },
  ],

  audiences: {
    privat: {
      tag: "Für Zuhause",
      title: ["Ihr Dach.", "Ihre Energie.", "Ihre Entscheidung."],
      lead: "Eine Solaranlage ist eine Investition für Jahrzehnte – deshalb beraten wir gründlich, statt schnell zu verkaufen. Wir analysieren Ihren Stromverbrauch, prüfen die Dachsubstanz und zeigen Ihnen ehrlich, was sich rechnet und was nicht.",
      bullets: [
        ["Solarmodule für jedes Dach", "Schräg, flach, denkmalgeschützt oder ungewöhnlich geschnitten – wir finden die Lösung."],
        ["Speicher mit echter Reserve", "Wir wählen die Speichergröße passend zu Ihrem Profil – nicht zur Provisionstabelle."],
        ["Smarte Lade-Steuerung", "Wallbox plus Energiemanagement: Auto laden, wenn die Sonne scheint – automatisch."],
        ["Wärme aus Sonnenstrom", "Wärmepumpe richtig integriert – mit dem Eigenstrom heizen, statt teuer einzukaufen."],
      ],
      cta: "Beratung anfordern",
    },
    gewerbe: {
      tag: "Für Unternehmen",
      title: ["Strom aus dem", "eigenen Werk.", "Ohne Eigenkapital."],
      lead: "Stromkosten sind für viele Unternehmen ein dreistelliger Posten in der GuV. Mit einem PPA-Stromvertrag senken Sie diesen Posten dauerhaft – ohne Bilanzbelastung, ohne Wartungsverantwortung, ohne Kapitalbindung.",
      bullets: [
        ["Stromvertrag statt Investition", "Wir bauen, finanzieren, betreiben – Sie bezahlen nur den Strom, den Sie tatsächlich nutzen."],
        ["Bilanz- und ESG-konform", "Operating-Lease-Struktur, sauber buchbar, mit positivem Effekt auf Ihr Nachhaltigkeitsreporting."],
        ["Vom Konzept bis zur Übergabe", "Statik, Brandschutz, Anschlussgesuch, Inbetriebnahme – wir koordinieren jeden Schritt."],
        ["Optimal für Logistik, Industrie, Landwirtschaft", "Spezialisiert auf Hallendächer mit hohem Eigenverbrauch – dort rechnet sich PPA am stärksten."],
      ],
      cta: "Wie das Modell funktioniert",
    },
  },

  services: [
    { no: "01", cat: "Solarmodule", title: "PV-Anlagen-Bau", body: "Auslegung nach Verbrauch, nicht nach Dachfläche. Wir nehmen lieber 2 kWp weniger und dafür die richtige Dimensionierung – das macht über 25 Jahre den Unterschied." },
    { no: "02", cat: "Speichertechnik", title: "Batteriespeicher", body: "Lithium-Eisenphosphat als Standard – langlebig, sicher, brandschutztechnisch unbedenklich. Wir verbauen, was wir auch zuhause hätten." },
    { no: "03", cat: "Stromvertrag", title: "PPA-Lösungen", body: "Sie zahlen nur für gelieferten Strom. Punkt. Kein Kapitaleinsatz, kein Reparaturärger, keine Verwaltungslast – wir kümmern uns um alles dahinter." },
    { no: "04", cat: "E-Mobilität", title: "Wallbox-Installation", body: "Mit Lastmanagement und Solar-Überschuss-Ladung. So lädt das Auto bevorzugt mit Eigenstrom – und Sie sparen sich teure Netzkilowattstunden." },
    { no: "05", cat: "Heiztechnik", title: "Wärmepumpen", body: "Eine Wärmepumpe ist nur so gut wie ihre Auslegung. Wir berechnen, prüfen Heizlast und hydraulischen Abgleich – und liefern, was wirklich passt." },
    { no: "06", cat: "Betreuung", title: "Service & Wartung", body: "Wir behalten Ihre Anlage im Blick – aus der Ferne. Bei Auffälligkeiten melden wir uns bei Ihnen, nicht umgekehrt. So bleibt der Ertrag, wo er hingehört." },
  ],

  process: [
    { no: "01", title: "Erstgespräch", body: "Wir hören zu, fragen genau und schauen uns Ihr Verbrauchsprofil an. Ergebnis: ehrliches Ja oder ehrliches Nein." },
    { no: "02", title: "Detailplanung", body: "Konkretes Konzept mit nachvollziehbaren Zahlen, geprüfter Förderkulisse und transparentem Festpreisangebot." },
    { no: "03", title: "Umsetzung", body: "Eigene Monteure, eigene Elektriker, getakteter Bauablauf. In der Regel zwischen 1 und 5 Tagen abgeschlossen." },
    { no: "04", title: "Begleitung", body: "Anmeldung beim Marktstammdatenregister, Netzanschluss, Fernüberwachung – und ein direkter Draht zu uns." },
  ],

  bureaucracy: [
    ["Marktstammdatenregister", "Vollständige Anmeldung Ihrer Anlage bei der Bundesnetzagentur, fristgerecht"],
    ["EEG-Einspeise­berechnung", "Korrekte Tarifermittlung nach aktuellem Erneuerbare-Energien-Gesetz"],
    ["KfW-442-Förderantrag", "Speicher-Förderung beantragen, prüfen, durchschleusen – inklusive Verwendungsnachweis"],
    ["VDE-AR-N-4105-Doku", "Komplette Netzanschlussdokumentation nach geltender Norm"],
    ["Netzbetreiber-Anmeldung", "Anschlussgesuch, Inbetriebnahmeprotokoll, Zähleranmeldung"],
    ["BAFA-Anträge", "Bei Wärmepumpen und Heizungstausch übernehmen wir auch hier den Förderprozess"],
    ["§14a-EnWG-Meldung", "Anmeldung steuerbarer Verbrauchseinrichtungen wie Wärmepumpen oder Wallbox"],
    ["Förder-Navigator", "Wir prüfen alle bundes-, landes- und kommunalen Programme für Ihr Projekt"],
  ],

  ppa: {
    title: ["Solarstrom als", "Dienstleistung,", "nicht als Investition."],
    body: "Sie haben ein Dach – wir haben das Kapital. Wir errichten die komplette Anlage auf eigene Kosten und liefern Ihnen den produzierten Strom zu einem festen, klar reduzierten Preis. Wartung, Versicherung, Reparaturen: unser Bereich. Strom verbrauchen und sparen: Ihrer.",
    stats: [
      { v: "17", u: "ct", l: "PPA-Tarif je kWh" },
      { v: "−50", u: "%", l: "Weniger Stromkosten" },
      { v: "0", u: "€", l: "Anfangskosten" },
      { v: "20", u: "J.", l: "Vertragslaufzeit" },
    ],
  },

  future: [
    { tag: "VPP-ready", title: "Virtuelles Kraftwerk", body: "Ihre Anlage wird Teil eines intelligenten Stromnetzes. Überschuss wird automatisch dann verkauft, wenn die Preise an der Strombörse hoch sind – das bringt zusätzliche Einnahmen, ohne dass Sie etwas tun müssen." },
    { tag: "Smart-Meter-fit", title: "Dynamische Stromtarife", body: "Mit der Smart-Meter-Pflicht ab 2026 werden flexible Tarife zum Standard. Wir richten Ihre Anlage so ein, dass Großverbraucher wie Wärmepumpe und E-Auto automatisch zu den günstigsten Zeiten laufen." },
    { tag: "Vor Ort installiert", title: "Energiemanagement-Systeme", body: "Eigenes Energiemanagement vernetzt PV-Anlage, Speicher, Wärmepumpe, Wallbox und Hausgeräte zu einem intelligenten System. Ergebnis: maximaler Eigenverbrauch, minimale Stromrechnung." },
  ],

  projects: [
    { tag: "Privatkunde", spec: "18 kWp · Deggendorf", title: "Familienhaus mit Speicher", body: "Modulausrichtung Süden und Norden, dazu 18 kWh Speicherkapazität. Autarkie laut Monitoring: 82%.", img: "eigenheim-deggendorf.jpg", imgFilter: "contrast(1.12) saturate(1.25) brightness(1.05)" },
    { tag: "Gewerbe", spec: "PPA · 380 kWp · Straubing", title: "Speditionsstandort", body: "Komplettübernahme der Hallenüberdachung. Stromkosten dauerhaft auf Vertragsniveau gebracht – Investition aufseiten unseres Hauses.", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?fm=jpg&q=80&w=800&auto=format&fit=crop" },
    { tag: "Landwirtschaft", spec: "160 kWp · Plattling", title: "Milchviehbetrieb", body: "Stalldach plus Maschinenhalle. Eigenverbrauchsoptimierung über Melkstandsteuerung – Strom wird genau dann genutzt, wenn er produziert wird.", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?fm=jpg&q=80&w=800&auto=format&fit=crop" },
    { tag: "Privatkunde", spec: "8,4 kWp · Passau", title: "Stadthaus mit Ladelösung", body: "Knappe Dachfläche perfekt ausgenutzt. Wallbox lädt das E-Auto bevorzugt mit Sonnenstrom über automatische Steuerung.", img: "https://images.unsplash.com/flagged/photo-1566838616631-f2618f74a6a2?fm=jpg&q=80&w=800&auto=format&fit=crop" },
    { tag: "Industrie", spec: "PPA · 750 kWp · Regensburg", title: "Metallbau-Unternehmen", body: "Hochenergie-Verbraucher mit Schichtbetrieb. PPA-Modell finanziert komplett aus eingesparten Stromkosten – CO₂-Bilanz deutlich verbessert.", img: "https://plus.unsplash.com/premium_photo-1666345066540-545e2d61ca3c?fm=jpg&q=80&w=800&auto=format&fit=crop" },
    { tag: "Privatkunde", spec: "Komplettpaket · Landshut", title: "Neubau mit Wärmepumpe", body: "14 kWp Anlage, 18 kWh Speicher, Sole-Wasser-Wärmepumpe und Wallbox. Heizung und Warmwasser laufen weitgehend mit eigenem Strom.", img: "https://plus.unsplash.com/premium_photo-1716190016025-d5bfe468f38a?fm=jpg&q=80&w=800&auto=format&fit=crop" },
  ],

  testimonials: [
    { quote: "Was mich überzeugt hat: Sie haben mir abgeraten, ein zweites Speichermodul zu kaufen, das ich gar nicht ausnutze. Der Verkaufsdruck, den ich bei drei anderen Anbietern hatte, war hier schlicht nicht da.", name: "Thomas R.", role: "Eigenheimbesitzer · 9 kWp", initials: "TR" },
    { quote: "Wir wollten ursprünglich kaufen. Nach Durchrechnung beider Optionen wurde klar: PPA ist für uns als wachsendes Unternehmen die bessere Wahl. Liquidität bleibt im Geschäft, Strompreis ist trotzdem gedeckelt.", name: "Christian K.", role: "Geschäftsführer · 420 kWp PPA", initials: "CK" },
    { quote: "Ein Wechselrichter ist im zweiten Jahr ausgefallen – Sonntagabend. Montag früh war jemand im Haus, Mittag lief die Anlage wieder. Solche Reaktionszeiten habe ich von keinem anderen Handwerker erlebt.", name: "Sandra E.", role: "Privatkundin · 11 kWp + Speicher", initials: "SE" },
  ],

  about: {
    title: ["Handwerk", "mit Haltung.", "Aus Deggendorf."],
    body: "Solar Energie Partner ist eine Marke der Pilsner Vertriebs GmbH – eines inhabergeführten Betriebs aus Deggendorf. Seit 2014 vermitteln und koordinieren wir Photovoltaik-Projekte in Bayern und bundesweit. Wir arbeiten ausschließlich mit geprüften, zertifizierten Installateuren zusammen — und stehen persönlich für jedes Ergebnis gerade.",
    points: [
      ["Inhabergeführt", "Doris Pilsner-Albrecht steht persönlich hinter jedem Projekt"],
      ["Geprüfte Installateure", "wir arbeiten nur mit zertifizierten Partnerbetrieben — jeder einzeln ausgewählt"],
      ["Standort Deggendorf", "Hauptbüro Detterstraße 38, Einsatzgebiet ganz Bayern und darüber hinaus"],
      ["24/7 Notfall-Hotline", "direkter Draht zu unserem Serviceteam, nicht zur Warteschleife"],
      ["Eingetragener Fachbetrieb", "zertifiziert, versichert, nach VDE geprüft"],
    ],
  },

  faq: [
    ["Wie funktioniert ein PPA-Stromvertrag konkret?", "Wir tragen die Investition für die Solaranlage komplett – Sie müssen nichts vorfinanzieren. Auf Ihrem Dach entsteht eine Anlage in unserem Eigentum, der Strom fließt direkt in Ihren Verbrauch. Bezahlt wird ausschließlich, was Sie tatsächlich nutzen, zu einem fest vereinbarten Tarif. Nach Vertragsende übernehmen Sie die Anlage entweder zum Restwert oder verlängern den Vertrag."],
    ["Wie schnell ist meine Anlage einsatzbereit?", "Bei Eigenheimprojekten sind wir nach Materiallieferung üblicherweise in 1 bis 3 Tagen fertig. Bei größeren Gewerbeanlagen kalkulieren wir je nach Genehmigungslage und Netzanschluss-Situation 2 bis 8 Wochen. Wichtig: Den Hauptanteil der Wartezeit verursacht meist der Netzbetreiber, nicht wir."],
    ["Welche staatlichen Zuschüsse gibt es 2026?", "Die Förderlandschaft ist umfangreich, aber unübersichtlich. Aktuell relevant: KfW-270 (Kredit zu vergünstigten Konditionen), KfW-442 (Speicherförderung), Landesmittel je Bundesland und einzelne kommunale Programme. Wir prüfen für jedes Vorhaben individuell, was anwendbar ist – kostenfrei und ohne Verpflichtung."],
    ["Lohnt sich Photovoltaik 2026 finanziell überhaupt noch?", "Kürzere Antwort: Ja, deutlich. Längere Antwort: Die Einspeisevergütung ist gefallen, die Modulpreise aber stärker. Entscheidend ist heute der Eigenverbrauch – jede selbst genutzte Kilowattstunde spart 30 ct und mehr ein. Typische Eigenheim-Anlagen amortisieren sich in 9 bis 13 Jahren, Gewerbeanlagen oft in 5 bis 9 Jahren."],
    ["Was geschieht bei einem Defekt?", "Bei einem PPA-Vertrag sind Reparaturen vollständig unsere Sache – Sie zahlen nur für tatsächlich gelieferten Strom. Bei Kaufanlagen liegt die Modulgarantie bei 25 bis 30 Jahren, Wechselrichter typischerweise 10 bis 12 Jahre. Unser Monitoring erkennt Probleme oft, bevor Sie sie bemerken."],
    ["Welche Komponenten kommen zum Einsatz?", "Wir setzen ausschließlich auf etablierte Tier-1-Hersteller. Module: u.a. Meyer Burger, Q CELLS, Trina, JinkoSolar. Wechselrichter: SMA, Fronius, Kostal, SolarEdge. Speicher: BYD, sonnen, Fronius, Tesla. Welche Komponente in Ihrem Fall die richtige ist, hängt vom Lastprofil ab – das klären wir transparent in der Beratung."],
  ],

  formInterests: [
    "Solaranlage für Eigenheim",
    "Anlage mit Speicher",
    "PPA-Stromvertrag (Gewerbe)",
    "Wärmepumpe",
    "Wallbox / Ladestation",
    "Komplettlösung mit allem",
    "Etwas anderes",
  ],
};
