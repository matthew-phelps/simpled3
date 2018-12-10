//////////////////////////////////////////////////////////////////////////////
//////////////////    DRAW LEGEND     ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function drawLegend(x, width, height, el, margin) {
 var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  var rectSize = 15; //dimension of colored square
  var entryWidth = 100; // width of square and text combined
// ADD LEGEND BOXES
 	var svgLegend = d3.select(el)
    	.append('svg')
	    .attr('width', dim.width + margin.left + margin.right)
	    .attr('height', dim.height + margin.top + margin.bottom);

	var legendWrapper = svgLegend.append('g')
  		.attr("class", "legendWrapper")
  		.attr("transform" , 'translate(' + (dim.width/2 - entryWidth) + ',' + 0 + ')');
  	


	legendWrapper.append("rect")
  		.attr("width", rectSize)
	  	.attr("height", 10)
	  	.style("fille", "red");
	  	



}