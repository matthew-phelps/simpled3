//////////////////////////////////////////////////////////////////////////////
//////////////////    DRAW LEGEND     ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function drawLegend(x, width, height, el, margin) {
 var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };
var container = d3.select(el).style("position", "relative")
    .append('div')
    .attr("id", "containerBarLegend");
// ADD LEGEND BOXES
  svgLegend = container
    .append('svg')
    .attr('width', dim.width)
    .attr('height', dim.height);



}