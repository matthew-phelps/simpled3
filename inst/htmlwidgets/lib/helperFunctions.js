/*jshint esversion: 6 */

var insertLinebreaks = function(d) {
  var el = d3.select(this);
  var words = d.split(" ");
  el.text("");

  for (var i = 0; i < words.length; i++) {
    var tspan = el.append("tspan").text(words[i]);
    if (i > 0) tspan.attr("x", 0).attr("dy", "15");
  }
};

function scaffoldTooltip(rectSize, colors, chartType) {
  // Tooltip table setup
  var tooltip = d3
    .select("#container" + chartType)
    .append("div")
    .attr("id", "tooltip" + chartType)
    .style("opacity", 0);
  table = tooltip
    .append("table")
    .classed("table", true)
    .attr("id", "table" + chartType);
  var cellSvgWidth = "20%";
  var cellTextWidth = "80%";
  table
    .append("thead")
    .append("tr")
    .append("th")
    .attr("colspan", 2)
    .attr("class", "tooltipTitle");
  var tbody = table.append("tbody");
  var rowMale = tbody.append("tr");
  rowMale
    .append("td")
    .attr("width", cellSvgWidth)
    .append("svg")
    .attr("width", rectSize)
    .attr("height", rectSize)
    .append("rect")
    .attr("width", rectSize)
    .attr("height", rectSize)
    .style("fill", colors[0]);
  var maleCell = rowMale
    .append("td")
    .attr("class", "maleCell")
    .attr("width", cellTextWidth)
    .classed("maleCell");

  var rowFemale = tbody.append("tr");
  rowFemale
    .append("td")
    .attr("width", cellSvgWidth)
    .append("svg")
    .attr("width", rectSize)
    .attr("height", rectSize)
    .append("rect")
    .attr("width", rectSize)
    .attr("height", rectSize)
    .style("fill", colors[1]);
  var femaleCell = rowFemale
    .append("td")
    .attr("class", "femaleCell")
    .attr("width", cellTextWidth)
    .classed("femaleCell");
}

// data management function
function dataManagement(data, sexName, groupingName, varName) {
  for (var i = 0; i < data.length; i++) {
    data[i].sex = data[i][sexName];
    data[i].grouping = data[i][groupingName];
    data[i].value = data[i][varName];
    delete data[i][sexName];
    delete data[i][varName];
    delete data[i][groupingName];
  }

  var nestedData = d3
    .nest()
    .key(d => d.grouping)
    .entries(data);

    return nestedData;
}
