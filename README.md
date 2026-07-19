# Helsinki Family Guide · PWA V3

Diese Version behebt die Navigation in der installierten PWA und erweitert den Reiseführer um genaue Spazierwege.

## Neu in V3

- keine doppelte Logik aus „Kurzprofil“ und „Story“ mehr
- robuste App-Navigation zu **Plan**, **Karte**, **Essen** und **HSL**
- neue Sektion **Genaue Routen** mit vier offline lesbaren Schritt-für-Schritt-Wegen
- Designroute mit konkreten Straßen, Abzweigungen und Blickaufträgen
- öffentliche Torikorttelit-Innenhöfe statt unklarer Hinterhofhinweise
- ausführlichere Reiseführer-Seiten mit Kontext, Blickpunkten, Routen und zusätzlichen Visualisierungen
- aktualisierter Service Worker mit neuer Cache-Version

## Veröffentlichung auf GitHub Pages

1. Den vollständigen Inhalt dieses Ordners in das bestehende GitHub-Repository hochladen.
2. Vorhandene Dateien überschreiben, insbesondere:
   - `index.html`
   - `404.html`
   - `service-worker.js`
   - `manifest.webmanifest`
3. Den neuen Ordner `images/guide/` vollständig hochladen.
4. GitHub Pages weiter aus `main` und `/(root)` veröffentlichen.

## Bereits installierte iPhone-PWA aktualisieren

Nach dem GitHub-Upload:

1. Die öffentliche GitHub-Pages-Adresse einmal in Safari öffnen.
2. Rund 10 Sekunden geöffnet lassen und anschließend neu laden.
3. Danach die installierte App schließen und erneut öffnen.

Der neue Service Worker löscht ältere `helsinki-family-guide-*`-Caches automatisch. Zeigt das iPhone trotzdem die alte Version, die Web-App einmal vom Home-Bildschirm entfernen und über Safari erneut hinzufügen.

## Offline-Verhalten

Texte, Reiseführer-Details, Bilder, Routendiagramme und die Schrittfolgen werden offline gespeichert. Externe Live-Navigation, HSL-Echtzeitdaten und Restaurant-Websites benötigen eine Internetverbindung.
