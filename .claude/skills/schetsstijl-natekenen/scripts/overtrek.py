#!/usr/bin/env python3
"""Maak van een strakke lijntekening een schets in Jesse's stijl.

Jij (Claude) tekent het voorwerp eerst als schone SVG: elke rand één los pad,
met M, L, Q en C (absolute coördinaten), zonder Z en zonder vulling. Dat is
makkelijk precies te krijgen. Dit script trekt daarna elk pad drie of vier keer
over, elke keer anders, met doorlopende hoeken, zoals Jesse's hand. Zo komt de
juistheid van jou en het handwerk van het script.

    python3 overtrek.py schoon.svg uit.png [--svg uit-schets.svg] [--halen 4]
                        [--los 1.0] [--breedte 1000] [--zaad 7]

    --los      hoeveel de halen uit elkaar lopen (1.8 standaard, 2.5 losser)

Een pad met class="arceer" wordt niet overgetrokken maar gevuld met losse,
schuine streepjes (voor bakeliet, koffie, donkere openingen). Zo'n pad moet een
gesloten vorm beschrijven (begin en eind op dezelfde plek).
"""
import argparse
import math
import os
import random
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np  # noqa: E402
from PIL import Image, ImageDraw  # noqa: E402
import schets  # noqa: E402

SS = 3


def lees_paden(svg):
    tekst = open(svg, encoding="utf-8").read()
    vb = re.search(r'viewBox="([\d.\s-]+)"', tekst)
    x0, y0, w, h = (float(v) for v in vb.group(1).split()) if vb else (0, 0, 1000, 1000)
    paden = []
    for m in re.finditer(r"<path\b([^>]*)>", tekst):
        attr = m.group(1)
        d = re.search(r'\bd="([^"]+)"', attr)
        if not d:
            continue
        soort = "arceer" if re.search(r'class="[^"]*arceer', attr) else "lijn"
        paden.append((soort, d.group(1)))
    return (x0, y0, w, h), paden


def bemonster(d, stap=2.0):
    """Zet M/L/Q/C-commando's om in losse polylijnen (elke M begint een nieuwe)."""
    tok = re.findall(r"[MLQCmlqc]|-?\d*\.?\d+(?:e-?\d+)?", d)
    stukken, cur, pt, i, cmd = [], [], None, 0, None
    def num():
        nonlocal i
        v = float(tok[i]); i += 1
        return v
    while i < len(tok):
        if re.fullmatch(r"[MLQCmlqc]", tok[i]):
            cmd = tok[i].upper(); i += 1
            if tok[i - 1].islower():
                raise SystemExit("gebruik absolute commando's (M L Q C), geen kleine letters")
        if cmd == "M":
            if len(cur) > 1:
                stukken.append(cur)
            pt = (num(), num()); cur = [pt]; cmd = "L"
        elif cmd == "L":
            pt = (num(), num()); cur.append(pt)
        elif cmd == "Q":
            c = (num(), num()); e = (num(), num())
            n = max(4, int(math.dist(pt, e) / stap))
            for k in range(1, n + 1):
                t = k / n
                cur.append(((1-t)**2*pt[0] + 2*(1-t)*t*c[0] + t*t*e[0],
                            (1-t)**2*pt[1] + 2*(1-t)*t*c[1] + t*t*e[1]))
            pt = e
        elif cmd == "C":
            c1 = (num(), num()); c2 = (num(), num()); e = (num(), num())
            n = max(4, int(math.dist(pt, e) / stap))
            for k in range(1, n + 1):
                t = k / n
                cur.append(tuple((1-t)**3*a + 3*(1-t)**2*t*b + 3*(1-t)*t*t*c + t**3*f
                                 for a, b, c, f in zip(pt, c1, c2, e)))
            pt = e
        else:
            i += 1
    if len(cur) > 1:
        stukken.append(cur)
    return [np.array(s, float) for s in stukken]


def arceer_vorm(poly, w, h, rnd, schaal):
    masker = Image.new("L", (w, h), 0)
    ImageDraw.Draw(masker).polygon([tuple(p) for p in poly], fill=255)
    grijs = 255 - np.asarray(masker)  # donker = binnen de vorm
    return schets.arceer(grijs, 1.0, rnd, schaal)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("invoer")
    ap.add_argument("uit")
    ap.add_argument("--svg")
    ap.add_argument("--halen", type=int, default=4)
    ap.add_argument("--los", type=float, default=1.8)
    ap.add_argument("--breedte", type=int, default=1000)
    ap.add_argument("--kleur", default="3a302a")
    ap.add_argument("--zaad", type=int, default=7)
    a = ap.parse_args()

    rnd = random.Random(a.zaad)
    (x0, y0, vw, vh), paden = lees_paden(a.invoer)
    f = a.breedte / max(vw, vh)
    w, h = round(vw * f), round(vh * f)
    schaal = max(w, h) / 1000

    strokes = []
    for soort, d in paden:
        for poly in bemonster(d):
            poly = (poly - [x0, y0]) * f
            if soort == "arceer":
                for s in arceer_vorm(poly, w, h, rnd, schaal):
                    strokes.append((schets.haal(s, rnd, schaal * 0.45, 2), 1.3 * schaal, rnd.uniform(0.6, 0.9)))
                continue
            for i in range(a.halen):
                breed = (4.4 if i == 0 else rnd.uniform(2.3, 3.4)) * schaal
                dek = 0.97 if i == 0 else rnd.uniform(0.6, 0.9)
                strokes.append((schets.haal(poly, rnd, schaal * a.los, 18), breed, dek))

    kl = tuple(int(a.kleur[i:i + 2], 16) for i in (0, 2, 4))
    emmers = {}
    for p, breed, dek in strokes:
        emmers.setdefault(min(3, int(dek * 4)), []).append((p, breed))
    dekking = np.zeros((h * SS, w * SS), np.float32)
    for k, lijst in emmers.items():
        laag = Image.new("L", (w * SS, h * SS), 0)
        teken = ImageDraw.Draw(laag)
        for p, breed in lijst:
            pts = [(float(x) * SS, float(y) * SS) for x, y in p]
            if len(pts) >= 2:
                teken.line(pts, fill=255, width=max(1, round(breed * SS)), joint="curve")
        m = np.asarray(laag, np.float32) / 255 * ((k + 0.5) / 4)
        dekking = 1 - (1 - dekking) * (1 - m)
    alfa = Image.fromarray(np.clip(dekking * 255, 0, 255).astype(np.uint8)).resize((w, h), Image.LANCZOS)
    doek = Image.new("RGBA", (w, h), kl + (0,))
    doek.putalpha(alfa)
    doek.save(a.uit)
    if a.svg:
        with open(a.svg, "w", encoding="utf-8") as fh:
            fh.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none" '
                     f'stroke="#{a.kleur}" stroke-linecap="round" stroke-linejoin="round">\n')
            for p, breed, dek in strokes:
                fh.write('<path d="M' + " L".join(f"{x:.1f} {y:.1f}" for x, y in p) +
                         f'" stroke-width="{breed:.2f}" opacity="{dek:.2f}"/>\n')
            fh.write("</svg>\n")
    print(f"{a.uit}: {len(strokes)} halen uit {len(paden)} paden, {w}x{h}")


if __name__ == "__main__":
    main()
