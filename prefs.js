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
  root.dataset.theme = theme === "light" || theme === "dark" ? theme : matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
})();
