/*jshint esversion: 6 */

var insertLinebreaks = function (d) {
    var el = d3.select(this);
    var words = d.split(' ');
    el.text('');

    for (var i = 0; i < words.length; i++) {
        var tspan = el.append('tspan').text(words[i]);
        if (i > 0)
            tspan.attr('x', 0).attr('dy', '15');
    }
};

function scaffoldTooltip(tableBar, rectSize, colors){
 // Tooltip table setup
  var cellSvgWidth = "20%";
  var cellTextWidth = "80%";
  var thead = tableBar
      .append('thead')
      .append('tr')
      .append('th')
      .attr("colspan", 2)
      .classed("thead");
  var tbody = tableBar.append('tbody');
  var rowMale = tbody.append('tr');
  rowMale.append('td').attr('width', cellSvgWidth)
  .append('svg')
      .attr("width", rectSize)
      .attr('height', rectSize)
  .append('rect')
      .attr('width', rectSize)
      .attr('height', rectSize)
      .style('fill', colors[0]);
var maleCell = rowMale
      .append('td')
      .attr("class", 'maleCell')
      .attr("width", cellTextWidth)
      .classed("maleCell");

var rowFemale = tbody.append('tr');
rowFemale.append('td').attr("width", cellSvgWidth)
  .append('svg')
      .attr('width', rectSize)
      .attr('height', rectSize)
  .append('rect')
      .attr('width', rectSize)
      .attr('height', rectSize)
      .style('fill', colors[1]);
var femaleCell = rowFemale
      .append('td')
      .attr("class", 'femaleCell')
      .attr('width', cellTextWidth)
      .classed("femaleCell");

  }