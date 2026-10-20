// L'intestazione di tutte le pagine. Lo script sta in cima al <body> e la scrive al suo posto mentre la
// pagina si carica, prima del primo disegno: non compare in ritardo e non sposta niente.
(function () {
  var root = document.documentElement, it = root.dataset.lang === "it";
  var here = location.pathname.split("/").pop().replace(".html", "") || "index";
  function link(href, key, label) {
    return '<a href="' + href + '"' + (here === key ? ' aria-current="page"' : "") + ">" + label + "</a>";
  }
  var sun = '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
  var moon = '<svg class="moon" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z"/></svg>';
  document.currentScript.insertAdjacentHTML("beforebegin",
    '<header class="site-header"><a class="wordmark" href="./" aria-label="Broli">' + window.Plate.logotype() + "</a><nav>" +
    link("privacy", "privacy", "Privacy") +
    link("support", "support", it ? "Supporto" : "Support") +
    '<a href="?lang=' + (it ? "en" : "it") + '">' + (it ? "English" : "Italiano") + "</a>" +
    '<button class="theme" type="button" aria-label="' + (it ? "Cambia tema" : "Switch theme") + '">' + sun + moon + "</button></nav></header>");

  var meta = document.querySelector('meta[name="theme-color"]');
  function paint() { if (meta) meta.content = root.dataset.theme === "light" ? "#EEEDE8" : "#0D0D0E"; }
  paint();
  document.querySelector(".site-header .theme").addEventListener("click", function () {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    paint();
  });
})();
