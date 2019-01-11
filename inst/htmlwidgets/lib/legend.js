//////////////////////////////////////////////////////////////////////////////
//////////////////    DRAW LEGEND     ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function drawLegend(topG, inData, dim, margin, legendHeight) {
 

  var rectSize = 20; //dimension of colored square
  var padding = 10; 
  var entryWidth = 100; // width of square and text combined
  var legendWidth = rectSize + 2*padding + entryWidth;
// ADD LEGEND BOXES
 	
var legendWrapper = topG.append('g')
      .attr("class", "legendWrapperBar")
      .attr("transform" , 'translate(' + (dim.width / 2 - legendWidth / 2) + ',' + (dim.height) + ')');

  var svgLegend = legendWrapper
    	.append('svg')
    	.attr('class', 'svgLegendBar')
	    .attr('width', legendWidth)
	    .attr('height', legendHeight);
      

	
  	// Wrappers for each gender	
  	var legendMale = legendWrapper.append('g')
  		.attr('class', 'legend male')
  		.attr("transform" , 'translate(' + (0) + ',' + 0 + ')');	
  	
    var legendFemale = legendWrapper.append('g')
      .attr('class', 'legend female')
      .attr("transform" , 'translate(' + (legendWidth/2 + 2*padding) + ',' + 0 + ')');  
    

  // Append rect and text for each gender
	 legendMale.append("rect")
  		.attr("width", rectSize)
	  	.attr("height", rectSize)
	  	.style("fill", inData.legend.colors[1]);

	 legendMale.append("text")
	 	.attr('transform', 'translate(' + (rectSize + padding) +',' + rectSize/2 + ')')
	 	.attr('alignment-baseline', 'middle') // verticle alignment?
	 	.text(inData.legend.legendData.sex[1]);

	  	
	legendFemale.append("rect")
  		.attr("width", rectSize)
	  	.attr("height", rectSize)
	  	.style("fill", inData.legend.colors[0]);
	 legendFemale.append("text")
	 	.attr('transform', 'translate(' + (rectSize + padding) +',' + rectSize/2 + ')')
	 	.attr('alignment-baseline', 'middle') // verticle alignment?
	 	.text(inData.legend.legendData.sex[0]);
}



function resizeLegend() {
 
  var rectSize = 20; //dimension of colored square
  var padding = 10; 
  var entryWidth = 100; // width of square and text combined
  var legendWidth = rectSize + 2*padding + entryWidth;

// ADD LEGEND BOXES
	var legendWrapper = d3.select('.legendWrapperBar')
  		.attr("transform" , 'translate(' + (dim.width / 2 - legendWidth / 2) + ',' + (dim.height) + ')');
  		
  /*var svgLegend = d3.select('.svgLegendBar')
      .attr('width', dim.width + margin.left + margin.right)
      .attr('height', dim.height + margin.top + margin.bottom);

  	
  	legendWrapper.select('.legend.male')
  		.attr("transform" , 'translate(' + (dim.width/2 - entryWidth + 1.5 * padding) + ',' + 0 + ')');	

  	legendWrapper.select('.legend.female')
  		.attr("transform" , 'translate(' + (dim.width/2 + 1.5 * padding) + ',' + 0 + ')');	
*/
	  	
}