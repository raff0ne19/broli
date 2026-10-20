// La landing: il disco della seduta e le schermate dell'app, ridisegnati da SessionPlate.swift e
// dalle tavole del design "gomma e gesso". Le schermate sono illustrazioni, non screenshot.
(function () {
  "use strict";
  const en = document.documentElement.dataset.lang === "en";
  const L = (it, eng) => (en ? eng : it);
  const kg = (v) => v.toLocaleString(en ? "en-US" : "it-IT", { maximumFractionDigits: 1 });
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const C = {
    // Faccia, pezzi vuoti e mozzo seguono il tema (variabili in style.css); per questo vanno in style:
    // gli attributi fill e stroke non leggono le variabili CSS.
    red: "#E2231A", face: "var(--pl-face)", empty: "var(--pl-empty)", hubRing: "var(--pl-ring)", hubCore: "var(--pl-core)",
    steel: "#B9BCC2", steelDark: "#6E7177", chalk: "var(--pl-chalk)",
    markFace: "#26262A", markRed: ["#F23A2F", "#C01A12"], markChalk: ["#FBFAF7", "#D4D1C9"],
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

  function hub(text) {
    const id = "st" + uid++;
    return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.steel}"/><stop offset="1" stop-color="${C.steelDark}"/></linearGradient></defs>` +
      `<circle cx="50" cy="50" r="19" style="fill:${C.hubRing}"/><circle cx="50" cy="50" r="14.5" fill="url(#${id})"/>` +
      `<circle cx="50" cy="50" r="8.5" style="fill:${C.hubCore}"/>` +
      (text ? `<text x="50" y="50" dy=".36em" text-anchor="middle" font-family="Barlow SC" font-weight="700" font-size="15" style="fill:${C.chalk}">${text}</text>` : "");
  }

  // SessionPlate .parts: `done` pezzi rossi, il successivo rosso tenue (in corso). Pieno = ClosedPlate.
  function plate(total, done, hubText) {
    if (done >= total) return closed(total);
    const gap = total > 1 ? 0.012 + 0.02 / total : 0;
    let s = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="50" style="fill:${C.face}"/>`;
    for (let i = 0; i < total; i++) {
      const fill = i < done ? C.red : i === done ? "rgba(226,35,26,.32)" : C.empty;
      s += `<path style="fill:${fill}" d="${arc(50, 45.5, i / total + gap / 2, (i + 1) / total - gap / 2, 0.66, gap, gap)}"/>`;
    }
    return s + hub(hubText) + "</svg>";
  }

  // .superset: giri di esercizi, i pezzi di un giro vicini, il secondo esercizio in un rosso più profondo.
  function superset(rounds, exercises, done, hubText) {
    const n = rounds * exercises, roundGap = 0.03, pieceGap = 0.008, span = 1 / rounds;
    const piece = (span - roundGap - (exercises - 1) * pieceGap) / exercises;
    let s = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="50" style="fill:${C.face}"/>`;
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / exercises), e = i % exercises, from = r * span + roundGap / 2 + e * (piece + pieceGap);
      const base = e % 2 ? "163,21,15" : "226,35,26";
      const fill = i < done ? `rgb(${base})` : i === done ? `rgba(${base},.32)` : C.empty;
      s += `<path style="fill:${fill}" d="${arc(50, 45.5, from, from + piece, 0.66, e === 0 ? roundGap : pieceGap, e === exercises - 1 ? roundGap : pieceGap)}"/>`;
    }
    return s + hub(hubText) + "</svg>";
  }

  // .timed (AMRAP): niente pezzi, il disco si riempie col tempo.
  function timed(progress, hubText) {
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="50" style="fill:${C.face}"/>` +
      `<circle cx="50" cy="50" r="37.77" fill="none" style="stroke:${C.empty}" stroke-width="15.47"/>` +
      `<path fill="${C.red}" d="${arc(50, 45.5, 0, progress)}"/>` + hub(hubText) + "</svg>";
  }

  function closed(pieces = 5) {
    const id = "hl" + uid++;
    let s = `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="${id}" cx=".35" cy=".3" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>` +
      `<circle cx="50" cy="50" r="50" fill="${C.red}"/><circle cx="50" cy="50" r="50" fill="url(#${id})"/>`;
    for (let i = 0; i < pieces; i++) s += `<rect x="47.25" y="0" width="5.5" height="17" style="fill:${C.face}" transform="rotate(${(i * 360) / pieces} 50 50)"/>`;
    return s + `<circle cx="50" cy="50" r="33" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="1.4"/>` +
      `<circle cx="50" cy="50" r="49" fill="none" style="stroke:${C.face}" stroke-width="2"/>` + hub() + "</svg>";
  }

  // BroliPlate, il marchio: quattro pezzi rossi e il quinto, di gesso, che arriva. `fill` e `push`
  // si animano come nel benvenuto dell'app.
  const GAP = Math.asin(0.03 / (0.72 * 0.465)) / Math.PI;
  function markSVG() {
    const k = uid++;
    const grad = (id, [a, b]) => `<linearGradient id="${id}${k}" gradientUnits="userSpaceOnUse" x1="3.5" y1="3.5" x2="96.5" y2="96.5"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
    return `<svg viewBox="-6 -6 112 112" aria-hidden="true"><defs>${grad("r", C.markRed)}${grad("c", C.markChalk)}${grad("s", C.markSteel)}` +
      `<filter id="d${k}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy=".8" stdDeviation="1.2" flood-color="#000" flood-opacity=".45"/></filter>` +
      `<filter id="dc${k}" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="1" dy="2.2" stdDeviation="3" flood-color="#000" flood-opacity=".65"/></filter>` +
      `<radialGradient id="in${k}" cx=".5" cy=".42" r=".55"><stop offset=".85" stop-color="${C.markFace}"/><stop offset="1" stop-color="#151517"/></radialGradient></defs>` +
      `<circle cx="50" cy="50" r="50" fill="url(#in${k})"/>` +
      [0, 1, 2, 3].map(() => `<path class="piece" fill="url(#r${k})" filter="url(#d${k})"/>`).join("") +
      `<path class="piece" fill="url(#c${k})" filter="url(#dc${k})"/>` +
      `<circle cx="50" cy="50" r="15" fill="url(#s${k})" filter="url(#d${k})"/><circle cx="50" cy="50" r="6.5" fill="${C.markCore}"/></svg>`;
  }
  function drawMark(el, fill, push) {
    el.querySelectorAll(".piece").forEach((p, i) => {
      const from = i / 5 + GAP / 2, to = (i + 1) / 5 - GAP / 2;
      const t = Math.min(1, Math.max(0, (fill - i / 5) * 5));
      p.setAttribute("d", arc(50, 46.5, from, from + (to - from) * t, 0.44, GAP, GAP, i === 4 ? push : 0));
    });
  }
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const back = (t) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);
  function animateMark(el) {
    if (still) return drawMark(el, 1, 0.12);
    let t0;
    const step = (now) => {
      t0 ??= now;
      const t = (now - t0) / 1000;
      drawMark(el, ease(Math.min(1, t / 1.4)), 0.12 * back(Math.min(1, Math.max(0, (t - 1.45) / 0.55))));
      if (t < 2.05) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Icone piccole (SF Symbols a mano).
  const I = {
    check: `<svg viewBox="0 0 24 24" class="i"><path d="M4.5 12.5l5 5 10-11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    play: `<svg viewBox="0 0 24 24" class="i"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" class="i"><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    down: `<svg viewBox="0 0 24 24" class="i"><path d="M5 9l7 7 7-7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    skip: `<svg viewBox="0 0 24 24" class="i"><path d="M2 5.5v13l9.5-6.5zM12 5.5v13l9.5-6.5z" fill="currentColor"/></svg>`,
    battery: `<svg viewBox="0 0 28 13" width="27" height="13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" stroke-opacity=".4"/><rect x="2.5" y="2.5" width="17" height="8" rx="2" fill="currentColor"/><path d="M25.5 4.5v4" stroke="currentColor" stroke-opacity=".4" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    lift: `<svg viewBox="0 0 28 20"><rect x="1" y="7" width="3" height="6" rx="1"/><rect x="5" y="3" width="4" height="14" rx="1.2"/><rect x="9" y="8.6" width="10" height="2.8"/><rect x="19" y="3" width="4" height="14" rx="1.2"/><rect x="24" y="7" width="3" height="6" rx="1"/></svg>`,
    figure: `<svg viewBox="0 0 28 22"><circle cx="14" cy="3.5" r="3"/><path d="M3 8h22v2.4H3zM10 10h8l-1 6 2.5 6h-3L14 17l-2.5 5h-3l2.5-6z"/></svg>`,
    person: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11"/><circle cx="12" cy="9.5" r="4" fill="#0D0D0E"/><path d="M4.5 19c2-3.5 4.6-4.6 7.5-4.6s5.5 1.1 7.5 4.6" fill="#0D0D0E"/></svg>`,
  };
  const status = (time = "9:41") => `<div class="sb"><span>${time}</span><span class="island"></span>${I.battery}</div>`;
  const x = (r, w) => `${kg(w)} × ${r}`;

  const screens = {
    schede: () => `${status()}<div class="pad">
      <div class="row between"><h4 class="t34">${L("Schede", "Routines")}</h4><span class="round">${I.plus}</span></div>
      <div class="row week"><span class="pl" style="width:54px">${plate(4, 2)}</span><div><div class="sub">${L("Questa settimana", "This week")}</div><div class="d22">${L("2 allenamenti di 4", "2 of 4 workouts")}</div></div></div>
      <div class="card next pop" style="--z:70"><div class="sub">${L("Tocca a", "Up next")}</div><div class="d40">${L("Gambe A", "Legs A")}</div>
        <div class="sub">${L("5 esercizi, circa 60 minuti. L'ultima volta 4 giorni fa.", "5 exercises, about 60 minutes. Last time 4 days ago.")}</div>
        <div class="btn in">${I.play}${L("Inizia", "Start")}</div></div>
      <div class="row between sect"><b>${L("Le tue schede", "Your routines")}</b><span class="sub">${L("Archivio", "Archive")}</span></div>
      ${[["Push A", L("6 esercizi, martedì", "6 exercises, Tuesday")], ["Pull A", L("6 esercizi, mercoledì", "6 exercises, Wednesday")], [L("Gambe B", "Legs B"), L("5 esercizi, 9 giorni fa", "5 exercises, 9 days ago")], ["Full body", L("7 esercizi, mai fatta", "7 exercises, never done")]]
        .map(([n, s]) => `<div class="row between li"><div><b>${n}</b><div class="sub">${s}</div></div><span class="round sm">${I.play}</span></div>`).join("")}
      </div><div class="tabs"><span class="on">${I.lift}${L("Schede", "Routines")}</span><span>${I.figure}${L("Esercizi", "Exercises")}</span><span>${I.person}${L("Profilo", "Profile")}</span></div>`,

    serie: () => `${status()}<div class="pad">
      <div class="row between top"><span class="ink2">${I.down}</span><span class="sub">${L("Gambe A", "Legs A")}&nbsp;&nbsp;24:10</span><b>${L("Fine", "End")}</b></div>
      <h4 class="t34">Squat</h4><div class="sub">${L("Esercizio 1 di 5", "Exercise 1 of 5")}</div>
      <div class="pl big pop" style="--z:120" data-plate></div>
      <div class="hero-num"><span class="d64">${kg(102.5)}</span><span class="u">kg</span><span class="u x">×</span><span class="d64">5</span><span class="u">reps</span></div>
      <div class="delta"><b>+${kg(2.5)} kg</b> ${L("rispetto all'ultima volta", "more than last time")}</div>
      <div class="sets" data-sets></div></div>
      <div class="btn foot pop" style="--z:40" data-press>${I.check}${L("Serie fatta", "Set done")}</div>`,

    blocco: () => `<div class="lock"><div class="sb"><span>9:41</span><span class="island wide"><span class="pl" style="width:22px">${plate(5, 3)}</span><b class="red" data-count="74" data-from="120"></b></span>${I.battery}</div>
      <div class="date">${L("venerdì 17 ottobre", "Friday, October 17")}</div><div class="clock">18:42</div>
      <div class="la pop" style="--z:100"><div class="row between"><div class="row"><span class="pl" style="width:58px">${plate(5, 3, "4")}</span>
        <div><div class="sub">${L("Squat, poi serie 4", "Squat, then set 4")}</div><div class="d26">${x(5, 102.5)}</div></div></div>
        <div class="r"><div class="sub">${L("Riposo", "Rest")}</div><div class="d34" data-count="74" data-from="120"></div></div></div>
        <div class="row two"><span>+30 s</span><span>${L("Salta", "Skip")}</span></div></div></div>`,

    fine: () => `${status()}<div class="pad center">
      <span class="pl pop" style="width:150px;margin:24px auto 0;--z:130">${closed()}</span>
      <h4 class="d40 pop" style="--z:60">${L("Disco chiuso.", "Plate closed.")}</h4><div class="sub">${L("Gambe A, 58 minuti, 5 esercizi su 5", "Legs A, 58 minutes, 5 of 5 exercises")}</div>
      <div class="stats"><div><span class="d26">${L("8.420", "8,420")}</span><span class="sub">${L("kg sollevati", "kg lifted")}</span></div><div><span class="d26">19</span><span class="sub">${L("serie", "sets")}</span></div><div><span class="d26 red">2</span><span class="sub">record</span></div></div>
      <div class="card left"><b>${L("Record di oggi", "Today's records")}</b>
        <div class="row between rec"><span class="ink2">Squat</span><span><span class="d22">${x(5, 102.5)}</span> <small class="sub">${L("prima", "was")} ${x(5, 100)}</small></span></div>
        <div class="row between rec"><span class="ink2">${L("Stacco rumeno", "Romanian deadlift")}</span><span><span class="d22">${x(8, 85)}</span> <small class="sub">${L("prima", "was")} ${x(8, 80)}</small></span></div></div>
      <div class="card left row"><span class="pl" style="width:50px">${plate(4, 3)}</span><div><b>${L("Settimana, 3 di 4", "Week, 3 of 4")}</b><div class="sub">${L("Ancora una e chiudi il disco della settimana.", "One more and you close the week's plate.")}</div></div></div>
      </div><div class="btn foot">${I.check}${L("Salva allenamento", "Save workout")}</div>`,

    watchSerie: () => `<div class="w-time">18:42</div><div class="w-pad"><b>Squat</b>
      <div class="row"><span class="pl pop" style="width:74px;--z:50">${plate(5, 2, "3")}</span><div class="d30">${kg(102.5)}<br>× 5</div></div>
      <div class="btn w">${I.check}${L("Fatta", "Done")}</div></div>`,

    watchRiposo: () => `<div class="w-time">18:42</div><div class="w-pad"><span class="sub">${L("Riposo", "Rest")}</span>
      <div class="d54" data-count="74" data-from="120"></div><div class="bar"><i data-bar></i></div>
      <div class="row small"><span class="pl" style="width:22px">${plate(5, 3)}</span><span class="sub">${L("Poi", "Next")} ${x(5, 102.5)}</span></div>
      <div class="row between"><span class="round w">30</span><span class="round w">${I.skip}</span></div></div>`,
  };

  // Le illustrazioni dei punti forti, fatte coi pezzi dell'app.
  const arts = {
    superset: () => `<div class="duo"><figure><span class="pl" style="width:120px">${superset(3, 2, 3, "B")}</span><figcaption>Superset</figcaption></figure>
      <figure><span class="pl" style="width:120px">${timed(0.42, "3")}</span><figcaption>AMRAP 10′</figcaption></figure></div>`,
    import: () => `<div class="mini"><div class="ok">${I.check}${L("Scheda riconosciuta", "Routine recognized")}</div>
      <div class="d26">${L("Gambe A", "Legs A")}</div><div class="sub">${L("5 esercizi, 19 serie, circa 60 minuti", "5 exercises, 19 sets, about 60 minutes")}</div>
      <div class="row between"><span>Squat</span><span class="d20">5 × 5 <small>${kg(102.5)} kg</small></span></div>
      <div class="row between"><span>${L("Stacco rumeno", "Romanian deadlift")}</span><span class="d20">4 × 8 <small>80 kg</small></span></div>
      <div class="sub">${L("e altri 3", "and 3 more")}</div></div>`,
    storico: () => `<div class="weeks">${[[4, 4, L("29 set", "Sep 29")], [4, 4, L("6 ott", "Oct 6")], [3, 4, L("13 ott", "Oct 13")], [1, 4, L("20 ott", "Oct 20")]]
      .map(([d, t, w]) => `<figure><span class="pl" style="width:64px">${d >= t ? closed(t) : plate(t, d, null)}</span><figcaption>${w}</figcaption></figure>`).join("")}</div>
      <div class="stats"><div><span class="d26">12</span><span class="sub">${L("allenamenti", "workouts")}</span></div><div><span class="d26">${L("96.400", "96,400")}</span><span class="sub">kg</span></div><div><span class="d26 red">7</span><span class="sub">record</span></div></div>`,
  };
  document.querySelectorAll("[data-art]").forEach((el) => (el.innerHTML = arts[el.dataset.art]()));

  document.querySelectorAll("[data-screen]").forEach((el) => (el.innerHTML = screens[el.dataset.screen]()));
  document.querySelectorAll("[data-mark]").forEach((el) => {
    el.innerHTML = markSVG();
    drawMark(el, still ? 1 : 0, still ? 0.12 : 0);
  });

  // La serie in corso: ogni tocco su "Serie fatta" aggiunge un pezzo, a cinque il disco si chiude.
  const serie = document.querySelector('[data-screen="serie"]');
  const prev = [80, 95, 102.5, 102.5, 102.5];
  function setDone(d) {
    serie.querySelector("[data-plate]").innerHTML = plate(5, d, String(Math.min(d + 1, 5)));
    serie.querySelector("[data-sets]").innerHTML = prev.map((w, i) =>
      `<div class="set ${i < d ? "done" : i === d ? "now" : "next"}"><span class="n">${i + 1}</span><span class="d20">${x(5, w)}</span>` +
      (i === 1 ? `<span class="tag">Record</span>` : "") + (i < d ? I.check : "") + "</div>").join("");
  }
  setDone(2);

  // Conti alla rovescia del riposo: tutti insieme, da 1:14, e ricominciano da 2:00.
  const counts = document.querySelectorAll("[data-count]");
  let left = 74;
  const showCount = () => {
    const t = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
    counts.forEach((c) => (c.textContent = t));
    document.querySelectorAll("[data-bar]").forEach((b) => (b.style.width = `${(left / 120) * 100}%`));
  };
  showCount();

  // 3D: ogni dispositivo sa dov'è rispetto al centro dello schermo (--p) e quanto escono i suoi pezzi (--lift).
  const devices = [...document.querySelectorAll(".phone, .watch")];
  let queued = false;
  const place = () => {
    queued = false;
    const mid = innerHeight / 2;
    devices.forEach((d) => {
      const r = d.parentElement.getBoundingClientRect();
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - mid) / (innerHeight * 0.8)));
      d.style.setProperty("--p", p.toFixed(3));
      d.style.setProperty("--tilt", Math.abs(p).toFixed(3));
      d.style.setProperty("--lift", (1 - Math.abs(p)).toFixed(3));
    });
  };
  if (!still) {
    const ask = () => { if (!queued) { queued = true; requestAnimationFrame(place); } };
    addEventListener("scroll", ask, { passive: true });
    addEventListener("resize", ask);
    place();
    // Il marchio in copertina segue il puntatore.
    const cover = document.querySelector(".cover"), m = cover.querySelector(".mark");
    cover.addEventListener("pointermove", (e) => {
      const b = m.getBoundingClientRect();
      m.style.setProperty("--rx", `${((e.clientX - b.left - b.width / 2) / innerWidth) * 50}deg`);
      m.style.setProperty("--ry", `${((b.top + b.height / 2 - e.clientY) / innerHeight) * 50}deg`);
    });
    cover.addEventListener("pointerleave", () => { m.style.removeProperty("--rx"); m.style.removeProperty("--ry"); });
  }

  if (still) return;
  const seen = new Set();
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting && e.target.matches("[data-mark]") && !seen.has(e.target)) { seen.add(e.target); animateMark(e.target); }
    e.target.classList.toggle("visible", e.isIntersecting);
  }), { threshold: 0.35 });
  document.querySelectorAll("[data-mark], [data-screen]").forEach((el) => io.observe(el));

  setInterval(() => { left = left > 0 ? left - 1 : 120; showCount(); }, 1000);

  let d = 2;
  setInterval(() => {
    if (!serie.classList.contains("visible")) return;
    if (d >= 5) { d = 2; setDone(d); return; }
    const b = serie.querySelector("[data-press]");
    b.classList.add("pressed");
    setTimeout(() => { b.classList.remove("pressed"); setDone(++d); }, 180);
  }, 2200);
})();
