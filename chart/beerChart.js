Date.prototype.addHours = function(h) {
   this.setTime(this.getTime() + (h*60*60*1000));
   return this;
}

Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
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
var timeChangeDuringEvent = false; //NOTE: In case there is a time change during the event (daylight saving time)

$(document).ready(function() {
  getDataAndDrawChart(10000);
});

function resetDatesToHourGranularity(response) {
  for (var i=0; i<response.length; i++) {
    var obj = response[i];
    var hourlyDateTime = new Date(obj.drinkdate);
    hourlyDateTime.setMinutes(0);
    hourlyDateTime.setSeconds(0);
    hourlyDateTime.setMilliseconds(0);
    response[i].drinkdate = hourlyDateTime;
    if (hourlyDateTime.dst()) timeChangeDuringEvent = true;
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
  if (timeChangeDuringEvent) timeDifferenceInHours++; // Add one hour due to time change in spring
  console.log("TimeDiffInHours: " + timeDifferenceInHours);

  for (var i=0; i<timeDifferenceInHours; i++) {
    var newDate = new Date(startDate.valueOf());
    newDate.addHours(i);
    dates.push(newDate);
  }
  return dates;
}

function generateBeerUserSet(response) {
  var users=[];
  for (var i=0; i<response.length; i++) {
    var obj = response[i];
    if ($.inArray(obj.user, users) == -1) {
      users.push(obj.user);
    }
  }
  return users;
}

function generateDataSet(dateRange, users, data) {
  var dataSet = new Object();
  dataSet.labels = dateRange;
  dataSet.datasets = new Array();

  for (var i=0; i<users.length; i++) {
    var dataPoint = new Object();
    dataPoint.label = users[i];
    dataPoint.fillColor = colorOptions[i] + ",0.2)";
    dataPoint.strokeColor = colorOptions[i] + ",1)";
    dataPoint.pointColor = colorOptions[i] + ",1)";
    dataPoint.pointStrokeColor = "#fff";
    dataPoint.pointHighlightFill = "#fff";
    dataPoint.pointHighlightStroke = colorOptions[i] + ",1)";
    dataPoint.data = new Array();

    var beerCounter = 0;

    for (var j=0; j<dateRange.length; j++) {
      for (var k=0; k<data.length; k++) {
        if (data[k].drinkdate.getTime() === dateRange[j].getTime() && data[k].user == users[i]) {
          beerCounter++;
        }
      }
      dataPoint.data.push(beerCounter);
    }
    dataSet.datasets.push(dataPoint);
  }

  console.log(dataSet);
  return dataSet;
}

function getDataAndDrawChart(refreshDuration) {
  $.get("/beers", function(data) {
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
    var beerUsers = generateBeerUserSet(data);
    var dataSet = generateDataSet(xAxisLabels, beerUsers, data);

    var chartOptions = {
        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,
        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",
        //Number - Width of the grid lines
        scaleGridLineWidth : 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - Whether the line is curved between points
        bezierCurve : true,
        //Number - Tension of the bezier curve between points
        bezierCurveTension : 0.4,
        //Boolean - Whether to show a dot for each point
        pointDot : false,
        //Number - Radius of each point dot in pixels
        pointDotRadius : 1,
        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth : 1,
        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,
        //Boolean - Whether to show a stroke for datasets
        datasetStroke : true,
        //Number - Pixel width of dataset stroke
        datasetStrokeWidth : 3,
        //Boolean - Whether to fill the dataset with a colour
        datasetFill : true,
        // Rounded corners?
        bezierCurve: false,
        responsive: true,
        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>"
    };

    var ctx = document.getElementById("beerChart").getContext("2d");
    var beerChart = new Chart(ctx).Line(dataSet, chartOptions);
    var legend = beerChart.generateLegend();
    $('#chartLegend').html(legend);

    setTimeout(function(){ getDataAndDrawChart(refreshDuration) }, refreshDuration);
  })
  .fail(function(){
    setTimeout(function(){ getDataAndDrawChart(refreshDuration) }, refreshDuration);
  });
}
