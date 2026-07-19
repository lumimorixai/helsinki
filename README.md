# Helsinki Family Guide · PWA V4

Diese Version richtet den Reiseplan an den festen Familienvorgaben aus (Start 10:00 Uhr, Snack 14:00 Uhr, Abendessen 19:00 Uhr, Abfahrt am Dienstag bis 21:00 Uhr) und ergänzt Heureka als Regen-Anker.

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
