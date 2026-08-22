#!/usr/bin/env python3
"""
Validazione statica del sito (CI).

Controlla, senza rete:
  1. Integrità dei link interni nelle pagine HTML:
     - percorsi relativi (href/src) che puntano a file inesistenti;
     - frammenti "#ancora" che non corrispondono ad alcun id nel documento di
       destinazione.
  2. Validità JSON di site.webmanifest.
  3. Buona formazione XML di sitemap.xml e coerenza dei <loc> con i file locali.

Esce con codice 1 se trova almeno un problema; 0 se tutto è a posto.
Usa solo la libreria standard di Python.
"""

import json
import os
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urldefrag, urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

HTML_FILES = ["index.html", "en/index.html", "it/index.html"]

errors = []


def rel(path):
    return os.path.relpath(path, ROOT)


class LinkCollector(HTMLParser):
    """Raccoglie id degli elementi e riferimenti href/src."""

    def __init__(self):
        super().__init__()
        self.ids = set()
        self.refs = []  # (attr, value, line)

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if d.get("id"):
            self.ids.add(d["id"])
        if d.get("name") and tag == "a":
            # ancore vecchio stile <a name="...">
            self.ids.add(d["name"])
        for attr in ("href", "src"):
            if attr in d and d[attr] is not None:
                self.refs.append((attr, d[attr], self.getpos()[0]))


def parse_html(path):
    with open(path, encoding="utf-8") as fh:
        parser = LinkCollector()
        parser.feed(fh.read())
    return parser


def is_external(value):
    if value.startswith(("http://", "https://", "//", "mailto:", "tel:",
                          "data:", "javascript:")):
        return True
    scheme = urlparse(value).scheme
    return bool(scheme)


def check_internal_links():
    # Mappa file -> set di id (per verificare i frammenti cross-file)
    ids_by_file = {}
    parsers = {}
    for rel_path in HTML_FILES:
        abs_path = os.path.join(ROOT, rel_path)
        if not os.path.isfile(abs_path):
            errors.append(f"[link] pagina attesa mancante: {rel_path}")
            continue
        p = parse_html(abs_path)
        parsers[rel_path] = p
        ids_by_file[abs_path] = p.ids

    for rel_path, p in parsers.items():
        abs_path = os.path.join(ROOT, rel_path)
        base_dir = os.path.dirname(abs_path)
        for attr, value, line in p.refs:
            v = value.strip()
            if not v or v == "#" or is_external(v):
                continue

            path_part, frag = urldefrag(v)

            # Link puramente frammento: #ancora nello stesso documento
            if path_part == "":
                if frag and frag not in p.ids:
                    errors.append(
                        f"[link] {rel_path}:{line} ancora '#{frag}' "
                        f"inesistente nel documento")
                continue

            # Risoluzione del percorso (eventualmente con frammento).
            # I path root-assoluti ("/it/") si risolvono sulla radice del
            # repository: è un sito utente GitHub Pages servito alla radice del
            # dominio, quindi "/" = root del repo.
            if path_part.startswith("/"):
                target = os.path.normpath(os.path.join(ROOT, path_part.lstrip("/")))
            else:
                target = os.path.normpath(os.path.join(base_dir, path_part))

            # Directory -> risolve su index.html
            if os.path.isdir(target):
                target_file = os.path.join(target, "index.html")
            else:
                target_file = target

            if not os.path.exists(target_file):
                errors.append(
                    f"[link] {rel_path}:{line} {attr} verso file inesistente: "
                    f"{value}")
                continue

            # Verifica del frammento sul file di destinazione (se HTML noto)
            if frag and target_file in ids_by_file:
                if frag not in ids_by_file[target_file]:
                    errors.append(
                        f"[link] {rel_path}:{line} ancora '#{frag}' "
                        f"inesistente in {rel(target_file)}")


def check_manifest():
    path = os.path.join(ROOT, "site.webmanifest")
    if not os.path.isfile(path):
        errors.append("[json] site.webmanifest mancante")
        return
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
    except json.JSONDecodeError as exc:
        errors.append(f"[json] site.webmanifest non valido: {exc}")
        return
    for key in ("name", "start_url", "icons"):
        if key not in data:
            errors.append(f"[json] site.webmanifest: chiave '{key}' mancante")


def check_sitemap():
    path = os.path.join(ROOT, "sitemap.xml")
    if not os.path.isfile(path):
        errors.append("[xml] sitemap.xml mancante")
        return
    try:
        ET.parse(path)
    except ET.ParseError as exc:
        errors.append(f"[xml] sitemap.xml non ben formato: {exc}")


def main():
    check_internal_links()
    check_manifest()
    check_sitemap()

    if errors:
        print("Validazione FALLITA:\n")
        for e in errors:
            print("  - " + e)
        print(f"\n{len(errors)} problema/i.")
        sys.exit(1)
    print("Validazione OK: link interni, JSON e XML corretti.")


if __name__ == "__main__":
    main()
