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
      <h4 class="d40 pop" style="--z:60">${L("Disco chiuso", "Plate closed")}</h4><div class="sub">${L("Gambe A, 58 minuti, 5 esercizi su 5", "Legs A, 58 minutes, 5 of 5 exercises")}</div>
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
