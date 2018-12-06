//////////////////////////////////////////////////////////////////////////////
//////////////////    DRAW LEGEND     ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function drawLegend(x, width, height, el) {
 var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };
var container = d3.select(el).style("position", "relative")
    .append('div')
    .attr("id", "containerBarLegend");

  svgLegend = container
    .append('svg')
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .attr('transform', 'translate(' + dim.width + ",0)");


    
}