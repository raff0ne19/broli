// Il piè di pagina di tutte le pagine (strada B, 2026-11-03): una fascia di gomma nera anche nel tema
// chiaro, che chiude la pagina. Dentro: la beta su TestFlight (col QR su desktop, perché dal Mac TestFlight
// non si installa), i link a gruppi, lingua e tema, la firma dell'app, e "broli" gigante col disco al posto
// della o. Prima ogni pagina aveva il suo piè di pagina scritto a mano, e a qualcuna mancava un link.
// Lo script sta dove va il piè di pagina e lo scrive lì; senza JavaScript resta il <noscript> della pagina.
(function () {
  var root = document.documentElement, it = root.dataset.lang === "it";
  var here = location.pathname.split("/").pop().replace(".html", "") || "index";
  function L(a, b) { return it ? a : b; }
  function link(href, key, label) {
    return '<a href="' + href + '"' + (here === key ? ' aria-current="page"' : "") + ">" + label + "</a>";
  }
  function themeBtn(key, label) {
    return '<button type="button" data-theme-set="' + key + '">' + label + "</button>";
  }
  document.currentScript.insertAdjacentHTML("beforebegin",
    '<footer class="site-footer"><div class="ft-in">' +
      '<div class="ft-close"><div>' +
        '<h2 class="say">' + L("Broli per iPhone e Apple Watch", "Broli for iPhone and Apple Watch") + "</h2>" +
        "<p>" + L("Gratis su TestFlight, l'app di Apple per le beta. Sull'App Store a gennaio 2027.", "Free on TestFlight, Apple's app for betas. On the App Store in January 2027.") + "</p>" +
        '<a class="cta" href="beta">' + L("Provala su TestFlight", "Try it on TestFlight") + "</a>" +
      "</div>" +
      '<figure class="qr"><span class="tile"><img src="assets/qr-beta.svg" width="112" height="112" alt="' +
        L("QR per installare la beta di Broli su TestFlight", "QR code to install the Broli beta on TestFlight") + '"></span>' +
        "<figcaption>" + L("Inquadra con l'iPhone", "Scan with your iPhone") + "</figcaption></figure></div>" +
      '<div class="ft-links">' +
        "<div><h3>Broli</h3>" + link("storia", "storia", L("Storia", "Story")) + link("support", "support", L("Supporto", "Support")) +
          '<a href="mailto:support@broli.app">support@broli.app</a></div>' +
        "<div><h3>" + L("Legale", "Legal") + "</h3>" + link("privacy", "privacy", "Privacy") + link("terms", "terms", L("Termini", "Terms")) + "</div>" +
        "<div><h3>" + L("Lingua", "Language") + "</h3>" +
          '<a href="?lang=it" lang="it"' + (it ? ' aria-current="true"' : "") + ">Italiano</a>" +
          '<a href="?lang=en" lang="en"' + (it ? "" : ' aria-current="true"') + ">English</a></div>" +
        '<div role="group" aria-label="' + L("Tema", "Theme") + '"><h3>' + L("Tema", "Theme") + "</h3>" +
          themeBtn("system", L("Sistema", "System")) + themeBtn("light", L("Chiaro", "Light")) + themeBtn("dark", L("Scuro", "Dark")) + "</div>" +
      "</div>" +
      '<div class="ft-base"><span>© 2026 Raffaele Esposito. <i>' + L("Scritta e curata da un frontend dev.", "Written and looked after by a frontend dev.") + "</i></span>" +
        (here === "index" ? "<span>" + L("Le schermate sono illustrazioni dell'app.", "Screens are illustrations of the app.") + "</span>" : "") + "</div>" +
      '<span class="wordmark giant" aria-hidden="true">' + window.Plate.logotype() + "</span>" +
    "</div></footer>");

  // Il tema: Sistema toglie la scelta salvata e segue il telefono; l'intestazione resta allineata.
  var buttons = [].slice.call(document.querySelectorAll(".site-footer [data-theme-set]"));
  function mark() {
    var s = null;
    try { s = localStorage.getItem("theme"); } catch (e) {}
    buttons.forEach(function (b) { b.setAttribute("aria-pressed", String((s || "system") === b.dataset.themeSet)); });
  }
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.dataset.themeSet, c = window.BroliTheme.centre(b);
      var next = k === "system" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : k;
      // Lo stesso passaggio animato dell'intestazione, che parte dal bottone toccato.
      window.BroliTheme.set(next, c[0], c[1], k !== "system");
      mark();
    });
  });
  document.addEventListener("broli:theme", mark);
  mark();
})();
