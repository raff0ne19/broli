// I dischi della linea del tempo: la tappa N ha N pezzi rossi su otto; l'ultima, lo store, ha il
// pezzo che manca in corso. Stessa geometria del marchio (plate.js): pezzi da 0,44 a 1 del raggio,
// fessure a striscia, più strette oltre sei pezzi.
(function () {
  "use strict";
  var INNER = 0.44, R = 46.5, MID = R * (1 + INNER) / 2;
  function gapPieces(n) { return n > 1 ? Math.asin((Math.min(0.06, 0.36 / n) * 100) / 2 / MID) / Math.PI : 0; }
  var uid = 0;
  function disc(total, done, arriving) {
    var gap = gapPieces(total), rid = "tl" + uid++, sid = "ts" + uid++;
    var s = '<svg viewBox="0 0 100 100" aria-hidden="true"><defs>' +
      '<linearGradient id="' + rid + '" gradientUnits="userSpaceOnUse" x1="3.5" y1="3.5" x2="96.5" y2="96.5"><stop offset="0" stop-color="#F23A2F"/><stop offset="1" stop-color="#C01A12"/></linearGradient>' +
      '<linearGradient id="' + sid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D3D5DA"/><stop offset="1" stop-color="#7C7F86"/></linearGradient></defs>';
    for (var i = 0; i < total; i++) {
      var fill = i < done ? "url(#" + rid + ")" : (arriving && i === done) ? "rgba(226,35,26,.32)" : "var(--pl-empty)";
      s += '<path style="fill:' + fill + '" d="' + window.Plate.arc(50, R, i / total + gap / 2, (i + 1) / total - gap / 2, INNER, gap, gap) + '"/>';
    }
    return s + '<circle cx="50" cy="50" r="15" fill="url(#' + sid + ')"/><circle cx="50" cy="50" r="6.5" fill="#0D0D0E"/></svg>';
  }
  document.querySelectorAll("[data-timeline]").forEach(function (ol) {
    var items = ol.querySelectorAll("li"), n = items.length;
    items.forEach(function (li, i) {
      var last = li.classList.contains("next");
      li.insertAdjacentHTML("afterbegin", '<span class="disc">' + disc(n, last ? i : i + 1, last) + "</span>");
    });
  });
})();
