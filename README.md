# Helsinki Family Guide 2026 – PWA

Fertige Progressive Web App für GitHub Pages.

## Veröffentlichung über GitHub Pages

1. Auf GitHub ein neues **öffentliches** Repository anlegen, beispielsweise `helsinki-family-guide`.
2. Den Inhalt dieses Ordners in die oberste Ebene des Repositorys hochladen. `index.html`, `manifest.webmanifest` und `service-worker.js` müssen direkt im Root liegen.
3. Im Repository **Settings → Pages** öffnen.
4. Unter **Build and deployment** auswählen:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
5. Speichern und die von GitHub angezeigte Pages-Adresse öffnen.
6. Auf dem iPhone die Adresse in **Safari** öffnen: **Teilen → Zum Home-Bildschirm**.

## Offline-Verhalten

Nach dem ersten vollständigen Laden werden HTML, Bilder, Icons und Offline-Karten gespeichert. Externe Ziele wie Apple Karten, HSL und Restaurant-Websites benötigen weiterhin Internet.

## Aktualisierungen

Neue Dateien einfach in GitHub ersetzen. Der Guide erkennt eine neue Service-Worker-Version und bietet ein Update an.
