/*jshint esversion: 6 */
//////////////////////////////////////////////////////////////////////////////
//////////////////    DRAW LEGEND  & TITLE ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function drawLegend(
  topG,
  inData,
  innerDim,
  dims,
  wrapperName,
  svgName
) {
  var rectSize = 20; //dimension of colored square
  var padding = 10;
  var entryWidth = 100; // width of square and text combined
  var legendWidth = rectSize + 2 * padding + entryWidth;

  // ADD LEGEND BOXES

  var legendWrapper = topG
    .append("g")
    .attr("class", wrapperName)
    .attr(
      "transform",
      "translate(" + (0) + "," + (innerDim.innerHeight + dims.legendBuffer) + ")"
    );

  // Wrappers for each gender
  var legendMale = legendWrapper
    .append("g")
    .attr("class", "legend male")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

  var legendFemale = legendWrapper
    .append("g")
    .attr("class", "legend female")
    .attr(
      "transform",
      "translate(" + (legendWidth / 2 + 2 * padding) + "," + 0 + ")"
    );

  // Append rect and text for each gender
  legendMale
    .append("rect")
    .attr("width", rectSize)
    .attr("height", rectSize)
    .style("fill", inData.metaData.colors[0]);

  legendMale
    .append("text")
    .attr(
      "transform",
      "translate(" + (rectSize + padding) + "," + rectSize / 2 + ")"
    )
    .attr("dominant-baseline", "middle") // verticle alignment?
    .text(inData.metaData.sexVars[1]);

  legendFemale
    .append("rect")
    .attr("width", rectSize)
    .attr("height", rectSize)
    .style("fill", inData.metaData.colors[1]);
  legendFemale
    .append("text")
    .attr(
      "transform",
      "translate(" + (rectSize + padding) + "," + rectSize / 2 + ")"
    )
    .attr("dominant-baseline", "middle") // verticle alignment?
    .text(inData.metaData.sexVars[0]);


  /////////////    ADD TITLE   ////////////////////////////////////////////////////
  var titleWrapper = topG
    .append("g")
    .attr("class", wrapperName + " title")
    .attr("transform", "translate(" + -dims.margin.left + "," + -dims.margin.top + ")");
  
  /*Split title into two line*/
  var titleText = inData.metaData.plotTitle.split(": ")
  /* First line of title */
  titleWrapper
    .append("text")
    .text(titleText[0])
    .attr("dominant-baseline", "hanging")
    .attr("text-anchor", "start")
    .attr("id", "plot_titleD3_0_" + wrapperName)
    .attr("class", "plot_text")
    .attr("class", "output_titles");

/* 2nd line of title*/
    titleWrapper
    .append("text")
    .text(titleText[1])
    .attr("transform", "translate(" + 0 + "," + dims.titleHeight1 + ")")
    .attr("dominant-baseline", "hanging")
    .attr("text-anchor", "start")
    .attr("id", "plot_titleD3_1_" + wrapperName)
    .attr("class", "plot_text")
    .attr("class", "output_titles");
}

function updateLegend(inData, wrapperName, svgName, tDuration) {
  var titleText = inData.metaData.plotTitle.split(": ")
  d3.select("#plot_titleD3_1_" + wrapperName)
    .transition()
    .duration(tDuration)
    .text(titleText[0]);
}

function resizeLegend(innerDim, dims, wrapperName) {
  var rectSize = 20; //dimension of colored square
  var padding = 10;
  var entryWidth = 100; // width of square and text combined
  var legendWidth = rectSize + 2 * padding + entryWidth;

  // ADD LEGEND BOXES
  var legendWrapper = d3
    .select("." + wrapperName)
    .attr(
      "transform",
      "translate(" + (0) + "," + (innerDim.innerHeight + dims.legendBuffer) + ")"
    );
}
