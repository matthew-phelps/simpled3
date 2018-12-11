//////////////////////////////////////////////////////////////////////////////
//////////////////    DRAW LEGEND     ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function drawLegend(fromR, width, height, el, margin) {
 var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  var rectSize = 20; //dimension of colored square
  var padding = 10; 
  var entryWidth = 100; // width of square and text combined
// ADD LEGEND BOXES
 	var svgLegend = d3.select(el)
    	.append('svg')
	    .attr('width', dim.width + margin.left + margin.right)
	    .attr('height', dim.height + margin.top + margin.bottom);

	var legendWrapper = svgLegend.append('g')
  		.attr("class", "legendWrapper")
  		.attr("transform" , 'translate(' + margin.left + ',' + margin.top + ')');
  		

  	var legend = legendWrapper.append('g')
  		.attr("transform" , 'translate(' + (dim.width/2 - entryWidth) + ',' + 0 + ')');	
  	


	legend.append("rect")
  		.attr("width", rectSize)
	  	.attr("height", rectSize)
	  	.style("fill", fromR.data.color[0]);
	 legend.append("text")
	 	.attr('transform', 'translate(' + (rectSize + padding) +',' + rectSize/2 + ')')
	 	.attr('alignment-baseline', 'middle') // verticle alignment?
	 	.text(fromR.data.sex[0]);

	 legend.append("rect")
  		.attr("width", rectSize)
	  	.attr("height", rectSize)
	  	.attr('transform', 'translate(' + entryWidth + ',' + 0 + ')')
	  	.style("fill", fromR.data.color[1]);
	 legend.append("text")
	 	.attr('transform', 'translate(' + (entryWidth + rectSize + padding) +',' + rectSize/2 + ')')
	 	.attr('alignment-baseline', 'middle') // verticle alignment?
	 	.text(fromR.data.sex[1]);
	  	
}