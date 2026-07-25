# Helsinki Family Guide · PWA V7

Diese Version macht den Guide entscheidungsfähig: Unter jedem Stopp sitzt jetzt eine Leiste „2 Alternativen in Gehweite“, und an jedem Snack- und Abendessen-Anker liegt eine Umkreis-Karte mit Gehminuten. Ihr könnt also spontan abbiegen, ohne den Plan zu verlieren – jede Alternative sagt euch, wann und wo ihr wieder auf die Route trefft.

## Neu in V7

- **Wahlfächer an jedem Stopp:** 60 von 62 Stopps (alle außer den beiden Abfahrts-Stopps am Dienstag) haben eine aufklappbare Leiste mit dem geplanten Ort plus zwei geprüften Alternativen – je mit Gehzeit, Öffnungs-Chips und einer Begründung, warum man stattdessen dorthin geht. 180 Karten insgesamt.
- **Rückkehr-Zeile statt Verlaufen:** Unter jedem Wahlfach steht eine blaue Zeile, die sagt, wann und wo alle Varianten wieder zusammenlaufen und wie ihr von dort zum Hotel kommt.
- **Umkreis-Karten an den Ankern:** An allen 14:00- und 19:00-Stopps öffnet sich eine Skizze mit drei Ringen (5, 10, 15 Gehminuten), nummerierten Punkten und einer Liste darunter. Ihr steht in der Mitte, der letzte Eintrag ist immer der Heimweg. Neun Karten, an 16 Stellen eingebunden.
- **Kein Theater, keine Bühne:** Der Dienstag-Slot um 16:30 Uhr ist von „Jazz-Espa“ auf **Esplanadi & freie Zeit** umgestellt – Eis, Wiese, Läden, kein Programm, kein Sitzenbleiben. Reiseführer-Seiten, Kartenmarker und Kartenkarten sind entsprechend angepasst.
- **Regen-Abendessen am Sonntag benannt:** Aus dem namenlosen „Abendessen im Zentrum“ wird **Zetor, Mannerheimintie 3–5** (sonntags 12–24 Uhr, Traktorenhalle), mit Friends & Brgrs und Via Tribunali als geprüften Alternativen.
- **Alternativen auch im Essens-Kapitel:** Alle sechs Restaurantkarten bekommen zwei Ausweichlokale mit Gehzeit direkt auf der Karte.
- **Alle Zeiten geprüft:** Öffnungszeiten und Preise von 18 Orten und Restaurants für Sonntag 26., Montag 27. und Dienstag 28. Juli neu verifiziert (u. a. Hietalahti-Halle So 10–18, Oodi Sa/So 10–20, HAM montags zu, Naturkundemuseum täglich 10–17, Feuerwehrmuseum nur Di & Sa 12–17, La Lasagna sonntags geschlossen / Di bis 21 Uhr).
- **Technik:** Cache-Version v7, Registrierung und `start_url` auf `v=7`. Die Wahlfächer werden zur Laufzeit aus einem eingebetteten Datensatz gebaut und funktionieren vollständig offline.

## Neu in V6

Farbschema „Kupferpatina & Granit“: Die Farben erzählen jetzt Helsinki – Patina-Grün wie die Kupferdächer des Doms für die Stadt, Ostsee-Blau für Fähre, Suomenlinna und Regenmodus, warmes Kupfer für Abendbausteine und Linnanmäki, dazu granit-helles Papier statt Beige.

## Neu in V6

- **Leitfarben umgedeutet:** Das Grün bleibt, steht aber jetzt bewusst für die Kupferpatina der Dom-Kuppeln; Papierton von warmem Beige auf helles Granit-Grau umgestellt.
- **Kupfer statt Violett:** Abend-Stopps, Linnanmäki-Modul, Dienstag-Route (auch in den Offline-SVG-Karten samt Markern und Routenlinien) und Event-Elemente nutzen warme Kupfertöne (#a05c32 / #c26f3f) statt Violett/Sand.
- **Dunkle Panels in Blaugrün:** HSL-Panel und Restaurant-Check wechseln von Braun auf tiefes Patina-Blaugrün.
- **Konsistenz überall:** offline.html, `background_color` im Manifest und alle rgba-Ableitungen angepasst; `theme_color` bleibt Patina-Grün.
- **Technik:** Cache-Version v6, Registrierung und `start_url` auf `v=6`.

## Neu in V5

- **Bildkarten pro Stopp:** Alle Tagespläne (Trocken- und Regenvarianten) zeigen pro Stopp ein Foto, den Grund für den Besuch und bis zu drei Fakten-Chips (Dauer, Wetter, Kosten). Die ganze Karte ist klickbar und öffnet den ausführlichen Reiseführer.
- **Echte Ortsfotos statt Illustrationen** für rund 20 Orte (Kauppatori, Suomenlinna-Kirche, Great Courtyard, King’s Gate, Alte Markthalle, Huvilakatu, Kaivopuisto, Sinebrychoff-Park, Esplanadi, Musiikkitalo, Töölönlahti, Baana, Heureka, Alppipuisto, Senatsplatz, Café Piper, Café Carusel, HAM, Iso Roobertinkatu, Fähre).
- **Automatische Foto-Pipeline:** Der Workflow `.github/workflows/fetch-photos.yml` lädt beim nächsten Push auf `main` fehlende Fotos von Wikimedia Commons nach `images/loc/` (nur JPEG, freie Lizenzen, min. 900 px) und committet sie samt `credits.json`. Kein manueller Schritt nötig – GitHub Pages liefert die Fotos danach automatisch aus. Alternativ lokal: `python3 tools/fetch_photos.py`.
- **Korrekte Bildnachweise, automatisch:** Der Guide liest `images/loc/credits.json` und ergänzt Urheber und Lizenz jedes Fotos in der Bildnachweis-Liste.
- **Sauberer Fallback:** Fehlt ein Ortsfoto (noch), zeigt der Guide automatisch die bisherige Illustration – nichts wirkt kaputt.
- **Überarbeiteter Einstieg:** Die visuelle Highlight-Leiste oben zeigt jetzt acht Orte inkl. Heureka und King’s Gate (vorher fehlte ein Eintrag durch einen Datenfehler).
- **Technik:** Cache-Version v5, Registrierung und `start_url` auf `v=5`; Ortsfotos werden beim ersten Anzeigen automatisch in den Offline-Cache übernommen.

## Neu in V4

- **Zeiten an die Vorgaben angepasst:** Tag 2 und Tag 3 starten um 10:00 Uhr, der kleine Snack liegt an allen Tagen um 14:00 Uhr (Tagespläne, Essenskarten, Kartenbeschriftungen und Reiseführer-Texte konsistent aktualisiert).
- **Abreise abgesichert:** Dienstag endet mit Abendessen um 19:00 Uhr nahe dem Hotel, Gepäckabholung ab 20:15 Uhr und Abfahrt bis 21:00 Uhr – der frühere Oodi-Abendblock (bis 21:00 Uhr + Rückweg) entfällt.
- **La Lasagna statt La Famiglia** als Abschlussessen am Dienstag (beide Wettervarianten), inklusive Karten-Marker, Routenziel und Restaurant-Check. Ravintola Elite bleibt als geprüfte Alternative genannt.
- **Heureka als Regen-Anker für Montag** mit Zugverbindung nach Tikkurila, Snack im Haus um 14:00 Uhr, eigener Reiseführer-Seite und ABC-Zonen-Hinweis im HSL-Teil. Das Naturkundemuseum bleibt als Stadt-Alternative genannt und rückt im Dienstag-Regenplan nach vorn.
- **Allas Sea Pool / Hotelpool** als ausgewiesene Abend-Alternative an Tag 2 (nicht umgeplant, nur als Option gezeigt).
- **Tag-2-Timing korrigiert:** Fähre zurück gegen 17:00 Uhr, Hinweis auf die Schließzeit der Alten Markthalle (18:00 Uhr) samt Ausweichempfehlung.
- **Früher zum Festival:** Am Sonntag geht es direkt nach dem Abendessen (19:50 Uhr) zum Alppipuisto (Ankunft ca. 20:30 Uhr); zusätzlich ist eine Vorzieh-Option (Abendessen 18:30 Uhr → Festival ab ca. 19:45 Uhr) vermerkt. Das Festival ist als Energie-Option gekennzeichnet.
- **Öffnungszeiten-Korrekturen:** Amos Rex schließt montags um 18:00 Uhr (Hinweis ergänzt) und ist dienstags geschlossen (aus dem Dienstag-Regenplan entfernt).
- **Technik:** `skipWaiting()` aus dem Install-Handler entfernt – Updates laufen jetzt bewusst über das „Aktualisieren“-Banner. Neue Cache-Version `helsinki-family-guide-v4-…`, Service-Worker-Registrierung und `start_url` auf `v=4`.

## Veröffentlichung auf GitHub Pages

1. Den vollständigen Inhalt dieses Ordners in das bestehende GitHub-Repository hochladen.
2. Vorhandene Dateien überschreiben, insbesondere:
   - `index.html`
   - `404.html`
   - `service-worker.js`
   - `manifest.webmanifest`
   - `README.md`
3. GitHub Pages weiter aus `main` und `/(root)` veröffentlichen.

## Bereits installierte iPhone-PWA aktualisieren

Nach dem GitHub-Upload:

1. Die öffentliche GitHub-Pages-Adresse einmal in Safari öffnen.
2. Rund 10 Sekunden geöffnet lassen und anschließend neu laden.
3. Erscheint das Banner „Neue Version verfügbar“, auf **Aktualisieren** tippen.
4. Danach die installierte App schließen und erneut öffnen.

Der neue Service Worker löscht ältere `helsinki-family-guide-*`-Caches automatisch. Zeigt das iPhone trotzdem die alte Version, die Web-App einmal vom Home-Bildschirm entfernen und über Safari erneut hinzufügen.

## Offline-Verhalten

Texte, Reiseführer-Details, Bilder, Routendiagramme und die Schrittfolgen werden offline gespeichert. Externe Live-Navigation, HSL-Echtzeitdaten und Restaurant-Websites benötigen eine Internetverbindung.
