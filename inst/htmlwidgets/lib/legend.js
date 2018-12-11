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
    	.attr('class', 'svgLegend')
	    .attr('width', dim.width + margin.left + margin.right)
	    .attr('height', dim.height + margin.top + margin.bottom);

	var legendWrapper = svgLegend.append('g')
  		.attr("class", "legendWrapper")
  		.attr("transform" , 'translate(' + margin.left + ',' + margin.top + ')');
  		

  	var legendFemale = legendWrapper.append('g')
  		.attr('class', 'legend female')
  		.attr("transform" , 'translate(' + (dim.width/2 - entryWidth + padding) + ',' + 0 + ')');	
  	
  	var legendMale = legendWrapper.append('g')
  		.attr('class', 'legend male')
  		.attr("transform" , 'translate(' + (dim.width/2 + padding) + ',' + 0 + ')');	
  	


	legendFemale.append("rect")
  		.attr("width", rectSize)
	  	.attr("height", rectSize)
	  	.style("fill", fromR.data.color[0]);
	 legendFemale.append("text")
	 	.attr('transform', 'translate(' + (rectSize + padding) +',' + rectSize/2 + ')')
	 	.attr('alignment-baseline', 'middle') // verticle alignment?
	 	.text(fromR.data.sex[0]);

	 legendMale.append("rect")
  		.attr("width", rectSize)
	  	.attr("height", rectSize)
	  	.style("fill", fromR.data.color[1]);
	 legendMale.append("text")
	 	.attr('transform', 'translate(' + (rectSize + padding) +',' + rectSize/2 + ')')
	 	.attr('alignment-baseline', 'middle') // verticle alignment?
	 	.text(fromR.data.sex[1]);
	  	
}



function resizeLegend(width, height, margin) {
 var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  var rectSize = 20; //dimension of colored square
  var padding = 10; 
  var entryWidth = 100; // width of square and text combined
// ADD LEGEND BOXES
 	var svgLegend = d3.select('.svgLegend')
	    .attr('width', dim.width + margin.left + margin.right)
	    .attr('height', dim.height + margin.top + margin.bottom);

	var legendWrapper = svgLegend.select('.legendWrapper')
  		.attr("transform" , 'translate(' + margin.left + ',' + margin.top + ')');
  		
  	legendWrapper.select('.legend.female')
  		.attr("transform" , 'translate(' + (dim.width/2 - entryWidth) + ',' + 0 + ')');	
  	
  	legendWrapper.select('.legend.male')
  		.attr("transform" , 'translate(' + (dim.width/2) + ',' + 0 + ')');	


	  	
}