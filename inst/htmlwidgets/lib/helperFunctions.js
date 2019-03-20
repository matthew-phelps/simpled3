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

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

console.log(wrap("sadfads asd ga asd g asd g asd ag", "10"))

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
