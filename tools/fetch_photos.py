#!/usr/bin/env python3
"""Lädt frei lizenzierte Ortsfotos von Wikimedia Commons nach images/loc/.

Wird normalerweise automatisch vom GitHub-Actions-Workflow ausgeführt
(.github/workflows/fetch-photos.yml). Kann aber auch lokal laufen:

    python3 tools/fetch_photos.py            # lädt nur fehlende Fotos
    python3 tools/fetch_photos.py --force    # lädt alles neu

Ergebnis: images/loc/<key>.jpg (max. 1000 px breit) + images/loc/credits.json
mit Titel, Fotograf:in, Lizenz und Quell-Link für die Bildnachweise im Guide.
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "images" / "loc"
API = "https://commons.wikimedia.org/w/api.php"
UA = "HelsinkiFamilyGuide/1.0 (private family travel PWA; contact via repo)"
WIDTH = 1000

# key -> (Anzeige-Caption, [Suchanfragen in Prioritätsreihenfolge])
LOCATIONS = {
    "kauppatori": ("Kauppatori – Marktplatz am Südhafen", ["Kauppatori Helsinki market square", "Market Square Helsinki harbour summer"]),
    "ferry": ("HSL-Fähre nach Suomenlinna", ["Suomenlinna ferry Helsinki", "HSL ferry Suomenlinna"]),
    "suomenlinna_north": ("Suomenlinna-Kirche", ["Suomenlinna church", "Suomenlinnan kirkko"]),
    "courtyard": ("Great Courtyard auf Suomenlinna", ["Great Courtyard Suomenlinna", "Suomenlinnan linnanpiha"]),
    "blue_route": ("King’s Gate und Festungswälle", ["King's Gate Suomenlinna", "Kuninkaanportti Suomenlinna"]),
    "old_market_hall": ("Vanha Kauppahalli am Südhafen", ["Old Market Hall Helsinki", "Vanha kauppahalli Helsinki"]),
    "southern": ("Huvilakatu – Jugendstilstraße in Eira", ["Huvilakatu Helsinki", "Huvilakatu"]),
    "kaivopuisto": ("Kaivopuisto am Meer", ["Kaivopuisto Helsinki park", "Kaivopuisto sea shore"]),
    "sinebrychoff": ("Sinebrychoff-Park", ["Sinebrychoff park Helsinki", "Sinebrychoffin puisto"]),
    "esplanadi": ("Esplanadi und Espa-Bühne", ["Esplanadi park Helsinki", "Espa stage Helsinki"]),
    "toolo_architecture": ("Musiikkitalo und Töölö-Achse", ["Musiikkitalo Helsinki", "Helsinki Music Centre"]),
    "toolonlahti": ("Töölönlahti-Bucht", ["Töölönlahti Helsinki", "Toolonlahti bay Helsinki"]),
    "baana": ("Baana – die abgesenkte Trasse", ["Baana Helsinki bicycle corridor", "Baana Helsinki"]),
    "heureka": ("Heureka – Wissenschaftszentrum in Vantaa", ["Heureka science centre Vantaa", "Heureka Tikkurila"]),
    "alppipuisto": ("Alppipuisto – Park neben Linnanmäki", ["Alppipuisto Helsinki", "Alppipuisto park"]),
    "white_night": ("Senatsplatz und Dom am Abend", ["Senate Square Helsinki", "Helsinki Cathedral Senate Square"]),
    "island_snack": ("Café Piper im Park", ["Café Piper Suomenlinna", "Piper park Suomenlinna"]),
    "carusel": ("Café Carusel an der Küste", ["Café Carusel Helsinki", "Merisatama Helsinki cafe"]),
    "ham": ("Tennispalatsi mit HAM", ["Tennispalatsi Helsinki", "HAM Helsinki Art Museum"]),
    "la_lasagna": ("Iso Roobertinkatu", ["Iso Roobertinkatu Helsinki", "Iso Roobertinkatu"]),
}

BAD_LICENSE = re.compile(r"noncommercial|nd\b|no derivatives", re.I)


def api(params):
    params = dict(params, format="json")
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def strip_html(text):
    return re.sub(r"<[^>]+>", "", text or "").strip()


def pick(query):
    data = api({
        "action": "query",
        "generator": "search",
        "gsrsearch": query + " filetype:bitmap",
        "gsrnamespace": 6,
        "gsrlimit": 12,
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": WIDTH,
    })
    pages = (data.get("query") or {}).get("pages") or {}
    ranked = sorted(pages.values(), key=lambda p: p.get("index", 99))
    for page in ranked:
        info = (page.get("imageinfo") or [{}])[0]
        if info.get("mime") != "image/jpeg":
            continue
        w, h = info.get("width", 0), info.get("height", 0)
        if w < 900 or h < 550:
            continue
        if not (0.6 <= w / max(h, 1) <= 2.4):
            continue
        meta = info.get("extmetadata") or {}
        license_name = strip_html((meta.get("LicenseShortName") or {}).get("value", ""))
        if not license_name or BAD_LICENSE.search(license_name):
            continue
        artist = strip_html((meta.get("Artist") or {}).get("value", "")) or "unbekannt"
        return {
            "title": page.get("title", ""),
            "thumb": info.get("thumburl") or info.get("url"),
            "url": info.get("descriptionurl", ""),
            "artist": artist[:120],
            "license": license_name[:60],
        }
    return None


def main():
    force = "--force" in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    credits_path = OUT / "credits.json"
    credits = {}
    if credits_path.exists():
        try:
            credits = {c["key"]: c for c in json.loads(credits_path.read_text())}
        except Exception:
            credits = {}

    changed = False
    for key, (caption, queries) in LOCATIONS.items():
        target = OUT / f"{key}.jpg"
        if target.exists() and not force and key in credits:
            print(f"skip  {key} (vorhanden)")
            continue
        choice = None
        for q in queries:
            try:
                choice = pick(q)
            except Exception as exc:
                print(f"warn  {key}: {q!r} -> {exc}")
            if choice:
                break
            time.sleep(0.5)
        if not choice:
            print(f"MISS  {key}: kein passendes Foto gefunden")
            continue
        req = urllib.request.Request(choice["thumb"], headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as r:
            target.write_bytes(r.read())
        credits[key] = {"key": key, "caption": caption, "file": target.name, **choice}
        changed = True
        print(f"ok    {key} <- {choice['title']} [{choice['license']}]")
        time.sleep(0.5)

    if changed or not credits_path.exists():
        ordered = [credits[k] for k in LOCATIONS if k in credits]
        credits_path.write_text(json.dumps(ordered, ensure_ascii=False, indent=1))
        print(f"credits.json mit {len(ordered)} Einträgen geschrieben")


if __name__ == "__main__":
    main()
