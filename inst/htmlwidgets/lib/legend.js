//////////////////////////////////////////////////////////////////////////////
//////////////////    DRAW LEGEND  & DOWNLOAD ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function drawLegend(topG, inData, dim, margin, legendHeight, wrapperName, svgName) {


  var rectSize = 20; //dimension of colored square
  var padding = 10; 
  var entryWidth = 100; // width of square and text combined
  var legendWidth = rectSize + 2*padding + entryWidth;
  var downloadButtonWidth = rectSize * 3;


// ADD LEGEND BOXES

  var legendWrapper = topG.append('g')
  .attr("class", wrapperName)
  .attr("transform" , 'translate(' + (dim.width / 2 - legendWidth / 2) + ',' + (dim.height) + ')');

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


  /// ADD DOWNLOAD BUTTON
  var downloadButtonWrapper = topG.append('g')
  .attr("class", wrapperName + "downloadButton")
  .attr("transform" , 'translate(' + (dim.width - downloadButtonWidth) + ',' + (dim.height) + ')');

  var downloadButton = downloadButtonWrapper
  .append('rect')
  .attr('class', 'download button')
  .attr("width", downloadButtonWidth)
  .attr("height", rectSize * 1.2)
  .style("fill", "white")
  .style("stroke", "black");

  downloadButtonWrapper
  .text("Download")
  .attr("fill", "black");



}



function resizeLegend(dim, wrapperName) {

  var rectSize = 20; //dimension of colored square
  var padding = 10; 
  var entryWidth = 100; // width of square and text combined
  var legendWidth = rectSize + 2*padding + entryWidth;

// ADD LEGEND BOXES
var legendWrapper = d3.select('.' + wrapperName)
.attr("transform" , 'translate(' + (dim.width / 2 - legendWidth / 2) + ',' + (dim.height) + ')');



}