// L'intestazione di tutte le pagine. Lo script sta in cima al <body> e la scrive al suo posto mentre la
// pagina si carica, prima del primo disegno: non compare in ritardo e non sposta niente.
// Resta in cima, sparisce scorrendo in giù e ricompare tornando su, con "Provala" sempre a portata di
// pollice (strada B, 2026-11-03). Nel racconto della landing resta nascosta: il palco è a tutto schermo.
// Sulla landing sotto ha una linea rossa che si allunga mentre scorri la pagina. Era un filo a pezzi, uno
// per sezione e toccabile; l'utente: "non mostriamo le sezioni spezzettate" (2026-11-03), dopo i lampi dei
// pezzi grigi cambiando tema in Chrome.
(function () {
  var root = document.documentElement, it = root.dataset.lang === "it";
  var here = location.pathname.split("/").pop().replace(".html", "") || "index";
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function link(href, key, label, cls) {
    return '<a class="' + (cls || "") + '" href="' + href + '"' + (here === key ? ' aria-current="page"' : "") + ">" + label + "</a>";
  }
  // L'icona del tema: "Classic" di theme-toggles (vendor/theme-toggles), il sole che la luna copre.
  var toggle = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1em" height="1em" fill="currentColor" stroke-linecap="round" class="theme-toggle__classic" viewBox="0 0 32 32">' +
    '<clipPath id="theme-toggle__classic__cutout"><path d="M0-5h30a1 1 0 0 0 9 13v24H0Z"/></clipPath>' +
    '<g clip-path="url(#theme-toggle__classic__cutout)"><circle cx="16" cy="16" r="9.34"/>' +
    '<g stroke="currentColor" stroke-width="1.5"><path d="M16 5.5v-4"/><path d="M16 30.5v-4"/><path d="M1.5 16h4"/><path d="M26.5 16h4"/>' +
    '<path d="m23.4 8.6 2.8-2.8"/><path d="m5.7 26.3 2.9-2.9"/><path d="m5.8 5.8 2.8 2.8"/><path d="m23.4 23.4 2.9 2.9"/></g></g></svg>';
  document.currentScript.insertAdjacentHTML("beforebegin",
    '<header class="site-header"><div class="hd-in"><a class="wordmark" href="./" aria-label="Broli">' + window.Plate.logotype() + "</a><nav>" +
    link("storia", "storia", it ? "Storia" : "Story", "wide") +
    link("support", "support", it ? "Supporto" : "Support", "wide") +
    '<a class="wide lang" href="?lang=' + (it ? "en" : "it") + '" lang="' + (it ? "en" : "it") + '" aria-label="' + (it ? "English" : "Italiano") + '">' + (it ? "EN" : "IT") + "</a>" +
    '<button class="theme theme-toggle" type="button" aria-label="' + (it ? "Cambia tema" : "Switch theme") + '">' + toggle + "</button>" +
    '<a class="try" href="beta">' + (it ? "Provala" : "Try it") + "</a></nav></div>" +
    '<div class="pfilo" aria-hidden="true"><b></b></div></header>');

  var header = document.querySelector(".site-header");
  var button = header.querySelector(".theme");
  var meta = document.querySelector('meta[name="theme-color"]');
  function tint() { if (meta) meta.content = root.dataset.theme === "light" ? "#EEEDE8" : "#0D0D0E"; }
  function paint() {
    tint();
    button.classList.toggle("theme-toggle--toggled", root.dataset.theme === "dark");
  }
  paint();

  // Il cambio di tema: il tema nuovo si apre a cerchio dal punto toccato (View Transitions del browser).
  // Il cerchio è un'animazione CSS (style.css) che parte già chiusa: avviata da JavaScript dopo `ready`,
  // su Safari si vedeva per un fotogramma il tema nuovo intero, un lampo (2026-11-03). Il colore della
  // barra di Safari cambia quando il cerchio è arrivato in cima, non subito.
  // Senza View Transitions, o con Riduci movimento, cambia e basta. `save` false = Sistema, niente scelta.
  function setTheme(next, x, y, save) {
    try { if (save === false) localStorage.removeItem("theme"); else localStorage.setItem("theme", next); } catch (e) {}
    var animated = next !== root.dataset.theme && !still && !!document.startViewTransition;
    function apply() {
      root.dataset.theme = next;
      button.classList.toggle("theme-toggle--toggled", next === "dark");
      if (animated) setTimeout(tint, Math.min(260, 60 + y * 0.6)); else tint();
      document.dispatchEvent(new CustomEvent("broli:theme"));
    }
    if (!animated) return apply();
    root.style.setProperty("--vt-x", x + "px");
    root.style.setProperty("--vt-y", y + "px");
    root.style.setProperty("--vt-r", Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))) + "px");
    document.startViewTransition(apply);
  }
  function centre(el) { var b = el.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }
  window.BroliTheme = { set: setTheme, centre: centre };
  button.addEventListener("click", function () {
    var c = centre(button);
    setTheme(root.dataset.theme === "light" ? "dark" : "light", c[0], c[1]);
  });

  // Sparisce scorrendo in giù, ricompare tornando su. Le posizioni si leggono una volta per fotogramma.
  var lastY = scrollY, queued = false, span = 0;
  var bar = header.querySelector(".pfilo b");
  function measure() {
    if (here !== "index") return;
    header.classList.add("has-filo");
    span = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  }
  // Dentro una sezione col palco fermo (il racconto, il watch) l'intestazione resta nascosta.
  function story() {
    return [].some.call(document.querySelectorAll(".scrolly.live"), function (s) {
      var r = s.getBoundingClientRect();
      return r.top <= 1 && r.bottom > innerHeight;
    });
  }
  function update() {
    queued = false;
    var y = scrollY, dy = y - lastY;
    if (y < 80) { header.classList.remove("away", "float"); }
    else if (story()) { header.classList.add("away"); }
    else if (dy > 4) { header.classList.add("away"); }
    else if (dy < -4) { header.classList.remove("away"); header.classList.add("float"); }
    if (Math.abs(dy) > 4 || y < 80) lastY = y;
    if (span) bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, y / span)).toFixed(4) + ")";
  }
  function later() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  addEventListener("scroll", later, { passive: true });
  addEventListener("resize", function () { measure(); later(); });
  addEventListener("load", function () { measure(); later(); });
  document.addEventListener("DOMContentLoaded", function () { measure(); later(); });
})();
