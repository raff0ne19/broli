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
    trophy: `<svg viewBox="0 0 24 24" class="i"><path d="M7 3h10v5.5a5 5 0 0 1-10 0z" fill="currentColor"/><path d="M7 5.5H4v1A3.5 3.5 0 0 0 7.5 10M17 5.5h3v1A3.5 3.5 0 0 1 16.5 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10.5 13h3v4h-3zM8 18h8v3H8z" fill="currentColor"/></svg>`,
    scope: `<svg viewBox="0 0 24 24" class="i"><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    arrowUp: `<svg viewBox="0 0 24 24" class="i"><path d="M12 19.5V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    equal: `<svg viewBox="0 0 24 24" class="i"><path d="M6 9.5h12M6 14.5h12" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>`,
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
  // La volta scorsa, un poco sotto: la serie 2 è un record di ripetizioni (6 con 85 kg, con 85 o più
  // al massimo 5), la 3 di peso (90 sopra 87,5). La coppa sta sul numero del record (`CompletaSetRow`).
  const PREV = [[80, 8], [82.5, 6], [87.5, 5], [87.5, 5]];
  const RECORD = { 1: 1, 2: 0 };   // serie → 0 kg, 1 reps
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
      <div class="row between"><div class="t34">${L("Schede", "Routines")}</div><span class="round">${I.plus}</span></div>
      <div class="search">${I.search}${L("Cerca tra 5 schede", "Search 5 routines")}</div>
      <div class="lbl">${L("Questa settimana", "This week")}</div>
      <div class="card row"><span class="pl" style="width:46px">${settled(plate(4, 2))}</span><span class="d22">${L("2 allenamenti di 4", "2 of 4 workouts")}</span></div>
      <div class="card next"><div class="sub">${L("Tocca a", "Up next")}</div><div class="d30">${L("Gambe A", "Legs A")}</div>
        <div class="sub sm">${L("5 esercizi, circa 60 minuti. L'ultima volta giovedì.", "5 exercises, about 60 minutes. Last time Thursday.")}</div>
        <div class="btn in">${I.play}${L("Inizia", "Start")}</div></div>
      <div class="lbl">${L("Le tue schede", "Your routines")}</div>
      <div class="card list">${[["Push A", L("6 esercizi, martedì", "6 exercises, Tuesday")], ["Pull A", L("6 esercizi, mercoledì", "6 exercises, Wednesday")]]
        .map(([n, s]) => `<div class="row between li"><div><div class="nm">${n}</div><div class="sub">${s}</div></div><span class="round sm">${I.play}</span></div>`).join("")}</div>
      </div><div class="tabs"><span class="on">${I.lift}</span><span>${I.figure}</span><span>${I.calendar}</span><span>${I.bars}</span><span>${I.person}</span></div>`,

    // Allenamento, vista Lista (2026-11): gli esercizi aperti, quello in corso sul tappeto col filo (un
    // pezzo per serie), il riposo e il mirino accanto al nome; la serie che tocca nella pillola in basso,
    // col suo numero; dopo la spunta sale il foglio del riposo.
    serie: () => `${status()}<div class="pad">
      <div class="row wk"><span class="round">${I.shrink}</span><span class="pl" style="width:34px">${plate(5, 0)}</span>
        <div class="grow"><div class="nm row nmc">${L("Gambe A", "Legs A")}${I.down}</div><div class="sub">24:10</div></div><span class="pill">${L("Termina", "End")}</span></div>
      <div class="mat"><div class="thread" data-thread></div>
        <div class="row between"><div class="d30">${SQUAT}</div><span class="more">${I.more}</span></div>
        <div class="row meta"><span class="sub row">${I.timer}2:00</span><span class="mark" data-goal></span></div>
        <div class="thead"><span>${L("Serie", "Set")}</span><span>${L("Scorsa", "Last")}</span><span>kg</span><span>reps</span><span></span></div>
        <div class="sets" data-sets></div>
        <div class="addset">${I.plus}${L("Aggiungi serie", "Add set")}</div></div>
      <div class="later"><div class="thread">${"<i></i>".repeat(NEXT_EX[3])}</div>
        <div class="row between"><div class="d30">${NEXT_EX[0]}</div><span class="more">${I.more}</span></div>
        <div class="row meta"><span class="sub row">${I.timer}1:30</span><span class="mark">${I.scope}<b>${x(NEXT_EX[1], NEXT_EX[2])}</b></span></div>
        <div class="thead"><span>${L("Serie", "Set")}</span><span>${L("Scorsa", "Last")}</span><span>kg</span><span>reps</span><span></span></div>
        ${[1, 2].map((i) => `<div class="set next"><span class="n">${i}</span><span class="prev">${x(NEXT_EX[1], NEXT_EX[2])}</span><span class="v">${kg(NEXT_EX[1])}</span><span class="v">${NEXT_EX[2]}</span><span class="chk"><i class="ring"></i></span></div>`).join("")}</div>
      </div>
      <div class="dock"><span class="mk" data-dock-n></span><div class="grow"><div class="sub" data-dock-sub></div><div class="d30" data-dock-val></div></div><span class="tick" data-press>${I.check}</span></div>
      <div class="rest" data-rest><div class="grab"></div><div class="rt">${L("Riposo", "Rest")}</div>
        <div class="big" data-rc>2:00</div><div class="rbar"><i data-rbar></i></div><div class="sub">${L("di 2:00", "of 2:00")}</div>
        <div class="row nx"><span class="mk" data-rest-n></span><div class="grow"><div class="sub" data-rest-sub></div><div class="d26" data-rest-val></div><div class="sub" data-rest-last></div></div><span class="mark" data-rest-goal></span></div>
        <div class="row three"><span>−30 s</span><span>+30 s</span><span>${I.skip}${L("Salta", "Skip")}</span></div></div>`,

    blocco: () => `<div class="lock"><div class="sb"><span></span>${I.battery}</div>
      <div class="date">${L("Ven 17 ott", "Fri Oct 17")}</div><div class="clock">18:42</div>
      <div class="la"><div class="row"><span class="pl" style="width:40px">${plate(4, 3)}</span>
        <div class="grow"><div class="sub">${L(`${SQUAT}, poi serie 4`, `${SQUAT}, then set 4`)}</div><div class="d26">${x(90, 5)}</div></div>
        <div class="r"><div class="sub">${L("Riposo", "Rest")}</div><div class="d40" data-rc>2:00</div></div></div>
        <div class="row two"><span>+30 s</span><span>${L("Salta", "Skip")}</span></div></div></div>`,

    // Fine allenamento (2026-11): il disco chiuso, le storie da condividere, il riepilogo coi record e
    // il confronto con la volta scorsa, esercizio per esercizio (la card Confronto).
    fine: () => `${status()}<div class="pad">
      <div class="row hero"><span class="pl" style="width:64px">${closed()}</span>
        <div><div class="d30">${L("Disco chiuso", "Plate closed")}</div><div class="sub">${L("Gambe A, 58 minuti, 5 esercizi su 5", "Legs A, 58 minutes, 5 of 5 exercises")}</div></div></div>
      <div class="stories"><div class="story-card"><b class="wm">broli</b><div class="sn">${L("Gambe A", "Legs A")}</div>
          <div class="ss"><span><b>${L("8.420", "8,420")}</b>kg</span><span><b>19</b>${L("serie", "sets")}</span><span><b>2</b>record</span></div>
          <div class="sl">${[[SQUAT, x(90, 5)], [NEXT_EX[0], x(70, 10)], ["Leg press", x(95, 12)]].map(([n, v]) => `<div class="row between"><span>${n}</span><b>${v}</b></div>`).join("")}</div></div>
        <div class="story-card two"><b class="wm">broli</b><div class="big2">${L("Più di 4", "Over 4")}</div><div class="sn">${L("utilitarie", "small cars")}</div></div></div>
      <div class="sdots"><i class="on"></i><i></i><i></i></div>
      <div class="card"><div class="lbl in">${L("Riepilogo", "Summary")}</div><div class="stats"><div><span class="d26">19</span><span class="sub">${L("serie", "sets")}</span></div><div><span class="d26">${L("8.420", "8,420")}</span><span class="sub">${L("kg sollevati", "kg lifted")}</span></div><div><span class="d26 red">2</span><span class="sub">${L("record", "PRs")}</span></div></div></div>
      <div class="card"><div class="nm">${L("Confronto", "Compare")}</div>
        <div class="row head"><span class="d30">${L("4 su 5", "4 of 5")}</span><span class="sub">${L("esercizi meglio della volta scorsa", "exercises better than last time")}</span></div>
        ${[[I.arrowUp, SQUAT, L("2,5 kg in più", "2.5 kg more"), true], [I.arrowUp, NEXT_EX[0], L("1 rep in più", "1 rep more"), true], [I.equal, "Leg curl", L("come la volta scorsa", "same as last time"), false]]
          .map(([ic, n, t, up]) => `<div class="row between cmp"><span class="row"><span class="ci${up ? " red" : ""}">${ic}</span><span class="nm">${n}</span></span><span class="sub">${t}</span></div>`).join("")}</div>
      </div><div class="acts"><span class="btn sec">${I.share}${L("Condividi", "Share")}</span><span class="btn">${I.check}${L("Fatto", "Done")}</span></div>`,

    watchSerie: () => `<div class="w-time">${I.run}18:44</div><div class="w-pad set-w"><div class="row between w-top"><div><b>${SQUAT}</b><div class="sub">${L("Serie 4 di 4", "Set 4 of 4")}</div></div><span class="round w-more">${I.more}</span></div>
      <div class="row"><span class="pl" style="width:62px">${plate(4, 3, "4")}</span><div class="w-num"><span class="d40">${kg(90)}</span><span class="u">×</span><span class="d30">5</span></div></div>
      <div class="btn w" data-wpress>${I.check}${L("Fatta", "Done")}</div></div><div class="dots"><i></i><i class="on"></i><i></i></div>`,

    watchRiposo: () => `<div class="w-time">${I.run}18:42</div><div class="w-pad"><span class="sub">${L("Riposo", "Rest")}</span>
      <div class="d54" data-rc>2:00</div><div class="bar"><i data-rbar></i></div>
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

  // La copertina: il nome col disco al posto della o, che si riempie come nel benvenuto dell'app. È
  // l'unico momento di marchio in cima (prima c'erano anche un disco grande e il nome in testo).
  document.querySelectorAll("[data-logo]").forEach((el) => {
    el.setAttribute("aria-label", "Broli");
    el.innerHTML = `<span aria-hidden="true">br<span class="o" data-mark>${markSVG()}</span>li</span>`;
  });
  document.querySelectorAll("[data-mark]").forEach((el) => drawMark(el, still ? 1 : 0, still ? 0.12 : 0));

  // Il telefono del racconto, a misura vera dentro `.dev` e rimpicciolito dal CSS: Schede, la serie, la
  // schermata di blocco, il velo e il disco grande di Grow, il riassunto. Accanto il watch, col riposo e
  // la serie 4.
  const story = document.querySelector("[data-story]");
  story.setAttribute("aria-label", L("Schede, la serie che si spunta, il riposo sul watch, il disco chiuso", "Routines, a set being logged, rest on the watch, the plate closed"));
  story.innerHTML = `<div class="dev">${["schede", "serie", "blocco"].map((k) => `<div class="layer" data-layer="${k}">${screens[k]()}</div>`).join("")}
    <div class="veil"></div><div class="layer" data-layer="fine">${screens.fine()}</div><div class="bigplate" data-big></div></div>`;
  const layer = (k) => story.querySelector(`[data-layer="${k}"]`);
  const watch = document.querySelector("[data-story-watch]");
  watch.innerHTML = `<div class="dev"><div class="wl" data-wl="riposo">${screens.watchRiposo()}</div><div class="wl" data-wl="serie">${screens.watchSerie()}</div></div>`;

  // La serie in corso. Le righe si costruiscono una volta e poi cambiano solo le classi: così spunta,
  // filo, coppa e campi hanno le loro transizioni (ricostruendole a ogni spunta erano tagli netti).
  const serie = layer("serie");
  const $ = (s) => serie.querySelector(s);
  $("[data-thread]").innerHTML = SETS.map(() => "<i></i>").join("");
  $("[data-sets]").innerHTML = SETS.map(([w, r], i) => {
    // La coppa appesa accanto al numero del record: il numero resta allineato a quelli delle altre righe.
    const cup = (k) => (RECORD[i] === k ? `<span class="cup">${I.trophy}</span>` : "");
    return `<div class="set"><span class="n">${i + 1}</span><span class="prev">${x(PREV[i][0], PREV[i][1])}</span>` +
      `<span class="v"><span class="num">${kg(w)}${cup(0)}</span></span><span class="v"><span class="num">${r}${cup(1)}</span></span>` +
      `<span class="chk"><i class="ring"></i><span class="ok">${I.check}</span></span></div>`;
  }).join("");
  const rows = [...serie.querySelectorAll(".set")], pieces = [...serie.querySelectorAll("[data-thread] i")];
  const headPlate = serie.querySelector(".wk .pl");
  function setDone(d) {
    const n = SETS.length, end = d >= n;
    rows.forEach((row, i) => { row.classList.toggle("done", i < d); row.classList.toggle("now", i === d); row.classList.toggle("next", i > d); });
    pieces.forEach((p, i) => { p.classList.toggle("done", i < d); p.classList.toggle("now", i === d); });
    // Il disco della seduta in alto: finito lo Squat, il primo dei cinque esercizi diventa rosso.
    headPlate.innerHTML = plate(5, end ? 1 : 0);
    // Il segno accanto al nome: il mirino con la serie che serve, a esercizio finito a parole.
    $("[data-goal]").innerHTML = end ? `<b class="red">${L("2,5 kg", "2.5 kg")}</b><span class="sub">${L("più della volta scorsa", "more than last time")}</span>`
      : `${I.scope}<b>${x(SETS[d][0], SETS[d][1])}</b>`;
    $("[data-dock-n]").textContent = end ? "1" : `${d + 1}`;
    $("[data-dock-val]").textContent = end ? xkg(NEXT_EX[1], NEXT_EX[2]) : xkg(SETS[d][0], SETS[d][1]);
    $("[data-dock-sub]").textContent = end ? NEXT_EX[0] : SQUAT;
    // Il foglio del riposo: la serie che viene dopo, com'era la volta scorsa e il mirino.
    const [name, w, r, k, pw, pr] = end ? [NEXT_EX[0], NEXT_EX[1], NEXT_EX[2], 0, NEXT_EX[1], NEXT_EX[2]]
      : [SQUAT, SETS[d][0], SETS[d][1], d, PREV[d][0], PREV[d][1]];
    $("[data-rest-n]").textContent = `${k + 1}`;
    $("[data-rest-sub]").textContent = name;
    $("[data-rest-val]").textContent = xkg(w, r);
    $("[data-rest-last]").textContent = L(`Scorsa ${x(pw, pr)}`, `Last ${x(pw, pr)}`);
    $("[data-rest-goal]").innerHTML = `${I.scope}<b>${x(w, r)}</b>`;
  }

  // Al polso: la sezione del watch, col meccanismo del racconto (l'utente, 2026-11-03: "una sezione dedicata
  // al watch, con meccanismi simili a quelli delle animazioni del phone"). Le schermate sono quelle dell'app
  // (BroliWatch): "Tocca a" con Inizia, la serie con Fatta, il peso con la corona, il riposo, "Riposo
  // finito", "Allenamento finito" con calorie e battito medio.
  const flame = `<svg viewBox="0 0 24 24" class="i"><path d="M12.6 2.5c.4 3-1.6 4.6-3 6.3C8.3 10.4 7 12 7 14.6A5 5 0 0 0 12 19.5a5 5 0 0 0 5-4.9c0-2.4-1.3-3.6-2.2-4.9-.3 1.6-1 2.6-2 3 .7-3.1-.1-6.9-.2-10.2z" fill="currentColor"/></svg>`;
  const heart = `<svg viewBox="0 0 24 24" class="i"><path d="M12 20.2s-7.6-4.6-8.9-9.3C2.2 7.5 4.4 4.6 7.6 4.6c1.9 0 3.4 1.1 4.4 2.6 1-1.5 2.5-2.6 4.4-2.6 3.2 0 5.4 2.9 4.5 6.3-1.3 4.7-8.9 9.3-8.9 9.3z" fill="currentColor"/></svg>`;
  const bell = `<svg viewBox="0 0 24 24" class="i"><path d="M12 3a6 6 0 0 0-6 6v4.2L4.3 16.5a.9.9 0 0 0 .8 1.3h13.8a.9.9 0 0 0 .8-1.3L18 13.2V9a6 6 0 0 0-6-6zM9.8 19.5a2.3 2.3 0 0 0 4.4 0z" fill="currentColor"/></svg>`;
  const wscreens = {
    list: () => `<div class="w-time">18:40</div><div class="w-pad"><div class="w-card"><div class="sub">${L("Tocca a", "Up next")}</div>
      <b class="w-name">${L("Gambe A", "Legs A")}</b><div class="sub">${L("5 esercizi", "5 exercises")}</div>
      <div class="btn w" data-w-start>${I.play}${L("Inizia", "Start")}</div></div>
      <div class="w-row"><b>Push A</b><span class="sub">${L("6 esercizi", "6 exercises")}</span></div></div>`,
    set: () => `<div class="w-time">${I.run}18:42</div><div class="w-pad set-w"><div class="row between w-top"><div><b>${SQUAT}</b><div class="sub">${L("Serie 1 di 4", "Set 1 of 4")}</div></div><span class="round w-more">${I.more}</span></div>
      <div class="row"><span class="pl" style="width:62px" data-w-plate></span><div class="w-num"><span class="d40" data-w-kg>${kg(80)}</span><span class="u">×</span><span class="d30">8</span></div></div>
      <div class="btn w" data-w-done>${I.check}${L("Fatta", "Done")}</div></div><div class="dots"><i></i><i class="on"></i><i></i></div>`,
    crown: () => `<div class="w-time">${I.run}18:42</div><div class="w-pad w-edit"><div class="sub">${L("kg, ruota la corona", "kg, turn the crown")}</div>
      <div class="w-big" data-w-crownval>${kg(80)}</div><div class="sub">${L("Scorsa", "Last")} ${x(80, 8)}</div></div>`,
    rest: () => `<div class="w-time">${I.run}18:43</div><div class="w-pad"><span class="sub">${L("Riposo", "Rest")}</span>
      <div class="d54" data-w-rc>2:00</div><div class="bar"><i data-w-rbar></i></div>
      <div class="row small"><span class="pl" style="width:22px">${plate(4, 1)}</span><span class="sub">${L("Poi", "Next")}</span><b class="d20">${x(85, 8)}</b></div>
      <div class="row between"><span class="round w">${I.back30}</span><span class="round w">${I.skip}</span></div></div>`,
    bell: () => `<div class="w-time">${I.run}18:45</div><div class="w-pad w-center"><span class="w-bell">${bell}</span><b>${L("Riposo finito", "Rest over")}</b>
      <div class="sub">${L("Serie 2", "Set 2")}: ${x(85, 8)}</div></div>`,
    // La fine: il disco chiuso grande al centro (il premio), il nome, poi calorie e battito medio con le
    // loro icone; i numeri salgono da zero quando la schermata arriva.
    end: () => `<div class="w-time">19:38</div><div class="w-pad w-end"><span class="pl w-endplate" data-w-closed>${closed()}</span>
      <b>${L("Allenamento finito", "Workout done")}</b><div class="sub">${L("Gambe A, 58 min", "Legs A, 58 min")}</div>
      <div class="w-endstats"><span><span class="w-ic">${flame}</span><b class="d26" data-w-count="412">412</b><small>kcal</small></span>
      <span><span class="w-ic">${heart}</span><b class="d26" data-w-count="128">128</b><small>bpm</small></span></div></div>`,
  };

  function polso() {
    const sec = document.querySelector("[data-wrist]");
    if (!sec) return;
    const stage = sec.querySelector(".stage"), steps = [...sec.querySelectorAll(".step")];
    const go = [...sec.querySelectorAll("[data-go]")], devices = sec.querySelector(".devices");
    const w = sec.querySelector("[data-wrist-watch]");
    w.innerHTML = `<div class="dev">${Object.keys(wscreens).map((k) => `<div class="wl" data-wl="${k}">${wscreens[k]()}</div>`).join("")}</div>` +
      `<span class="crown" aria-hidden="true"></span><span class="side" aria-hidden="true"></span>`;
    const lay = (k) => w.querySelector(`[data-wl="${k}"]`);
    const startBtn = w.querySelector("[data-w-start]"), doneBtn = w.querySelector("[data-w-done]");
    const plateEl = w.querySelector("[data-w-plate]"), kgEl = w.querySelector("[data-w-kg]"), crownVal = w.querySelector("[data-w-crownval]");
    const rc = w.querySelector("[data-w-rc]"), rbar = w.querySelector("[data-w-rbar]"), crown = w.querySelector(".crown");
    const closedPlate = w.querySelector("[data-w-closed]");
    // I momenti: 0 la scheda · 1 Inizia, si apre la serie · 2 la corona (il peso segue lo scorrimento) ·
    // 3 Fatta, il pezzo diventa rosso · 4 il riposo (il conto segue lo scorrimento) · 5 Riposo finito, il
    // watch vibra · 6 Allenamento finito.
    const T = [0, 0.1, 0.22, 0.38, 0.47, 0.66, 0.8];
    const CROWN = [0.24, 0.34], REST = [0.48, 0.64], GO = [0, T[2] + 0.01, T[4] + 0.01, T[6] + 0.01];
    const NARROW = "(max-width: 860px) and (orientation: portrait)";
    const clamp = (v) => Math.min(1, Math.max(0, v));
    const screenOf = (k) => ["list", "set", "crown", "set", "rest", "bell", "end"][k];
    const stepOf = (k) => (k <= 1 ? 0 : k <= 3 ? 1 : k <= 5 ? 2 : 3);
    sec.classList.add("live");
    let s = -1, queued = false, top = 0, total = 1, fitW = 0, fitH = 0, shownKg = -1, shownLeft = -1, timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const tap = (el, ms = 200) => { el.classList.add("pressed"); later(() => el.classList.remove("pressed"), ms); };
    const jump = () => { devices.classList.add("jump"); requestAnimationFrame(() => requestAnimationFrame(() => devices.classList.remove("jump"))); };

    // Il watch grande quanto lo schermo lascia, in altezza e in larghezza (la corona sporge a destra).
    function fit() {
      const vw = innerWidth, h = stage.clientHeight;
      if (vw !== fitW || h < fitH) {   // come nel racconto: non cresce quando Instagram allunga la pagina
        fitW = vw; fitH = h;
        const narrow = matchMedia(NARROW).matches;
        const roomH = h - (narrow ? sec.querySelector(".steps").offsetHeight + 56 : 80);
        const roomW = narrow ? vw - 96 : 520;
        w.style.setProperty("--z", Math.max(0.9, Math.min(2.1, roomH / 262, roomW / 218)).toFixed(3));
        const d = w.querySelector(".dev").getBoundingClientRect(), b = startBtn.getBoundingClientRect();
        lay("set").style.transformOrigin = `${((b.left + b.width / 2 - d.left) / d.width) * 100}% ${((b.top + b.height / 2 - d.top) / d.height) * 100}%`;
      }
      top = sec.getBoundingClientRect().top + scrollY;
      total = Math.max(1, sec.offsetHeight - stage.offsetHeight);
    }

    function apply(next, prev) {
      const instant = still || prev < 0 || Math.abs(next - prev) > 1;
      timers.forEach(clearTimeout); timers = [];
      if (instant) jump();
      const show = (k) => w.querySelectorAll(".wl").forEach((el) => el.classList.toggle("on", el.dataset.wl === k));
      // Inizia: prima il tocco, poi la serie si apre dal bottone.
      if (!instant && next === 1 && prev === 0) { tap(startBtn); later(() => show("set"), 160); }
      else show(screenOf(next));
      // Il disco della serie: un pezzo rosso dopo Fatta. Il peso: 85 dopo la corona.
      plateEl.innerHTML = plate(4, next >= 3 ? 1 : 0, "1");
      if (next !== 2) { const v = next >= 3 ? 85 : 80; kgEl.textContent = kg(v); }
      if (!instant && next === 3 && prev === 2) { tap(doneBtn, 240); }
      if (!instant && next === 5 && prev === 4) { devices.classList.add("bell"); later(() => devices.classList.remove("bell"), 1400); }
      closedPlate.classList.toggle("closing", next === 6 && !instant);
      if (next === 6 && !instant) countUp();
      const step = stepOf(next);
      steps.forEach((el, i) => { el.classList.toggle("on", i === step); el.classList.toggle("past", i < step); });
      go.forEach((g, i) => { g.classList.toggle("done", i < step); g.classList.toggle("now", i === step); });
    }

    // Calorie e battito salgono da zero in 0,9 s, frenando alla fine.
    function countUp() {
      const els = [...w.querySelectorAll("[data-w-count]")], t0 = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - t, 3);
        els.forEach((el) => (el.textContent = Math.round(+el.dataset.wCount * e)));
        if (t < 1 && s === 6) requestAnimationFrame(step);
        else els.forEach((el) => (el.textContent = el.dataset.wCount));
      };
      requestAnimationFrame(step);
    }

    function render() {
      queued = false;
      const p = clamp((scrollY - top) / total);
      let n = Math.max(s, 0);
      while (n + 1 < T.length && p >= T[n + 1]) n++;
      while (n > 0 && p < T[n] - 0.012) n--;
      if (n !== s) { const prev = s; s = n; apply(n, prev); }
      // La corona gira con lo scorrimento e il peso sale da 80 a 85, a passi di 2,5.
      const c = clamp((p - CROWN[0]) / (CROWN[1] - CROWN[0])), v = 80 + Math.round(c * 2) * 2.5;
      crown.style.backgroundPositionY = `${(p * 900).toFixed(1)}px`;
      if (v !== shownKg) { shownKg = v; crownVal.textContent = kg(v); if (s === 2) kgEl.textContent = kg(v); }
      const left = Math.round(120 * (1 - clamp((p - REST[0]) / (REST[1] - REST[0]))));
      if (left !== shownLeft) {
        shownLeft = left;
        rc.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
        rbar.style.transform = `scaleX(${(left / 120).toFixed(3)})`;
      }
    }
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(render); } };
    go.forEach((g, i) => g.addEventListener("click", (e) => {
      e.preventDefault();
      scrollTo({ top: top + total * GO[i], behavior: still ? "auto" : "smooth" });
    }));
    fit();
    render();
    requestAnimationFrame(() => requestAnimationFrame(() => sec.classList.add("ready")));
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", () => { fit(); onScroll(); });
    document.fonts?.ready.then(() => { fit(); onScroll(); });
    addEventListener("load", () => { fit(); onScroll(); });
  }

  // Il racconto Lift, Log, Grow. Lo scorrimento della sezione (0 in cima, 1 in fondo) decide in che
  // momento si è; ogni passaggio è un'animazione vera di mezzo secondo, non segue il dito: fermandosi a
  // metà non resta mai una schermata a metà. Solo il conto del riposo segue lo scorrimento (scorrere è il
  // tempo che passa). I momenti, alle soglie di T:
  //  0 Schede · 1 Inizia: si apre l'allenamento · 2, 3, 4 le prime tre spunte · 5 sale il riposo (il testo
  //  passa al riposo) · 6 il telefono si blocca e il watch entra col conto · 7 la campana: il watch mostra la
  //  serie 4 · 8 "Fatta" dal polso spunta la serie 4 · 9 Grow: il disco grande si chiude e va nel riassunto.
  // Tornando su si torna indietro; saltando più momenti insieme (o con Riduci movimento) niente animazioni.
  function racconto() {
    const sec = document.querySelector("[data-scrolly]");
    const stage = sec.querySelector(".stage"), steps = [...sec.querySelectorAll(".step")], logStep = steps[1];
    const go = [...sec.querySelectorAll("[data-go]")], devices = sec.querySelector(".devices");
    const startBtn = layer("schede").querySelector(".btn.in"), press = $("[data-press]"), restSheet = $("[data-rest]");
    const fine = layer("fine"), heroPlate = fine.querySelector(".hero .pl"), big = story.querySelector("[data-big]");
    const wPress = watch.querySelector("[data-wpress]");
    const rcs = [...devices.querySelectorAll("[data-rc]")], bars = [...devices.querySelectorAll("[data-rbar]")];
    const T = [0, 0.1, 0.18, 0.25, 0.32, 0.4, 0.47, 0.62, 0.68, 0.78];
    const REST = [0.4, 0.62];   // il conto da 2:00 a 0:00
    const GO = [0, T[2] + 0.01, T[9] + 0.01];   // dove porta il filo toccato
    const NARROW = "(max-width: 860px) and (orientation: portrait)";
    const clamp = (v) => Math.min(1, Math.max(0, v));
    sec.classList.add("live");
    let s = -1, queued = false, top = 0, total = 1, fitW = 0, fitH = 0, shownLeft = -1, timers = [];

    // La misura del telefono (alto quanto lo schermo lascia, mai più di 0,8) e la posizione della sezione:
    // si calcolano qui, non a ogni fotogramma. Solo se cambia la larghezza o se il palco si abbassa: il
    // browser di Instagram allunga la pagina quando scorrendo nasconde le sue barre, e ricalcolando a ogni
    // allungamento telefono e watch crescevano sotto il dito (2026-11-05). Sugli schermi bassi (il browser
    // di Instagram, il telefono di traverso) il testo si accorcia alle prime righe invece di tagliare il palco.
    // shortcut: su desktop una finestra solo più alta non ingrandisce il telefono; se serve, ricalcolare a scorrimento fermo.
    function fit() {
      const w = innerWidth, h = stage.clientHeight;
      if (w !== fitW || h < fitH) {
        fitW = w; fitH = h;
        const narrow = matchMedia(NARROW).matches, stepsH = () => sec.querySelector(".steps").offsetHeight;
        sec.classList.remove("compact");
        // Il testo si misura col telefono al minimo: a misura piena il telefono allargava la colonna, il testo
        // andava meno a capo e il telefono usciva più grande dello spazio che resta.
        story.style.setProperty("--z", 0.34);
        let room = h - (narrow ? stepsH() + 48 : 64);
        if (narrow && room / 868 < 0.5) { sec.classList.add("compact"); room = h - (stepsH() + 40); }
        const z = Math.max(0.34, Math.min(0.8, room / 868));
        story.style.setProperty("--z", z.toFixed(3));
        watch.style.setProperty("--z", (z * 1.05).toFixed(3));
        // Lo zoom dell'allenamento parte dal centro del bottone Inizia.
        const d = story.querySelector(".dev").getBoundingClientRect(), b = startBtn.getBoundingClientRect();
        serie.style.transformOrigin = `${((b.left + b.width / 2 - d.left) / d.width) * 100}% ${((b.top + b.height / 2 - d.top) / d.height) * 100}%`;
      }
      top = sec.getBoundingClientRect().top + scrollY;
      total = Math.max(1, sec.offsetHeight - stage.offsetHeight);
    }

    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const tap = (el, ms = 180) => { el.classList.add("pressed"); later(() => el.classList.remove("pressed"), ms); };
    // Per un fotogramma niente transizioni: le classi cambiano tutte insieme e la scena salta lì.
    const jump = () => { devices.classList.add("jump"); requestAnimationFrame(() => requestAnimationFrame(() => devices.classList.remove("jump"))); };
    const ticksAt = (k) => (k <= 1 ? 0 : k <= 4 ? k - 1 : k <= 7 ? 3 : 4);

    function apply(next, prev) {
      const instant = still || prev < 0 || Math.abs(next - prev) > 1;
      timers.forEach(clearTimeout); timers = [];
      if (instant) jump();
      const set = (c, on) => devices.classList.toggle(c, on);
      // Inizia: prima il tocco sul bottone, poi l'allenamento si apre da lì.
      if (!instant && next === 1 && prev === 0) { set("s-work", false); tap(startBtn); later(() => set("s-work", true), 160); }
      else set("s-work", next >= 1);
      restSheet.classList.toggle("up", next >= 5 && next <= 7);
      set("s-lock", next === 6 || next === 7);
      set("s-watch", next >= 6 && next <= 8);
      set("s-wserie", next >= 7);
      const before = prev < 0 ? 0 : ticksAt(prev), now = ticksAt(next);
      setDone(now);
      if (!instant && now > before && next <= 4) tap(press);
      // La campana di fine riposo: il watch vibra e un anello rosso si allarga.
      if (!instant && next === 7 && prev === 6) { set("bell", true); later(() => set("bell", false), 1400); }
      if (!instant && next === 8 && prev === 7) tap(wPress, 220);
      // Il testo: Lift, Log (la serie, poi il riposo), Grow.
      const step = next <= 1 ? 0 : next <= 8 ? 1 : 2;
      steps.forEach((el, i) => { el.classList.toggle("on", i === step); el.classList.toggle("past", i < step); });
      go.forEach((g, i) => { g.classList.toggle("done", i < step); g.classList.toggle("now", i === step); });
      logStep.classList.toggle("resting", next >= 5 && next <= 8);
      if (next >= 9) grow(instant || prev !== 8); else ungrow();
    }

    // Grow: il velo, il disco grande che si riempie pezzo per pezzo e si chiude, poi sale il riassunto e il
    // disco vola al suo posto accanto a "Disco chiuso".
    function grow(instant) {
      devices.classList.remove("landed");
      big.style.transform = ""; big.style.opacity = "";
      if (instant) { devices.classList.add("s-sheet", "landed"); devices.classList.remove("s-grow"); return; }
      big.classList.remove("closing");
      big.innerHTML = plate(5, 1);
      devices.classList.add("s-grow");
      let k = 1;
      const fill = () => {
        k++;
        if (k < 5) { big.innerHTML = plate(5, k); later(fill, 110); return; }
        big.innerHTML = closed();
        big.classList.add("closing");
        later(fly, 520);
      };
      later(fill, 260);
      function fly() {
        let el = heroPlate, hx = 0, hy = 0;
        while (el && el !== fine && el !== story) { hx += el.offsetLeft; hy += el.offsetTop; el = el.offsetParent; }
        const bx = big.offsetLeft + big.offsetWidth / 2, by = big.offsetTop + big.offsetHeight / 2;
        const dx = hx + heroPlate.offsetWidth / 2 - bx, dy = hy + heroPlate.offsetHeight / 2 - by;
        big.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${(heroPlate.offsetWidth / big.offsetWidth).toFixed(3)})`;
        devices.classList.add("s-sheet");
        later(() => { devices.classList.add("landed"); big.style.opacity = "0"; }, 560);
      }
    }
    function ungrow() {
      devices.classList.remove("s-grow", "s-sheet", "landed");
      big.classList.remove("closing");
      big.style.transform = ""; big.style.opacity = "";
    }

    function render() {
      queued = false;
      const p = clamp((scrollY - top) / total);
      let n = Math.max(s, 0);
      while (n + 1 < T.length && p >= T[n + 1]) n++;
      while (n > 0 && p < T[n] - 0.012) n--;   // un poco di margine tornando su: niente avanti e indietro
      if (n !== s) { const prev = s; s = n; apply(n, prev); }
      const left = Math.round(120 * (1 - clamp((p - REST[0]) / (REST[1] - REST[0]))));
      if (left !== shownLeft) {
        shownLeft = left;
        const txt = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
        rcs.forEach((e) => (e.textContent = txt));
        bars.forEach((b) => (b.style.transform = `scaleX(${(left / 120).toFixed(3)})`));
      }
    }
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(render); } };

    // Il filo toccato porta all'inizio del passo.
    go.forEach((g, i) => g.addEventListener("click", (e) => {
      e.preventDefault();
      scrollTo({ top: top + total * GO[i], behavior: still ? "auto" : "smooth" });
    }));

    fit();
    render();
    requestAnimationFrame(() => requestAnimationFrame(() => sec.classList.add("ready")));
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", () => { fit(); onScroll(); });
    document.fonts?.ready.then(() => { fit(); onScroll(); });
    // Immagini e caratteri caricati possono spostare la sezione: si ricalcola dove comincia.
    addEventListener("load", () => { fit(); onScroll(); });
  }

  racconto();
  polso();

  // Il disco della copertina si disegna quando arriva a vista.
  if (still) return;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { io.unobserve(e.target); animateMark(e.target); }
  }), { threshold: 0.35 });
  document.querySelectorAll("[data-mark]").forEach((el) => io.observe(el));
})();
