var drinkUsers;
const ALCOHOL_PER_BEER = 13;
const ALCOHOL_PER_LONGDRINK = 9.5;
const MALE_GENDER_CONSTANT = 0.68;
const FEMALE_GENDER_CONSTANT = 0.55;

$(document).ready(function() {
  getBeers(10000);
});

function getBeers(refreshDuration) {

  $.get("/users", function(data) {

    drinkUsers = data;

    $.get("/drinks", function(data) {

      var currentDate = new Date();
      var drinks = data;
      var viewString = "";
      var drinkCountBeer = 0;
      var drinkCountLong = 0;

      // Build view
      for (var i = 0; i < drinkUsers.length; i++) {

        var user = drinkUsers[i];
        drinkCountBeer = 0;
        drinkCountLong = 0;

        viewString += "<p>" + user.nickname + ": ";

        for (var j = 0; j < drinks.length; j++) {

          var drink = drinks[j];
          if (drink.userid == user.id) {
            if (drink.type == 0) {
              viewString += "<i class=\"fa fa-beer\"></i>";
              drinkCountBeer++;
            }
            else {
              viewString += "<i class=\"fa fa-glass\"></i>";
              drinkCountLong++;
            }
          }
        }

        viewString += " (" + (Math.round(0.33 * drinkCountBeer * 10) / 10) + "l <i class=\"fa fa-beer\"></i> + "
          + (Math.round(0.2 * drinkCountLong * 10) / 10) + "l <i class=\"fa fa-glass\"></i> @ "
          + (Math.round(calculateBac(user, getDrinksOfUser(user, drinks)) * 100) / 100) + "&permil;)</p>"; // 0.33/0.2 because an average beer/longdrink has 0.33l/0.2l
      }

      $("#result").html(viewString);
      $("#lastUpdate").html('last update: ' + currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString());
    })
    .fail(function(){
      setTimeout(function(){ getBeers(refreshDuration) }, refreshDuration);
    });
  });

  setTimeout(function(){ getBeers(refreshDuration) }, refreshDuration);
}

function getDrinksOfUser(user, allDrinks) {
  var drinksOfUser = [];
  for (var i = 0; i < allDrinks.length; i++) {
    var drink = allDrinks[i];
    if (drink.userid == user.id) {
      drinksOfUser.push(drink);
    }
  }
  return drinksOfUser;
}

function calculateBac(user, drinksOfUser) {

  var dateNow = new Date();
  var bacSum = 0;
  var genderValue;

  if (user.gender === 0) {
    genderValue = MALE_GENDER_CONSTANT;
  }
  else {
    genderValue = FEMALE_GENDER_CONSTANT;
  }

  for (var i = 0; i < drinksOfUser.length; i++) {
    var drink = drinksOfUser[i];
    var alcoholAmount;

    var splittedDate = drink.drinkdate.split(/[^0-9]/);
    var dateOfDrink = new Date(splittedDate[0],splittedDate[1]-1,splittedDate[2],splittedDate[3],splittedDate[4],splittedDate[5]);
    var timeDifference = Math.abs(dateNow - dateOfDrink) / (60 * 60 * 1000);

    if (drink.type === 0) {
      alcoholAmount = ALCOHOL_PER_BEER;
    }
    else {
      alcoholAmount = ALCOHOL_PER_LONGDRINK;
    }

    var bacOfDrink = (alcoholAmount / (user.weight * genderValue)) * 100;
    var impact = timeDifference * 2 > 1 ? 1 : timeDifference * 2; // A value between 0 and 1
    var bacOfDrinkAfterPeriod = (bacOfDrink - (timeDifference * 0.015)) * impact;
    
    if (bacOfDrinkAfterPeriod <= 0)
      bacOfDrinkAfterPeriod = 0;
    bacSum += bacOfDrinkAfterPeriod;
  }
  return bacSum * 10;
}
