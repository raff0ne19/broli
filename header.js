// L'intestazione di tutte le pagine. Lo script sta in cima al <body> e la scrive al suo posto mentre la
// pagina si carica, prima del primo disegno: non compare in ritardo e non sposta niente.
// Resta in cima, sparisce scorrendo in giù e ricompare tornando su, con "Provala" sempre a portata di
// pollice (strada B, 2026-11-03). Nel racconto della landing resta nascosta: il palco è a tutto schermo.
// Sulla landing, quando ricompare, sotto ha il filo della pagina: un pezzo per sezione, come il filo sopra
// un esercizio (rosso fatto, al 32% in corso, grigio da fare).
(function () {
  var root = document.documentElement, it = root.dataset.lang === "it";
  var here = location.pathname.split("/").pop().replace(".html", "") || "index";
  function link(href, key, label, cls) {
    return '<a class="' + (cls || "") + '" href="' + href + '"' + (here === key ? ' aria-current="page"' : "") + ">" + label + "</a>";
  }
  var sun = '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
  var moon = '<svg class="moon" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z"/></svg>';
  document.currentScript.insertAdjacentHTML("beforebegin",
    '<header class="site-header"><div class="hd-in"><a class="wordmark" href="./" aria-label="Broli">' + window.Plate.logotype() + "</a><nav>" +
    link("storia", "storia", it ? "Storia" : "Story", "wide") +
    link("support", "support", it ? "Supporto" : "Support", "wide") +
    '<a class="wide lang" href="?lang=' + (it ? "en" : "it") + '" lang="' + (it ? "en" : "it") + '" aria-label="' + (it ? "English" : "Italiano") + '">' + (it ? "EN" : "IT") + "</a>" +
    '<button class="theme" type="button" aria-label="' + (it ? "Cambia tema" : "Switch theme") + '">' + sun + moon + "</button>" +
    '<a class="try" href="beta">' + (it ? "Provala" : "Try it") + "</a></nav></div>" +
    '<div class="pfilo" aria-hidden="true"></div></header>');

  var header = document.querySelector(".site-header");
  var meta = document.querySelector('meta[name="theme-color"]');
  function paint() { if (meta) meta.content = root.dataset.theme === "light" ? "#EEEDE8" : "#0D0D0E"; }
  paint();
  header.querySelector(".theme").addEventListener("click", function () {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    paint();
    document.dispatchEvent(new CustomEvent("broli:theme"));
  });
  document.addEventListener("broli:theme", paint);

  // Sparisce scorrendo in giù, ricompare tornando su. Le posizioni si leggono una volta per fotogramma.
  var lastY = scrollY, queued = false, pieces = [], bounds = null;
  var filo = header.querySelector(".pfilo");
  // I pezzi del filo: i tre passi del racconto, poi le sezioni dopo (con un id), fino al piè di pagina.
  // Solo quelli: dentro i disegni dei dischi ci sono altri id.
  function measure() {
    var marks = [].slice.call(document.querySelectorAll(".scrolly .anchor, main > section[id]"));
    if (!marks.length || here !== "index") { bounds = null; filo.innerHTML = ""; return; }
    var foot = document.querySelector(".site-footer");
    bounds = marks.map(function (el) { return el.getBoundingClientRect().top + scrollY; });
    bounds.push(foot ? foot.getBoundingClientRect().top + scrollY : document.documentElement.scrollHeight);
    if (pieces.length !== marks.length) {
      filo.innerHTML = marks.map(function () { return "<i></i>"; }).join("");
      pieces = [].slice.call(filo.children);
    }
  }
  function story() {
    var s = document.querySelector("[data-scrolly].live");
    if (!s) return false;
    var r = s.getBoundingClientRect();
    return r.top <= 1 && r.bottom > innerHeight;
  }
  function update() {
    queued = false;
    var y = scrollY, dy = y - lastY;
    if (y < 80) { header.classList.remove("away", "float"); }
    else if (story()) { header.classList.add("away"); }
    else if (dy > 4) { header.classList.add("away"); }
    else if (dy < -4) { header.classList.remove("away"); header.classList.add("float"); }
    if (Math.abs(dy) > 4 || y < 80) lastY = y;
    if (bounds) {
      var at = y + innerHeight * 0.3;
      pieces.forEach(function (p, i) {
        p.className = at >= bounds[i + 1] ? "d" : at >= bounds[i] ? "n" : "";
      });
    }
  }
  function later() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  addEventListener("scroll", later, { passive: true });
  addEventListener("resize", function () { measure(); later(); });
  addEventListener("load", function () { measure(); later(); });
  document.addEventListener("DOMContentLoaded", function () { measure(); later(); });
})();
