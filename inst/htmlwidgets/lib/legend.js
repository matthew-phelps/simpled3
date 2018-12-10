//////////////////////////////////////////////////////////////////////////////
//////////////////    DRAW LEGEND     ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function drawLegend(x, width, height, el, margin) {
 var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };
  
// ADD LEGEND BOXES
  svgLegend = d3.select(el)
    .append('svg')
    .attr('width', dim.width + margin.left + margin.right)
    .attr('height', dim.height + margin.top + margin.bottom);







}