//////////////////////////////////////////////////////////////////////////////
//////////////////    DRAW LEGEND     ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function drawLegend(inData, dim, margin, legendHeight) {
 

  var rectSize = 20; //dimension of colored square
  var padding = 10; 
  var entryWidth = 100; // width of square and text combined
// ADD LEGEND BOXES
 	var svgLegend = d3.select(".svgBar")
    	.append('svg')
    	.attr('class', 'svgLegendBar')
	    .attr('width', dim.width + margin.left + margin.right)
	    .attr('height', legendHeight);

	var legendWrapper = svgLegend.append('g')
  		.attr("class", "legendWrapper")
  		.attr("transform" , 'translate(' + margin.left + ',' + margin.top + ')');
  		

  	var legendFemale = legendWrapper.append('g')
  		.attr('class', 'legend female')
  		.attr("transform" , 'translate(' + (dim.width/2 - entryWidth + 2 * padding) + ',' + 0 + ')');	
  	
  	var legendMale = legendWrapper.append('g')
  		.attr('class', 'legend male')
  		.attr("transform" , 'translate(' + (dim.width/2 + 2 * padding) + ',' + 0 + ')');	
  	



	 legendMale.append("rect")
  		.attr("width", rectSize)
	  	.attr("height", rectSize)
	  	.style("fill", inData.legend.colors[0]);

	 legendMale.append("text")
	 	.attr('transform', 'translate(' + (rectSize + padding) +',' + rectSize/2 + ')')
	 	.attr('alignment-baseline', 'middle') // verticle alignment?
	 	.text(inData.legend.legendData.sex[0]);

	  	
	legendFemale.append("rect")
  		.attr("width", rectSize)
	  	.attr("height", rectSize)
	  	.style("fill", fromR.data.colors[1]);
	 legendFemale.append("text")
	 	.attr('transform', 'translate(' + (rectSize + padding) +',' + rectSize/2 + ')')
	 	.attr('alignment-baseline', 'middle') // verticle alignment?
	 	.text(inData.legend.legendData.sex[1]);
}



function resizeLegend(dim) {
 
  var rectSize = 20; //dimension of colored square
  var padding = 10; 
  var entryWidth = 100; // width of square and text combined
// ADD LEGEND BOXES
 	var svgLegend = d3.select('.svgLegendBar')
	    .attr('width', dim.width + margin.left + margin.right)
	    .attr('height', dim.height + margin.top + margin.bottom);

	var legendWrapper = svgLegend.select('.legendWrapper')
  		.attr("transform" , 'translate(' + margin.left + ',' + margin.top + ')');
  		
  	
  	legendWrapper.select('.legend.male')
  		.attr("transform" , 'translate(' + (dim.width/2 - entryWidth + 1.5 * padding) + ',' + 0 + ')');	

  	legendWrapper.select('.legend.female')
  		.attr("transform" , 'translate(' + (dim.width/2 + 1.5 * padding) + ',' + 0 + ')');	

	  	
}