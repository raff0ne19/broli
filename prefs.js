// Lingua e tema, prima che la pagina si disegni (sta nel <head>): così niente lampi.
// Lingua: ?lang=it|en (ricordata tra le pagine), altrimenti quella del browser: italiano o, per tutti
// gli altri, inglese. Tema: quello scelto col bottone nell'intestazione, altrimenti quello del sistema.
(function () {
  var root = document.documentElement, q = new URLSearchParams(location.search).get("lang"), saved = null, theme = null;
  try {
    if (q === "it" || q === "en") localStorage.setItem("lang", q);
    saved = localStorage.getItem("lang");
    theme = localStorage.getItem("theme");
  } catch (e) {}
  var lang = q === "it" || q === "en" ? q : saved || ((navigator.language || "").slice(0, 2) === "it" ? "it" : "en");
  root.dataset.lang = lang;
  root.lang = lang;
  // Titolo e descrizione in italiano nell'HTML, l'inglese in data-en: Google legge quelli della pagina disegnata.
  if (lang === "en") {
    var t = document.querySelector("title[data-en]"), d = document.querySelector('meta[name="description"][data-en]');
    if (t) document.title = t.getAttribute("data-en");
    if (d) d.setAttribute("content", d.getAttribute("data-en"));
  }
  // Canonical scritto qui e non nell'HTML: uno fisso fonderebbe le due lingue. Sempre su broli.app (anche da
  // www e pages.dev) e senza parametri tranne ?lang (via fbclid e utm dei link di Instagram). Non sulle noindex.
  if (!document.querySelector('meta[name="robots"][content*="noindex"]')) {
    var c = document.createElement("link");
    c.rel = "canonical";
    c.href = "https://broli.app" + location.pathname.replace(/\.html$/, "").replace(/\/index$/, "/") + (q === "it" || q === "en" ? "?lang=" + q : "");
    document.head.appendChild(c);
  }
  root.dataset.theme = theme === "light" || theme === "dark" ? theme : matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
})();
