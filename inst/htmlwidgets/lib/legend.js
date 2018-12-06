//////////////////////////////////////////////////////////////////////////////
//////////////////    DRAW LEGEND     ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function drawLegend(svgContainerName, width, margin, legendWidth, legendHeight, colors) {
 var dim = {
    width: width - margin.left - margin.right - legendWidth
  };
var container = d3.select(el).style("position", "relative")
    .append('div')
    .attr("id", "containerBarLegend");

  svgLegend = d3.select("#" + svgContainerName)
    .append('svg')
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .attr('transform', 'translate(' + dim.width + ",0)");
}