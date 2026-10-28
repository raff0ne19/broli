// Pagina dei link di una scheda (https://broli.app/i#d=…), quando non li apre Broli: sul computer o
// prima di avere l'app. Il pulsante riprova con lo schema dell'app; la scheda resta nel frammento.
(function () {
  var d = location.hash.indexOf("#d=") === 0 ? location.hash.slice(3) : "";
  var open = document.querySelectorAll(".open");
  for (var i = 0; i < open.length; i++) {
    if (d) open[i].href = "broli://import?d=" + d;
    else open[i].hidden = true;
  }
})();
