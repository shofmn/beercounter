$(document).ready(function() {
  getBeers(10000);
});

function getBeers(refreshDuration) {
  $.get("/beers", function(data) {

    var beerUsers = new Array();
    var currentDate = new Date();

    // Extract response
    for (var i=0; i<data.length; i++) {
      if (Number(beerUsers[data[i].user]) !== beerUsers[data[i].user])
        beerUsers[data[i].user] = 1;
      else
        beerUsers[data[i].user]++;
    }

    var viewString = "";
    var beerCount = 0;

    // Build view
    for (var user in beerUsers) {
      if (beerUsers.hasOwnProperty(user)) {

        var amountOfBeer = 0;
        viewString += "<p>" + user + ": ";
        for (var i=0; i<beerUsers[user]; i++) {
          viewString += "<i class=\"fa fa-beer\"></i>";
          beerCount++;
          amountOfBeer += 0.3;
        }
        viewString += " (" + (Math.round(amountOfBeer * 10) / 10) + "l)</p>"
      }
    }

    $("#result").html(viewString);
    //$("#remainingFuel").html('Remaining fuel: ' + (Math.round((12 - 0.3 * beerCount) * 10) / 10) + 'l');
    $("#lastUpdate").html('last update: ' + currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString());
  })
  .fail(function(){
    setTimeout(function(){ getBeers(refreshDuration) }, refreshDuration);
  });

  setTimeout(function(){ getBeers(refreshDuration) }, refreshDuration);
}
