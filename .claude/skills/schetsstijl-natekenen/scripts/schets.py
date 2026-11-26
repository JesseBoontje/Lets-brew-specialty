#!/usr/bin/env python3
"""Teken een afbeelding na in Jesse's potloodstijl.

Elke rand wordt twee of drie keer met de hand overgetrokken: elke haal wijkt
anders af, loopt voorbij de hoek door en sluit niet netjes. Donkere vlakken
krijgen arcering van losse, net niet evenwijdige streepjes. Geen vulling, geen
grijs: alleen bruinzwarte inkt op transparant.

Gebruik:
    python3 schets.py invoer.png uit.png [--modus foto|lijn] [--breedte 1000]
                       [--halen 3] [--arcering 0.30] [--detail 1.0]
                       [--kleur 3a302a] [--zaad 7] [--svg uit.svg]

    --modus foto   foto of render: randen worden opgespoord (standaard)
    --modus lijn   tekening of logo met lijnen: de lijnen zelf worden gevolgd
    --arcering     0 = geen; 0.2-0.4 = alleen echt donkere delen (standaard 0.30)
    --detail       lager = minder kleine lijntjes (0.6 bij drukke foto's)
    --zaad         ander getal = andere hand, zelfde stijl

Vereist: numpy, pillow, opencv-contrib-python-headless (wordt zo nodig
geïnstalleerd).
"""
import argparse
import math
import random
import subprocess
import sys

try:
    import cv2
    import numpy as np
    from PIL import Image, ImageDraw
except ImportError:  # eerste keer in een nieuwe omgeving
    subprocess.run([sys.executable, "-m", "pip", "install", "-q",
                    "numpy", "pillow", "opencv-contrib-python-headless"], check=True)
    import cv2
    import numpy as np
    from PIL import Image, ImageDraw

SS = 3  # supersampling: tekenen op 3x en dan verkleinen geeft zachte lijnen


def laad(pad, breedte):
    im = Image.open(pad)
    im.load()
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        bg.alpha_composite(im)
        im = bg
    im = im.convert("RGB")
    s = breedte / max(im.size)
    im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    return np.array(im)


def randen(rgb, modus, detail):
    grijs = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    if modus == "lijn":
        _, inkt = cv2.threshold(grijs, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        inkt = cv2.morphologyEx(inkt, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
        return cv2.ximgproc.thinning(inkt), grijs
    # foto: ruis weg, randen behouden, dan Canny met drempels uit de mediaan
    # zwak contrast oprekken: een wit ding op een lichtgrijze achtergrond telt ook
    grijs = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8)).apply(grijs)
    zacht = cv2.bilateralFilter(grijs, 9, 60, 60)
    zacht = cv2.GaussianBlur(zacht, (0, 0), 1.2 / max(detail, 0.2))
    # drempels uit de sterkte van de randen zelf, niet uit de helderheid:
    # werkt dan op een witte productfoto net zo goed als op een grijze sfeerfoto
    gx = cv2.Sobel(zacht, cv2.CV_32F, 1, 0)
    gy = cv2.Sobel(zacht, cv2.CV_32F, 0, 1)
    mag = np.hypot(gx, gy)
    sterk = mag[mag > 8]
    hoog = float(np.percentile(sterk, 100 - 30 * detail)) if sterk.size else 100.0
    hoog = max(hoog, 20.0)
    rand = cv2.Canny(zacht, 0.4 * hoog, hoog, L2gradient=True)
    # dubbele randen van dunne delen (tuit, handvat) samenvoegen tot één lijn
    rand = cv2.dilate(rand, np.ones((3, 3), np.uint8), iterations=2)
    # kleine gaten in een rand dichten, zodat een contour één lange haal wordt
    rand = cv2.morphologyEx(rand, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    return cv2.ximgproc.thinning(rand), grijs


def lijnen_uit(rand, minlen):
    """Volg het 1-pixel skelet als een tekenaar: van eind naar eind, en lussen apart."""
    ys, xs = np.nonzero(rand)
    pix = set(zip(xs.tolist(), ys.tolist()))
    buren = [(-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1)]
    def nb(q):
        return [(q[0] + dx, q[1] + dy) for dx, dy in buren if (q[0] + dx, q[1] + dy) in pix]
    graad = {q: len(nb(q)) for q in pix}
    gezien = set()
    def loop(start):
        pad, cur = [start], start
        gezien.add(start)
        while True:
            vrij = [n for n in nb(cur) if n not in gezien]
            if not vrij:
                break
            # rechtdoor gaat voor: kies de buur die het best in de looprichting ligt
            if len(pad) > 2:
                rx, ry = cur[0] - pad[-3][0], cur[1] - pad[-3][1]
                vrij.sort(key=lambda n: -((n[0] - cur[0]) * rx + (n[1] - cur[1]) * ry))
            cur = vrij[0]
            gezien.add(cur)
            pad.append(cur)
            if graad[cur] > 2:
                break
        return pad
    paden = []
    for q in sorted(pix, key=lambda q: graad[q]):
        if q in gezien:
            continue
        if graad[q] == 1 or graad[q] > 2:
            while True:
                vrij = [n for n in nb(q) if n not in gezien]
                if not vrij and q in gezien:
                    break
                pad = loop(q)
                if len(pad) > 1:
                    paden.append(pad)
                if not [n for n in nb(q) if n not in gezien]:
                    break
    for q in pix:  # wat overblijft zijn gesloten lussen (cirkels, ringen)
        if q not in gezien:
            pad = loop(q)
            if len(pad) > 1:
                paden.append(pad + [pad[0]])
    uit = []
    for pad in paden:
        p = np.array(pad, dtype=float)
        lengte = np.sum(np.linalg.norm(np.diff(p, axis=0), axis=1))
        if lengte < minlen:
            continue
        p = cv2.approxPolyDP(p.astype(np.float32).reshape(-1, 1, 2), 1.4, False)[:, 0, :].astype(float)
        if len(p) >= 2:
            uit.append(p)
    return uit


def knip_op_hoeken(p, hoek=55):
    """Eén haal per rand: knip waar de lijn scherp van richting verandert."""
    if len(p) < 3:
        return [p]
    delen, start = [], 0
    for i in range(1, len(p) - 1):
        a, b = p[i] - p[i - 1], p[i + 1] - p[i]
        na, nb = np.linalg.norm(a), np.linalg.norm(b)
        if na < 1e-6 or nb < 1e-6:
            continue
        c = np.clip(np.dot(a, b) / (na * nb), -1, 1)
        if math.degrees(math.acos(c)) > hoek:
            delen.append(p[start:i + 1])
            start = i
    delen.append(p[start:])
    return [d for d in delen if len(d) >= 2]


def chaikin(p, n=2):
    for _ in range(n):
        if len(p) < 3:
            return p
        q = [p[0]]
        for a, b in zip(p[:-1], p[1:]):
            q += [0.75 * a + 0.25 * b, 0.25 * a + 0.75 * b]
        q.append(p[-1])
        p = np.array(q)
    return p


def herbemonster(p, stap=4.0):
    seg = np.linalg.norm(np.diff(p, axis=0), axis=1)
    L = np.concatenate([[0], np.cumsum(seg)])
    if L[-1] < 1:
        return p
    t = np.linspace(0, L[-1], max(2, int(L[-1] / stap) + 1))
    return np.stack([np.interp(t, L, p[:, 0]), np.interp(t, L, p[:, 1])], axis=1)


def haal(p, rnd, schaal, overschot):
    """Eén keer de pen erover: verschuiven, laten golven, voorbij de hoek."""
    p = herbemonster(p)
    n = len(p)
    L = np.sum(np.linalg.norm(np.diff(p, axis=0), axis=1))
    # voorbij de hoek doorlopen, aan elk eind anders
    for kant in (0, 1):
        a, b = (p[1], p[0]) if kant == 0 else (p[-2], p[-1])
        r = b - a
        nr = np.linalg.norm(r)
        if nr < 1e-6:
            continue
        ext = min(L * 0.12, overschot * schaal) * rnd.uniform(0.3, 1.0)
        extra = b + r / nr * ext
        p = np.vstack([extra, p]) if kant == 0 else np.vstack([p, extra])
    n = len(p)
    # loodrechte afwijking die langzaam golft en per uiteinde verschilt
    d = np.gradient(p, axis=0)
    nrm = np.stack([-d[:, 1], d[:, 0]], axis=1)
    nrm /= np.maximum(np.linalg.norm(nrm, axis=1, keepdims=True), 1e-6)
    t = np.linspace(0, 1, n)
    a0, a1 = rnd.uniform(-1, 1), rnd.uniform(-1, 1)
    golf = (a0 * (1 - t) + a1 * t) + 0.45 * np.sin(t * math.pi * rnd.uniform(1, 3) + rnd.uniform(0, 6))
    p = p + nrm * (golf * 3.2 * schaal)[:, None]
    # soms houdt de hand iets eerder op of begint later
    if n > 6 and rnd.random() < 0.35:
        k = rnd.randint(1, max(1, n // 6))
        p = p[k:] if rnd.random() < 0.5 else p[:-k]
    return chaikin(p, 2)


def arceer(grijs, drempel, rnd, schaal):
    """Donkere delen: losse streepjes onder een vaste hoek, licht scheef."""
    if drempel <= 0:
        return []
    grens = np.percentile(grijs, drempel * 100)
    masker = (grijs <= min(grens, 70)).astype(np.uint8)
    masker = cv2.morphologyEx(masker, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    h, w = masker.shape
    hoek = math.radians(rnd.uniform(-14, -6))
    dx, dy = math.cos(hoek), math.sin(hoek)
    tussen = 3.2 * schaal
    strepen = []
    diag = int(math.hypot(w, h))
    for k in np.arange(-diag, diag, tussen):
        ox, oy = w / 2 - dy * k, h / 2 + dx * k
        stuk = []
        for s in range(-diag, diag, 2):
            x, y = ox + dx * s, oy + dy * s
            ix, iy = int(x), int(y)
            binnen = 0 <= ix < w and 0 <= iy < h and masker[iy, ix]
            if binnen:
                stuk.append((x, y))
            elif stuk:
                if len(stuk) > 4:
                    strepen.append(np.array(stuk))
                stuk = []
        if len(stuk) > 4:
            strepen.append(np.array(stuk))
    return strepen


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("invoer")
    ap.add_argument("uit")
    ap.add_argument("--modus", choices=["foto", "lijn"], default="foto")
    ap.add_argument("--breedte", type=int, default=1000)
    ap.add_argument("--halen", type=int, default=4)
    ap.add_argument("--arcering", type=float, default=0.30)
    ap.add_argument("--detail", type=float, default=1.0)
    ap.add_argument("--kleur", default="3a302a")
    ap.add_argument("--zaad", type=int, default=7)
    ap.add_argument("--svg")
    a = ap.parse_args()

    rnd = random.Random(a.zaad)
    rgb = laad(a.invoer, a.breedte)
    h, w = rgb.shape[:2]
    schaal = max(w, h) / 1000
    rand, grijs = randen(rgb, a.modus, a.detail)
    minlen = (22 if a.modus == "foto" else 6) * schaal / max(a.detail, 0.2)

    strokes = []
    for lijn in lijnen_uit(rand, minlen):
        for deel in knip_op_hoeken(lijn):
            for i in range(a.halen):
                # eerste haal stevig, latere dunner en lichter
                breed = (3.2 if i == 0 else rnd.uniform(1.6, 2.4)) * schaal
                dek = 0.95 if i == 0 else rnd.uniform(0.45, 0.8)
                strokes.append((haal(deel, rnd, schaal, 14), breed, dek))
    for s in arceer(grijs, a.arcering, rnd, schaal):
        strokes.append((haal(s, rnd, schaal * 0.5, 3), 1.1 * schaal, rnd.uniform(0.55, 0.85)))

    kl = tuple(int(a.kleur[i:i + 2], 16) for i in (0, 2, 4))
    # vier lagen op dekking: halen in verschillende lagen worden donkerder waar
    # ze elkaar kruisen, zoals inkt die over inkt gaat
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
    # strak om het onderwerp, met wat lucht eromheen, zoals Jesse's tekeningen
    vak = alfa.point(lambda v: 255 if v > 40 else 0).getbbox()
    if vak:
        m = int(0.04 * max(w, h))
        doek = doek.crop((max(0, vak[0] - m), max(0, vak[1] - m), min(w, vak[2] + m), min(h, vak[3] + m)))
    doek.save(a.uit)

    if a.svg:
        with open(a.svg, "w", encoding="utf-8") as f:
            f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="none" '
                    f'stroke="#{a.kleur}" stroke-linecap="round" stroke-linejoin="round">\n')
            for p, breed, dek in strokes:
                d = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in p)
                f.write(f'<path d="{d}" stroke-width="{breed:.2f}" opacity="{dek:.2f}"/>\n')
            f.write("</svg>\n")
    print(f"{a.uit}: {len(strokes)} halen, {w}x{h}")


if __name__ == "__main__":
    main()
