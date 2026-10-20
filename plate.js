// Il disco della seduta e il marchio, ridisegnati in SVG da SessionPlate.swift (stessa geometria,
// stessi colori): li usano l'intestazione di ogni pagina (il nome col disco nella "o") e la landing.
(function () {
  "use strict";
  const C = {
    // I pezzi vuoti e il pezzo in corso del marchio seguono il tema (variabili in style.css); per
    // questo vanno in style: gli attributi fill e stroke non leggono le variabili CSS.
    empty: "var(--pl-empty)",
    markRed: ["#F23A2F", "#C01A12"], markArriving: ["var(--mark-arr-a)", "var(--mark-arr-b)"],
    markSteel: ["#D3D5DA", "#7C7F86"], markCore: "#0D0D0E",
  };
  let uid = 0;

  // PlateArc: corona da `from` a `to` (giri da ore 12, senso orario), con fessure a bordi paralleli.
  function arc(c, base, from, to, inner = 0.66, gs = 0, ge = 0, push = 0) {
    const mid = (base + base * inner) / 2, outer = base * (1 + push), ir = base * (inner + push);
    const hs = mid * Math.sin(Math.PI * gs), he = mid * Math.sin(Math.PI * ge);
    const as = (from - gs / 2) * 2 * Math.PI - Math.PI / 2, ae = (to + ge / 2) * 2 * Math.PI - Math.PI / 2;
    const edge = (axis, half, r, sign) => axis + sign * Math.asin(Math.min(1, half / r));
    const o0 = edge(as, hs, outer, 1), o1 = edge(ae, he, outer, -1);
    const i0 = edge(as, hs, ir, 1), i1 = edge(ae, he, ir, -1);
    if (!(o1 > o0 && i1 > i0)) return "";
    const p = (r, a) => `${(c + r * Math.cos(a)).toFixed(2)} ${(c + r * Math.sin(a)).toFixed(2)}`;
    return `M${p(outer, o0)}A${outer} ${outer} 0 ${o1 - o0 > Math.PI ? 1 : 0} 1 ${p(outer, o1)}` +
      `L${p(ir, i1)}A${ir} ${ir} 0 ${i1 - i0 > Math.PI ? 1 : 0} 0 ${p(ir, i0)}Z`;
  }

  // La geometria del marchio, una sola anche per il disco della seduta (PlateShape in SessionPlate.swift):
  // pezzi da 0,44 a 1 del raggio nel 93% del lato, fessure a striscia del 6%, più strette oltre sei pezzi.
  const INNER = 0.44, R = 46.5, MID = R * (1 + INNER) / 2;
  const gapFor = (strip) => Math.asin((strip * 100) / 2 / MID) / Math.PI;
  const gapPieces = (n) => (n > 1 ? gapFor(Math.min(0.06, 0.36 / n)) : 0);
  const redGrad = (id) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="3.5" y1="3.5" x2="96.5" y2="96.5"><stop offset="0" stop-color="#F23A2F"/><stop offset="1" stop-color="#C01A12"/></linearGradient>`;

  // Il mozzo del marchio: acciaio col foro scuro; col numero il foro si allarga.
  function hub(text) {
    const id = "st" + uid++;
    return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.markSteel[0]}"/><stop offset="1" stop-color="${C.markSteel[1]}"/></linearGradient></defs>` +
      `<circle cx="50" cy="50" r="15" fill="url(#${id})"/><circle cx="50" cy="50" r="${text ? 9.5 : 6.5}" fill="${C.markCore}"/>` +
      (text ? `<text x="50" y="50" dy=".36em" text-anchor="middle" font-family="Barlow SC" font-weight="700" font-size="12" fill="#F1F0EC">${text}</text>` : "");
  }

  // SessionPlate .parts: `done` pezzi rossi, il successivo in corso (il rosso al 32%). Pieno = ClosedPlate.
  function plate(total, done, hubText) {
    if (done >= total) return closed(total);
    const gap = gapPieces(total), rid = "rd" + uid++;
    let s = `<svg viewBox="0 0 100 100" aria-hidden="true"><defs>${redGrad(rid)}</defs>`;
    for (let i = 0; i < total; i++) {
      const fill = i < done ? `url(#${rid})` : i === done ? "rgba(226,35,26,.32)" : C.empty;
      s += `<path style="fill:${fill}" d="${arc(50, R, i / total + gap / 2, (i + 1) / total - gap / 2, INNER, gap, gap)}"/>`;
    }
    return s + hub(hubText) + "</svg>";
  }

  // .superset: giri di esercizi, i pezzi di un giro vicini, il secondo esercizio in un rosso più profondo.
  function superset(rounds, exercises, done, hubText) {
    const n = rounds * exercises, roundGap = gapPieces(rounds), pieceGap = gapFor(0.016), span = 1 / rounds;
    const piece = (span - roundGap - (exercises - 1) * pieceGap) / exercises, rid = "rd" + uid++;
    let s = `<svg viewBox="0 0 100 100" aria-hidden="true"><defs>${redGrad(rid)}</defs>`;
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / exercises), e = i % exercises, from = r * span + roundGap / 2 + e * (piece + pieceGap);
      const deep = e % 2 === 1;
      const fill = i < done ? (deep ? "#A3150F" : `url(#${rid})`) : i === done ? (deep ? "rgba(163,21,15,.32)" : "rgba(226,35,26,.32)") : C.empty;
      s += `<path style="fill:${fill}" d="${arc(50, R, from, from + piece, INNER, e === 0 ? roundGap : pieceGap, e === exercises - 1 ? roundGap : pieceGap)}"/>`;
    }
    return s + hub(hubText) + "</svg>";
  }

  // .timed (AMRAP): niente pezzi, il disco si riempie col tempo.
  function timed(progress, hubText) {
    const rid = "rd" + uid++, w = R * (1 - INNER);
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><defs>${redGrad(rid)}</defs>` +
      `<circle cx="50" cy="50" r="${R - w / 2}" fill="none" style="stroke:${C.empty}" stroke-width="${w}"/>` +
      `<path fill="url(#${rid})" d="${arc(50, R, 0, progress, INNER)}"/>` + hub(hubText) + "</svg>";
  }

  // Lo stato chiuso: il marchio coi pezzi tutti rossi.
  function closed(pieces = 5) {
    const gap = gapPieces(pieces), rid = "rd" + uid++;
    let s = `<svg viewBox="0 0 100 100" aria-hidden="true"><defs>${redGrad(rid)}</defs>`;
    for (let i = 0; i < pieces; i++) s += `<path fill="url(#${rid})" d="${arc(50, R, i / pieces + gap / 2, (i + 1) / pieces - gap / 2, INNER, gap, gap)}"/>`;
    return s + hub() + "</svg>";
  }

  // BroliPlate col palette .mark, il marchio piatto: quattro pezzi rossi e il quinto, in corso (il
  // rosso al 32% sul fondo del tema), che arriva. Niente faccia (le fessure sono tagli nel fondo) e
  // niente ombre, come nell'app; l'icona sola ha il volume. `fill` e `push` si animano come nel
  // benvenuto dell'app.
  const GAP = Math.asin(0.03 / (0.72 * 0.465)) / Math.PI;
  function markSVG() {
    const k = uid++;
    const grad = (id, [a, b]) => `<linearGradient id="${id}${k}" gradientUnits="userSpaceOnUse" x1="3.5" y1="3.5" x2="96.5" y2="96.5"><stop offset="0" style="stop-color:${a}"/><stop offset="1" style="stop-color:${b}"/></linearGradient>`;
    return `<svg viewBox="-6 -6 112 112" aria-hidden="true"><defs>${grad("r", C.markRed)}${grad("c", C.markArriving)}${grad("s", C.markSteel)}</defs>` +
      [0, 1, 2, 3].map(() => `<path class="piece" fill="url(#r${k})"/>`).join("") +
      `<path class="piece" fill="url(#c${k})"/>` +
      `<circle cx="50" cy="50" r="15" fill="url(#s${k})"/><circle cx="50" cy="50" r="6.5" fill="${C.markCore}"/></svg>`;
  }
  function drawMark(el, fill, push) {
    el.querySelectorAll(".piece").forEach((p, i) => {
      const from = i / 5 + GAP / 2, to = (i + 1) / 5 - GAP / 2;
      const t = Math.min(1, Math.max(0, (fill - i / 5) * 5));
      p.setAttribute("d", arc(50, 46.5, from, from + (to - from) * t, 0.44, GAP, GAP, i === 4 ? push : 0));
    });
  }

  // Il nome col disco al posto della "o", come BroliLogotype nell'app: il disco a filo, con le misure della "o" di Bricolage (vedi .wordmark .o in style.css).
  function logotype() {
    const t = document.createElement("div");
    t.innerHTML = markSVG();
    drawMark(t, 1, 0);
    return `br<span class="o">${t.innerHTML}</span>li`;
  }

  window.Plate = { arc, plate, superset, timed, closed, markSVG, drawMark, logotype };
})();
