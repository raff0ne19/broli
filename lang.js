// Lingua: ?lang=it|en (ricordata tra le pagine), altrimenti quella del browser: italiano o, per tutti
// gli altri, inglese.
(function () {
  var q = new URLSearchParams(location.search).get("lang"), saved = null;
  try { if (q === "it" || q === "en") localStorage.setItem("lang", q); saved = localStorage.getItem("lang"); } catch (e) {}
  var lang = q === "it" || q === "en" ? q : saved || ((navigator.language || "").slice(0, 2) === "it" ? "it" : "en");
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang;
})();
