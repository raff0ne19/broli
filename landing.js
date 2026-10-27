// La landing: il disco della seduta e le schermate dell'app, ridisegnati da SessionPlate.swift e
// dalle tavole del design "gomma e gesso". Le schermate sono illustrazioni, non screenshot.
(function () {
  "use strict";
  const en = document.documentElement.dataset.lang === "en";
  const L = (it, eng) => (en ? eng : it);
  const kg = (v) => v.toLocaleString(en ? "en-US" : "it-IT", { maximumFractionDigits: 1 });
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { plate, superset, timed, closed, markSVG, drawMark } = window.Plate;

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
    skip: `<svg viewBox="0 0 24 24" class="i"><path d="M2 5.5v13l9.5-6.5zM12 5.5v13l9.5-6.5z" fill="currentColor"/></svg>`,
    search: `<svg viewBox="0 0 24 24" class="i"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M15.5 15.5l5 5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    shrink: `<svg viewBox="0 0 24 24" class="i"><path d="M4 4l6 6M10 5v5H5M20 20l-6-6M14 19v-5h5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    more: `<svg viewBox="0 0 24 24" class="i"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>`,
    share: `<svg viewBox="0 0 24 24" class="i"><path d="M12 3v12M7.5 7.5L12 3l4.5 4.5M7 11H5.5v9.5h13V11H17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    battery: `<svg viewBox="0 0 28 13" width="27" height="13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" stroke-opacity=".4"/><rect x="2.5" y="2.5" width="17" height="8" rx="2" fill="currentColor"/><path d="M25.5 4.5v4" stroke="currentColor" stroke-opacity=".4" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    lift: `<svg viewBox="0 0 28 20"><rect x="1" y="7" width="3" height="6" rx="1"/><rect x="5" y="3" width="4" height="14" rx="1.2"/><rect x="9" y="8.6" width="10" height="2.8"/><rect x="19" y="3" width="4" height="14" rx="1.2"/><rect x="24" y="7" width="3" height="6" rx="1"/></svg>`,
    figure: `<svg viewBox="0 0 28 22"><circle cx="14" cy="3.5" r="3"/><path d="M3 8h22v2.4H3zM10 10h8l-1 6 2.5 6h-3L14 17l-2.5 5h-3l2.5-6z"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M5 4h14a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm-1 6v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9z"/><path d="M6 12h2v2H6zM11 12h2v2h-2zM16 12h2v2h-2zM6 16h2v2H6zM11 16h2v2h-2z"/></svg>`,
    person: `<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 1a11 11 0 1 1 0 22 11 11 0 0 1 0-22zm0 4.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4.5 19c2 2.2 4.6 3.2 7.5 3.2s5.5-1 7.5-3.2c-2-3.5-4.6-4.6-7.5-4.6s-5.5 1.1-7.5 4.6z"/></svg>`,
    gear: `<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M10.3 1.5h3.4l.6 2.9 1.9.8 2.5-1.6 2.4 2.4-1.6 2.5.8 1.9 2.9.6v3.4l-2.9.6-.8 1.9 1.6 2.5-2.4 2.4-2.5-1.6-1.9.8-.6 2.9h-3.4l-.6-2.9-1.9-.8-2.5 1.6-2.4-2.4 1.6-2.5-.8-1.9-2.9-.6v-3.4l2.9-.6.8-1.9-1.6-2.5 2.4-2.4 2.5 1.6 1.9-.8zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>`,
  };
  const status = (time = "9:41") => `<div class="sb"><span>${time}</span><span class="island"></span>${I.battery}</div>`;
  const x = (r, w) => `${kg(w)} × ${r}`;

  // Volume accumulato, oggi contro la volta scorsa (CompareChart): due linee, la legenda sotto.
  function volumeChart() {
    const line = (pts) => pts.map(([t, v], i) => `${i ? "L" : "M"}${(t / 58) * 270} ${108 - (v / 9) * 100}`).join("");
    const today = [[0, 0], [12, 2.1], [24, 4.4], [36, 6.1], [47, 7.5], [58, 8.42]];
    const last = [[0, 0], [13, 1.9], [26, 4], [39, 5.7], [50, 7.1], [58, 8]];
    return `<svg class="chart" viewBox="0 0 310 120" aria-hidden="true">
      ${[0, 4, 8].map((v) => `<path d="M0 ${108 - (v / 9) * 100}H270" stroke="var(--line)"/><text x="280" y="${112 - (v / 9) * 100}">${v ? v + " t" : 0}</text>`).join("")}
      <path d="${line(last)}" fill="none" stroke="var(--ink3)" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="${line(today)}" fill="none" stroke="var(--heat)" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="270" cy="${108 - (8.42 / 9) * 100}" r="5" fill="var(--heat)"/></svg>
      <div class="legend"><span><i class="now"></i><b>${L("Oggi", "Today")}</b></span><span class="sub"><i></i>${L("Volta scorsa", "Last time")}</span></div>`;
  }

  const screens = {
    schede: () => `${status()}<div class="pad">
      <div class="row between"><h4 class="t34">${L("Schede", "Routines")}</h4><span class="round">${I.plus}</span></div>
      <div class="search">${I.search}${L("Cerca tra 5 schede", "Search 5 routines")}</div>
      <div class="lbl">${L("Questa settimana", "This week")}</div>
      <div class="card row"><span class="pl" style="width:48px">${plate(4, 2)}</span><span class="d26">${L("2 allenamenti di 4", "2 of 4 workouts")}</span></div>
      <div class="card next pop" style="--z:70"><div class="sub">${L("Tocca a", "Up next")}</div><div class="d40">${L("Gambe A", "Legs A")}</div>
        <div class="sub">${L("5 esercizi, circa 60 minuti. L'ultima volta giovedì.", "5 exercises, about 60 minutes. Last time Thursday.")}</div>
        <div class="btn in">${I.play}${L("Inizia", "Start")}</div></div>
      <div class="lbl">${L("Le tue schede", "Your routines")}</div>
      <div class="card list">${[["Push A", L("6 esercizi, martedì", "6 exercises, Tuesday")], ["Pull A", L("6 esercizi, mercoledì", "6 exercises, Wednesday")]]
        .map(([n, s]) => `<div class="row between li"><div><div class="nm">${n}</div><div class="sub">${s}</div></div><span class="round sm">${I.play}</span></div>`).join("")}</div>
      </div><div class="tabs"><span class="on">${I.lift}</span><span>${I.figure}</span><span>${I.calendar}</span><span>${I.person}</span><span>${I.gear}</span></div>`,

    serie: () => `${status()}<div class="pad">
      <div class="row wk"><span class="round">${I.shrink}</span><span class="pl" style="width:34px">${plate(5, 0)}</span>
        <div class="grow"><div class="nm">${L("Gambe A", "Legs A")}</div><div class="sub">24:10</div></div><span class="pill">${L("Termina", "End")}</span></div>
      <div class="seg"><span class="on">${L("Lista", "List")}</span><span>${L("Una serie", "One set")}</span></div>
      <div class="card ex"><div class="row between"><h4 class="d30">Squat</h4><span class="row"><span class="pl" style="width:44px" data-plate></span><span class="more">${I.more}</span></span></div>
        <div class="sub">${L("riposo 2:00", "rest 2:00")}</div>
        <div class="goal"><div class="row between"><span class="red">${L("Sei avanti", "You're ahead")}</span><b class="d20 red">+${kg(2.5)} kg</b></div>
          <div class="gbar"><i></i></div><div class="sub">${L("Rispetto alla volta scorsa.", "Compared to last time.")}</div></div>
        <div class="sets" data-sets></div></div>
      ${[[L("Stacco rumeno", "Romanian deadlift"), "4 × 8"], ["Leg press", "3 × 10"]].map(([n, s]) => `<div class="row between li"><span class="nm">${n}</span><span class="sub">${s}</span></div>`).join("")}
      </div>
      <div class="dock pop" style="--z:40"><span class="pl" style="width:46px" data-dock-plate></span><div class="grow"><div class="d30" data-dock-val></div><div class="sub" data-dock-sub></div></div><span class="tick" data-press>${I.check}</span></div>`,

    blocco: () => `<div class="lock"><div class="sb"><span>9:41</span><span class="island wide"><span class="pl" style="width:22px">${plate(5, 0)}</span><b class="red" data-count="74" data-from="120"></b></span>${I.battery}</div>
      <div class="date">${L("venerdì 17 ottobre", "Friday, October 17")}</div><div class="clock">18:42</div>
      <div class="la pop" style="--z:100"><div class="row"><span class="pl" style="width:40px">${plate(5, 0)}</span>
        <div class="grow"><div class="sub">${L("Squat, poi serie 4", "Squat, then set 4")}</div><div class="d26">${x(5, 102.5)}</div></div>
        <div class="r"><div class="sub">${L("Riposo", "Rest")}</div><div class="d40" data-count="74" data-from="120"></div></div></div>
        <div class="row two"><span>+30 s</span><span>${L("Salta", "Skip")}</span></div></div></div>`,

    fine: () => `${status()}<div class="pad">
      <div class="row hero"><span class="pl pop" style="width:64px;--z:130">${closed()}</span>
        <div><h4 class="d30">${L("Disco chiuso", "Plate closed")}</h4><div class="sub">${L("Gambe A, 58 minuti, 5 esercizi su 5", "Legs A, 58 min, 5 of 5 exercises")}</div></div></div>
      <div class="card"><div class="lbl in">${L("Riepilogo", "Summary")}</div><div class="stats"><div><span class="d26">19</span><span class="sub">${L("serie", "sets")}</span></div><div><span class="d26">${L("8.420", "8,420")}</span><span class="sub">${L("kg sollevati", "kg lifted")}</span></div><div><span class="d26 red">2</span><span class="sub">${L("record", "PR")}</span></div></div></div>
      <div class="card"><div class="nm">${L("Com'è andato l'allenamento", "How the workout went")}</div>
        <div class="row head"><span class="d30">+420 kg</span><span class="sub">${L("sulla volta scorsa", "vs last time")}</span></div>${volumeChart()}</div>
      <div class="card"><div class="lbl in">${L("Record di oggi", "Today's PRs")}</div>
        ${[["Squat", x(5, 102.5)], [L("Stacco rumeno", "Romanian deadlift"), x(8, 85)]].map(([n, v]) => `<div class="row rec"><span class="grow">${n}</span><span class="d20">${v}</span><small class="sub">${L("di peso", "weight")}</small></div>`).join("")}
        <div class="sub foot">${L("Volta scorsa battuta in 4 esercizi su 5.", "Last time beaten on 4 of 5 exercises.")}</div></div>
      </div><div class="acts"><span class="btn sec">${I.share}${L("Condividi", "Share")}</span><span class="btn">${I.check}${L("Fatto", "Done")}</span></div>`,

    watchSerie: () => `<div class="w-time">18:42</div><div class="w-pad set-w"><div class="row between w-top"><div><b>Squat</b><div class="sub">${L("Serie 3 di 5", "Set 3 of 5")}</div></div><span class="round w-more">${I.more}</span></div>
      <div class="row"><span class="pl pop" style="width:62px;--z:50">${plate(5, 2)}</span><div class="w-num"><span class="d40">${kg(102.5)}</span><span class="u">×</span><span class="d30">5</span></div></div>
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

  // La serie in corso: ogni tocco sulla spunta segna la serie che tocca e il disco dell'esercizio
  // prende un pezzo; a cinque il disco è chiuso e in basso arriva l'esercizio dopo.
  const serie = document.querySelector('[data-screen="serie"]');
  function setDone(d) {
    serie.querySelector("[data-plate]").innerHTML = plate(5, d);
    serie.querySelector("[data-sets]").innerHTML = [0, 1, 2, 3, 4].map((i) =>
      `<div class="set ${i < d ? "done" : i === d ? "now" : "next"}"><span class="n">${i + 1}</span>` +
      `<span class="d26">${kg(102.5)}<small>kg</small><span class="u">×</span>5</span>${i < d ? I.check : `<span class="ring"></span>`}</div>`).join("");
    const end = d >= 5;
    serie.querySelector("[data-dock-plate]").innerHTML = end ? plate(4, 0) : plate(5, d);
    serie.querySelector("[data-dock-val]").textContent = end ? `80 kg × 8` : `${kg(102.5)} kg × 5`;
    serie.querySelector("[data-dock-sub]").textContent = end ? L("Stacco rumeno, serie 1 di 4", "Romanian deadlift, set 1 of 4")
      : L(`Squat, serie ${d + 1} di 5`, `Squat, set ${d + 1} of 5`);
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
