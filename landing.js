// La landing: il disco della seduta e le schermate dell'app, ridisegnati da SessionPlate.swift e
// dagli screenshot dell'app di oggi (2026-10-30). Le schermate sono illustrazioni, non screenshot:
// nomi, pesi e ripetizioni sono d'esempio.
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
    up: `<svg viewBox="0 0 24 24" class="i"><path d="M5.5 15l6.5-6.5 6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    down: `<svg viewBox="0 0 24 24" class="i"><path d="M5.5 9l6.5 6.5L18.5 9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    share: `<svg viewBox="0 0 24 24" class="i"><path d="M12 3v12M7.5 7.5L12 3l4.5 4.5M7 11H5.5v9.5h13V11H17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    timer: `<svg viewBox="0 0 24 24" class="i"><circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M12 9v4.5l2.5 2M10 2.5h4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    trend: `<svg viewBox="0 0 24 24" class="i"><path d="M3 3v18h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6.5 15l4-4.5 3 3L20 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    back30: `<svg viewBox="0 0 24 24" class="i"><path d="M5.2 8.5A8 8 0 1 1 4 12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M5.5 3.8v5h5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><text x="12.4" y="15.6" text-anchor="middle" font-size="7.6" font-weight="700" fill="currentColor" font-family="-apple-system, sans-serif">30</text></svg>`,
    run: `<svg viewBox="0 0 24 24" class="i run"><circle cx="15" cy="4" r="2.2" fill="currentColor"/><path d="M13 7.5l-4 2-1.5 4M13 7.5l-1.8 5 3.3 2.6-.8 5M11.2 12.5l-3 3.5-4 .5M13 7.5l3 3.3 3.3.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    battery: `<svg viewBox="0 0 28 13" width="27" height="13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" stroke-opacity=".4"/><rect x="2.5" y="2.5" width="17" height="8" rx="2" fill="currentColor"/><path d="M25.5 4.5v4" stroke="currentColor" stroke-opacity=".4" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    // La barra in basso: Schede, Esercizi, Storico, Statistiche, Profilo.
    lift: `<svg viewBox="0 0 28 20"><rect x="1" y="7" width="3" height="6" rx="1"/><rect x="5" y="3" width="4" height="14" rx="1.2"/><rect x="9" y="8.6" width="10" height="2.8"/><rect x="19" y="3" width="4" height="14" rx="1.2"/><rect x="24" y="7" width="3" height="6" rx="1"/></svg>`,
    figure: `<svg viewBox="0 0 28 22"><circle cx="14" cy="3.5" r="3"/><path d="M3 8h22v2.4H3zM10 10h8l-1 6 2.5 6h-3L14 17l-2.5 5h-3l2.5-6z"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M5 4h14a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm-1 6v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9z"/><path d="M6 12h2v2H6zM11 12h2v2h-2zM16 12h2v2h-2zM6 16h2v2H6zM11 16h2v2h-2z"/></svg>`,
    bars: `<svg viewBox="0 0 24 24"><rect x="2.5" y="12" width="5" height="9.5" rx="1.2"/><rect x="9.5" y="7.5" width="5" height="14" rx="1.2"/><rect x="16.5" y="3" width="5" height="18.5" rx="1.2"/></svg>`,
    person: `<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 1a11 11 0 1 1 0 22 11 11 0 0 1 0-22zm0 4.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4.5 19c2 2.2 4.6 3.2 7.5 3.2s5.5-1 7.5-3.2c-2-3.5-4.6-4.6-7.5-4.6s-5.5 1.1-7.5 4.6z"/></svg>`,
  };
  const status = (time = "9:41") => `<div class="sb"><span>${time}</span><span class="island"></span>${I.battery}</div>`;
  // Il disco della settimana senza il pezzo in corso, come nella lista delle Schede (`current: false`).
  const settled = (svg) => svg.replace("rgba(226,35,26,.32)", "var(--pl-empty)");
  const x = (w, r) => `${kg(w)} × ${r}`;
  const xkg = (w, r) => `${kg(w)} kg × ${r}`;

  // L'esercizio della landing: quattro serie a salire, le stesse della volta scorsa.
  const SQUAT = L("Squat", "Squat");
  const SETS = [[80, 8], [85, 6], [90, 5], [90, 5]];
  const NEXT_EX = [L("Stacco rumeno", "Romanian deadlift"), 70, 10, 3];

  // Andamento a fine seduta (CompareChart): la forza accumulata oggi e la volta scorsa, in percentuale.
  function strengthChart() {
    const y = (v) => 108 - (v / 15) * 100;
    const line = (pts) => pts.map(([t, v], i) => `${i ? "L" : "M"}${(t / 58) * 262} ${y(v)}`).join("");
    const today = [[0, 0], [12, 2.6], [24, 5.2], [36, 7.6], [47, 9.6], [58, 11.4]];
    const last = [[0, 0], [13, 2.3], [26, 4.6], [39, 6.9], [50, 8.9], [58, 10.4]];
    return `<svg class="chart" viewBox="0 0 310 120" aria-hidden="true">
      ${[0, 5, 10, 15].map((v) => `<path d="M0 ${y(v)}H262" stroke="var(--line)"/><text x="276" y="${y(v) + 4}">${v ? v + "%" : 0}</text>`).join("")}
      <path d="${line(last)}" fill="none" stroke="var(--ink3)" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="${line(today)}" fill="none" stroke="var(--heat)" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="262" cy="${y(11.4)}" r="5" fill="var(--heat)"/></svg>
      <div class="legend"><span><i class="now"></i><b>${L("Oggi", "Today")}</b></span><span class="sub"><i></i>${L("Volta scorsa", "Last time")}</span></div>`;
  }

  const screens = {
    schede: () => `${status()}<div class="pad">
      <div class="row between"><h4 class="t34">${L("Schede", "Routines")}</h4><span class="round">${I.plus}</span></div>
      <div class="search">${I.search}${L("Cerca tra 5 schede", "Search 5 routines")}</div>
      <div class="lbl">${L("Questa settimana", "This week")}</div>
      <div class="card row"><span class="pl" style="width:46px">${settled(plate(4, 2))}</span><span class="d22">${L("2 allenamenti di 4", "2 of 4 workouts")}</span></div>
      <div class="card next pop" style="--z:70"><div class="sub">${L("Tocca a", "Up next")}</div><div class="d30">${L("Gambe A", "Legs A")}</div>
        <div class="sub sm">${L("5 esercizi, circa 60 minuti. L'ultima volta giovedì.", "5 exercises, about 60 minutes. Last time Thursday.")}</div>
        <div class="btn in">${I.play}${L("Inizia", "Start")}</div></div>
      <div class="lbl">${L("Le tue schede", "Your routines")}</div>
      <div class="card list">${[["Push A", L("6 esercizi, martedì", "6 exercises, Tuesday")], ["Pull A", L("6 esercizi, mercoledì", "6 exercises, Wednesday")]]
        .map(([n, s]) => `<div class="row between li"><div><div class="nm">${n}</div><div class="sub">${s}</div></div><span class="round sm">${I.play}</span></div>`).join("")}</div>
      </div><div class="tabs"><span class="on">${I.lift}</span><span>${I.figure}</span><span>${I.calendar}</span><span>${I.bars}</span><span>${I.person}</span></div>`,

    // Allenamento, vista Lista: l'esercizio aperto con l'obiettivo, la colonna "Prima" e i campi;
    // la serie che tocca nella barra in basso; dopo la spunta sale il foglio del riposo.
    serie: () => `${status()}<div class="pad">
      <div class="row wk"><span class="round">${I.shrink}</span><span class="pl" style="width:34px">${plate(5, 0)}</span>
        <div class="grow"><div class="nm">${L("Gambe A", "Legs A")}</div><div class="sub">24:10</div></div><span class="pill">${L("Termina", "End")}</span></div>
      <div class="seg"><span class="on">${L("Lista", "List")}</span><span>${L("Una serie", "One set")}</span></div>
      <div class="card ex"><div class="row between"><h4 class="d30">${SQUAT}</h4><span class="row tools"><span class="pl" style="width:40px" data-plate></span><span class="more">${I.more}</span><span class="chev">${I.up}</span></span></div>
        <div class="sub">${L("riposo 2:00", "rest 2:00")}</div>
        <div class="goal"><div class="row between"><span class="gl">${L("Ti basta", "All you need")}</span><b class="d22" data-goal></b></div>
          <div class="gbar"><i data-gbar></i></div><div class="sub">${L("Nella prossima serie, poi come previsto. Vale anche un peso sopra 90 kg.", "In the next set, then as planned. A weight above 90 kg counts too.")}</div></div>
        <div class="thead"><span>${L("Serie", "Set")}</span><span>${L("Prima", "Last")}</span><span>kg</span><span>reps</span><span></span></div>
        <div class="sets" data-sets></div>
        <div class="addset">${I.plus}${L("Aggiungi serie", "Add set")}</div></div>
      ${[[NEXT_EX[0], "3 × 8–10"], ["Leg press", "3 × 10–12"], ["Leg curl", "3 × 10–12"]].map(([n, s]) => `<div class="row between li"><span class="nm">${n}</span><span class="sub row">${s}${I.down}</span></div>`).join("")}
      </div>
      <div class="dock pop" style="--z:40"><span class="pl" style="width:44px" data-dock-plate></span><div class="grow"><div class="d30" data-dock-val></div><div class="sub" data-dock-sub></div></div><span class="tick" data-press>${I.check}</span></div>
      <div class="rest" data-rest><div class="grab"></div><div class="rt">${L("Riposo", "Rest")}</div>
        <div class="big" data-count="118" data-from="120"></div><div class="rbar"><i data-bar></i></div><div class="sub">${L("di 2:00", "of 2:00")}</div>
        <div class="row nx"><span class="pl" style="width:44px" data-rest-plate></span><div><div class="sub" data-rest-sub></div><div class="d26" data-rest-val></div><div class="sub" data-rest-last></div></div></div>
        <div class="row three"><span>−30 s</span><span>${I.timer}+30 s</span><span>${I.skip}${L("Salta", "Skip")}</span></div></div>`,

    blocco: () => `<div class="lock"><div class="sb"><span></span>${I.battery}</div>
      <div class="date">${L("Ven 17 ott", "Fri Oct 17")}</div><div class="clock">18:42</div>
      <div class="la pop" style="--z:100"><div class="row"><span class="pl" style="width:40px">${plate(4, 1)}</span>
        <div class="grow"><div class="sub">${L(`${SQUAT}, poi serie 2`, `${SQUAT}, then set 2`)}</div><div class="d26">${x(85, 6)}</div></div>
        <div class="r"><div class="sub">${L("Riposo", "Rest")}</div><div class="d40" data-count="74" data-from="120"></div></div></div>
        <div class="row two"><span>+30 s</span><span>${L("Salta", "Skip")}</span></div></div></div>`,

    fine: () => `${status()}<div class="pad">
      <div class="row hero"><span class="pl pop" style="width:64px;--z:130">${closed()}</span>
        <div><h4 class="d30">${L("Disco chiuso", "Plate closed")}</h4><div class="sub">${L("Gambe A, 58 minuti, 5 esercizi su 5", "Legs A, 58 minutes, 5 of 5 exercises")}</div></div></div>
      <div class="card"><div class="lbl in">${L("Riepilogo", "Summary")}</div><div class="stats"><div><span class="d26">19</span><span class="sub">${L("serie", "sets")}</span></div><div><span class="d26">${L("8.420", "8,420")}</span><span class="sub">${L("kg sollevati", "kg lifted")}</span></div><div><span class="d26 red">2</span><span class="sub">${L("record", "PR")}</span></div></div></div>
      <div class="card"><div class="nm">${L("Andamento", "Trend")}</div>
        <div class="row head"><span class="d30">+4%</span><span class="sub">${L("più forte della volta scorsa", "stronger than last time")}</span></div>${strengthChart()}</div>
      <div class="card"><div class="lbl in">${L("Oggi", "Today")}</div><div class="nm">${L("Hai battuto 2 record personali.", "You set 2 new PRs.")}</div>
        <div class="sub foot">${L("Volta scorsa battuta in 4 esercizi su 5.", "Last time beaten on 4 of 5 exercises.")}</div></div>
      </div><div class="acts"><span class="btn sec">${I.share}${L("Condividi", "Share")}</span><span class="btn">${I.check}${L("Fatto", "Done")}</span></div>`,

    watchSerie: () => `<div class="w-time">${I.run}18:42</div><div class="w-pad set-w"><div class="row between w-top"><div><b>${SQUAT}</b><div class="sub">${L("Serie 3 di 4", "Set 3 of 4")}</div></div><span class="round w-more">${I.more}</span></div>
      <div class="row"><span class="pl pop" style="width:62px;--z:50">${plate(4, 2, "3")}</span><div class="w-num"><span class="d40">${kg(90)}</span><span class="u">×</span><span class="d30">5</span></div></div>
      <div class="btn w">${I.check}${L("Fatta", "Done")}</div></div><div class="dots"><i></i><i class="on"></i><i></i></div>`,

    watchRiposo: () => `<div class="w-time">${I.run}18:42</div><div class="w-pad"><span class="sub">${L("Riposo", "Rest")}</span>
      <div class="d54" data-count="74" data-from="120"></div><div class="bar"><i data-bar></i></div>
      <div class="row small"><span class="pl" style="width:22px">${plate(4, 3)}</span><span class="sub">${L("Poi", "Next")}</span><b class="d20">${x(90, 5)}</b></div>
      <div class="row between"><span class="round w">${I.back30}</span><span class="round w">${I.skip}</span></div></div><div class="dots"><i></i><i class="on"></i><i></i></div>`,
  };

  // Le illustrazioni dei punti forti, fatte coi pezzi dell'app.
  const arts = {
    superset: () => `<div class="duo"><figure><span class="pl" style="width:120px">${superset(3, 2, 3, "B")}</span><figcaption>Superset</figcaption></figure>
      <figure><span class="pl" style="width:120px">${timed(0.42, "3")}</span><figcaption>AMRAP 10′</figcaption></figure></div>`,
    // L'anteprima di un programma arrivato da un link (ImportRoutineSheet, "Programma trovato").
    import: () => `<div class="mini"><div class="ok">${I.check}${L("Programma trovato", "Program found")}</div>
      <div class="d26">${L("Forza, 4 giorni", "Strength, 4 days")}</div><div class="sub">${L("di Marco, 4 sessioni", "by Marco, 4 sessions")}</div>
      ${[[L("Gambe A", "Legs A"), L("5 esercizi, 19 serie, circa 60 minuti", "5 exercises, 19 sets, about 60 minutes")], ["Push A", L("6 esercizi, 18 serie, circa 55 minuti", "6 exercises, 18 sets, about 55 minutes")]]
        .map(([n, s], i) => `<div class="row ses"><span class="sub n">${i + 1}</span><div><div class="nm">${n}</div><div class="sub">${s}</div></div></div>`).join("")}
      <div class="sub">${L("e altre 2", "and 2 more")}</div><div class="btn in">${L("Aggiungi il programma", "Add program")}</div></div>`,
    // Lo Storico per settimana: lo scarto sulla settimana prima, a questo punto, e le sessioni col disco.
    storico: () => `<div class="mini hist"><div class="hseg"><span>${L("Giorno", "Day")}</span><span class="on">${L("Settimana", "Week")}</span><span>${L("Mese", "Month")}</span><span>${L("Anno", "Year")}</span></div>
      <div class="ok red">${I.trend}${L("Questa settimana", "This week")}</div>
      <div class="row head"><span class="d30">+640 kg</span><span class="sub">${L("sulla settimana prima, a questo punto", "vs the week before, at this point")}</span></div>
      <div class="stats four"><div><span class="d22">3</span><span class="sub">${L("sessioni", "sessions")}</span></div><div><span class="d22">${L("18,6 t", "18.6 t")}</span><span class="sub">volume</span></div><div><span class="d22">3h 05m</span><span class="sub">${L("tempo", "time")}</span></div><div><span class="d22 red">7</span><span class="sub">${L("record", "PRs")}</span></div></div>
      ${[["16", L("gio", "Thu"), L("Gambe A", "Legs A"), L("58 min, 19 serie", "58 min, 19 sets"), 3], ["14", L("mar", "Tue"), "Pull A", L("62 min, 22 serie", "62 min, 22 sets"), 2]]
        .map(([d, w, n, s, r]) => `<div class="row ses"><div class="day"><span class="d22">${d}</span><span class="sub">${w}</span></div><div class="grow"><div class="nm">${n}</div><div class="sub">${s}, <span class="red">${r} ${L("record", "PRs")}</span></div></div><span class="pl" style="width:28px">${closed()}</span></div>`).join("")}</div>`,
  };
  document.querySelectorAll("[data-art]").forEach((el) => (el.innerHTML = arts[el.dataset.art]()));

  // Lo schermo sta in `.dev`, a misura vera, rimpicciolito dal CSS (vedi .phone in landing.css).
  document.querySelectorAll("[data-screen]").forEach((el) => (el.innerHTML = `<div class="dev">${screens[el.dataset.screen]()}</div>`));
  document.querySelectorAll("[data-mark]").forEach((el) => {
    el.innerHTML = markSVG();
    drawMark(el, still ? 1 : 0, still ? 0.12 : 0);
  });

  // La serie in corso: ogni tocco sulla spunta segna la serie che tocca, il disco dell'esercizio
  // prende un pezzo e sale il foglio del riposo con la serie dopo; a quattro arriva l'esercizio dopo.
  const serie = document.querySelector('[data-screen="serie"]');
  const $ = (s) => serie.querySelector(s);
  function setDone(d) {
    const n = SETS.length;
    $("[data-plate]").innerHTML = plate(n, d);
    $("[data-sets]").innerHTML = SETS.map(([w, r], i) => {
      const state = i < d ? "done" : i === d ? "now" : "next";
      const vals = `<span class="v">${kg(w)}</span><span class="v">${r}</span>`;
      return `<div class="set ${state}"><span class="n">${i + 1}</span><span class="prev">${x(w, r)}</span>${vals}${i < d ? `<span class="ok">${I.check}</span>` : `<span class="ring"></span>`}</div>`;
    }).join("");
    const g = SETS[Math.min(d, n - 1)];
    $("[data-goal]").textContent = x(g[0], g[1] + 1);
    $("[data-gbar]").style.width = `${(d / n) * 100}%`;
    const end = d >= n;
    $("[data-dock-plate]").innerHTML = end ? plate(NEXT_EX[3], 0) : plate(n, d);
    $("[data-dock-val]").textContent = end ? xkg(NEXT_EX[1], NEXT_EX[2]) : xkg(SETS[d][0], SETS[d][1]);
    $("[data-dock-sub]").textContent = end ? L(`${NEXT_EX[0]}, serie 1 di ${NEXT_EX[3]}`, `${NEXT_EX[0]}, set 1 of ${NEXT_EX[3]}`)
      : L(`${SQUAT}, serie ${d + 1} di ${n}`, `${SQUAT}, set ${d + 1} of ${n}`);
    // Il foglio del riposo: la serie che viene dopo e la stessa la volta scorsa.
    const [name, w, r, tot, k] = end ? [NEXT_EX[0], NEXT_EX[1], NEXT_EX[2], NEXT_EX[3], 0] : [SQUAT, SETS[d][0], SETS[d][1], n, d];
    $("[data-rest-plate]").innerHTML = plate(tot, k);
    $("[data-rest-sub]").textContent = L(`Poi ${name}, serie ${k + 1} di ${tot}`, `Then ${name}, set ${k + 1} of ${tot}`);
    $("[data-rest-val]").textContent = xkg(w, r);
    $("[data-rest-last]").textContent = L(`Volta scorsa ${xkg(w, r)}`, `Last time ${xkg(w, r)}`);
  }
  setDone(1);

  // Conti alla rovescia del riposo: tutti insieme, e ricominciano da 2:00.
  const counts = document.querySelectorAll("[data-count]");
  const start = new Map([...counts].map((c) => [c, +c.dataset.count]));
  let tick = 0;
  const showCount = () => {
    counts.forEach((c) => {
      const left = ((start.get(c) - tick) % 121 + 121) % 121;
      c.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
      const bar = c.parentElement.querySelector("[data-bar]");
      if (bar) bar.style.width = `${(left / 120) * 100}%`;
    });
  };
  showCount();

  if (still) return;
  const seen = new Set();
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting && e.target.matches("[data-mark]") && !seen.has(e.target)) { seen.add(e.target); animateMark(e.target); }
    e.target.classList.toggle("visible", e.isIntersecting);
  }), { threshold: 0.35 });
  document.querySelectorAll("[data-mark], [data-screen]").forEach((el) => io.observe(el));

  setInterval(() => { tick++; showCount(); }, 1000);

  // Il giro della serie: spunta, foglio del riposo su, poi giù con la serie dopo nella barra.
  let d = 1;
  const rest = $("[data-rest]");
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  (async function loop() {
    for (;;) {
      await wait(1700);
      if (!serie.classList.contains("visible")) continue;
      const b = $("[data-press]");
      b.classList.add("pressed");
      await wait(180);
      b.classList.remove("pressed");
      setDone(++d);
      rest.classList.add("up");
      await wait(2600);
      rest.classList.remove("up");
      if (d >= SETS.length) { await wait(500); d = 0; setDone(d); }
    }
  })();
})();
