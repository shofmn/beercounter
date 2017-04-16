Date.prototype.addHours = function(h) {
   this.setTime(this.getTime() + (h*60*60*1000));
   return this;
}

// Support up to 6 colors
var colorOptions = new Array();
colorOptions.push("rgba(17,117,204");
colorOptions.push("rgba(204,16,65");
colorOptions.push("rgba(204,138,11");
colorOptions.push("rgba(136,204,21");
colorOptions.push("rgba(21,204,132");
colorOptions.push("rgba(147,24,204");

var oldData = new Array();
var userData;

$(document).ready(function() {
  getDataAndDrawChart(10000);
});

function resetDatesToHourGranularity(response) {
  for (var i=0; i<response.length; i++) {
    var obj = response[i];
    var splittedDate = obj.drinkdate.split(/[^0-9]/);
    response[i].drinkdate = new Date(splittedDate[0],splittedDate[1]-1,splittedDate[2],splittedDate[3]);
  }
  return response;
}

function findOldestDate(response) {
  var dates=[];
  for (var i=0; i<response.length; i++) {
    dates.push(response[i].drinkdate);
  }
  return new Date(Math.min.apply(null,dates));
}

function generateDateRange(startDate, endDate) {
  var dates=[];
  var timeDifferenceInHours = Math.abs(endDate - startDate) / (60*60*1000);
  console.log("TimeDiffInHours: " + timeDifferenceInHours);

  for (var i=0; i<=timeDifferenceInHours; i++) {
    var newDate = new Date(startDate.valueOf());
    newDate.addHours(i);
    dates.push(newDate);
  }
  return dates;
}

function generateDataSet(dateRange, users, data) {
  var dataSet = new Object();
  dataSet.labels = dateRange;
  dataSet.datasets = new Array();

  for (var i=0; i<users.length; i++) {
    // One time for beer, one time for longdrink

    // BEER
    var dataPoint = new Object();
    dataPoint.label = users[i].nickname + " Beers";
    dataPoint.fillColor = colorOptions[i] + ",0.2)";
    dataPoint.backgroundColor = colorOptions[i] + ",0.0)";
    dataPoint.borderColor = colorOptions[i] + ",1)";
    dataPoint.strokeColor = colorOptions[i] + ",1)";
    dataPoint.pointColor = colorOptions[i] + ",1)";
    dataPoint.pointStrokeColor = "#fff";
    dataPoint.pointHighlightFill = "#fff";
    dataPoint.pointHighlightStroke = colorOptions[i] + ",1)";
    dataPoint.cubicInterpolationMode = "monotone";
    dataPoint.data = new Array();

    var beerCounter = 0;

    for (var j=0; j<dateRange.length; j++) {
      for (var k=0; k<data.length; k++) {
        if (data[k].drinkdate.getTime() === dateRange[j].getTime() && data[k].userid == users[i].id) {
          if (data[k].type === '0') {
            beerCounter++;
            console.log("HIT IT");
          }
        }
      }
      dataPoint.data.push(beerCounter);
    }
    dataSet.datasets.push(dataPoint);

    // LONGDRINK
    var dataPoint2 = new Object();
    dataPoint2.label = users[i].nickname + " Longdrinks";
    dataPoint2.fillColor = colorOptions[i] + ",0.2)";
    dataPoint2.backgroundColor = colorOptions[i] + ",0.0)";
    dataPoint2.borderColor = colorOptions[i] + ",0.5)";
    dataPoint2.strokeColor = colorOptions[i] + ",1)";
    dataPoint2.pointColor = colorOptions[i] + ",1)";
    dataPoint2.pointStrokeColor = "#fff";
    dataPoint2.pointHighlightFill = "#fff";
    dataPoint2.pointHighlightStroke = colorOptions[i] + ",1)";
    dataPoint2.cubicInterpolationMode = "monotone";
    dataPoint2.data = new Array();

    var beerCounter2 = 0;

    for (var j=0; j<dateRange.length; j++) {
      for (var k=0; k<data.length; k++) {
        if (data[k].drinkdate.getTime() === dateRange[j].getTime() && data[k].userid == users[i].id) {
          if (data[k].type === '1') {
            beerCounter2++;
          }
        }
      }
      dataPoint2.data.push(beerCounter2);
    }
    dataSet.datasets.push(dataPoint2);
  }

  return dataSet;
}

function getDataAndDrawChart(refreshDuration) {
  $.get("/users", function(userDataResponse) {

    userData = userDataResponse;

    $.get("/drinks", function(data) {
      data = resetDatesToHourGranularity(data);

      if (JSON.stringify(data) === JSON.stringify(oldData)) {
        setTimeout(function(){ getDataAndDrawChart(refreshDuration) }, refreshDuration);
        return;
      }
      oldData = data;

      var oldestDate = findOldestDate(data);
      oldestDate.setHours(oldestDate.getHours() - 1);
      var currentDate = new Date();
      currentDate.setMinutes(0);
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);

      var xAxisLabels = generateDateRange(oldestDate, currentDate);
      var dataSet = generateDataSet(xAxisLabels, userData, data);

      var chartOptions = {
        responsiveAnimationDuration : 1000,
        legend : {
          position : 'left'
        },
        elements : {
          line : {
            borderColor : '#00ff8c',
            backgroundColor : 'rgba(0,0,0,0.0)'
          },
          point : {
            borderColor : 'rgba(0,0,0,0.0)',
            backgroundColor : 'rgba(0,0,0,0.0)'
          }
        },
        scales : {
          xAxes : [{
            type : 'time',
            time : {
              displayFormats : {
                hour : 'ddd H:mm'
              }
            }
          }]
        }
      };

      var ctx = document.getElementById("beerChart").getContext("2d");
      var beerChart = new Chart(ctx, {
        type: 'line',
        data: dataSet,
        options: chartOptions
      });
      var legend = beerChart.generateLegend();
      //$('#chartLegend').html(legend);

      setTimeout(function(){ getDataAndDrawChart(refreshDuration) }, refreshDuration);
    })
    .fail(function(){
      setTimeout(function(){ getDataAndDrawChart(refreshDuration) }, refreshDuration);
    });
  });
}
