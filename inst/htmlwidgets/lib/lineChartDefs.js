/*jshint esversion: 6 */
function drawLineChart(inData, width, height, el, margin, rectPadding, colors, tLong, tShort, cRadius, bigRadius) {
  var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };
  
  var container = d3.select(el).html("").style("position", "relative")
    .append('div')
    .attr('id', 'containerLine');

  var svg = container.append('svg')
    .attr("width", dim.width + margin.left + margin.right)
    .attr("height", dim.height + margin.top + margin.bottom);

  var topG = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top +')');

  var chartArea = topG.append("g")
    .attr("class", "chartArea");

  // Initial axis
  var yAxis = topG.append('g')
    .attr("class", "line y axis");

  var xAxis = topG.append('g')
    .attr("class", "line x axis");

  // Axis titles
  topG.append("text")
    .attr("x", dim.width / 2)
    .attr("y", dim.height + margin.bottom)
    .attr("class", "line x axisTitle");
    
  topG.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - dim.height / 2)
    .attr("y", 0 - margin.left + 20)
    .attr("class", "line y axisTitle");

  // Tooltip container
  var tooltip = container.append("div")
    .attr('id', 'tooltipLine')
    .style('opacity', 0);

  var data = HTMLWidgets.dataframeToD3(inData.data);
  var varName = data[0].variable;
  var grouping1Names = data.map(d => d.year);
  

  // Scales
  var maxY = d3.max(data, d=> Math.max(d.female, d.male));
  var scaleX = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, dim.width]);

  var scaleXRects = d3.scaleBand()
    .domain(grouping1Names)
    .range([0, dim.width])
    .padding(rectPadding);

  var scaleY = d3.scaleLinear()
    .domain([0, maxY])
    .range([dim.height, 0]);

  var scaleColors = d3.scaleOrdinal()
   .range(colors);
  
  xAxis.call(d3.axisBottom(scaleX)
    .tickFormat(d3.format("")))
    .attr("transform", "translate(" + 0 + "," + dim.height + ')');


  // Mouseover area for each circle should extend halfway to next circle on x-axis. This will cause problems for nearby male/female circles
 // var bigRadius = scaleX(d3.max(data, d=> d.year)) / data.length;
  // Line generators
  var valueLine1 = d3.line()
    .x(d => scaleX(d.year))
    .y(d => scaleY(d.female));

  var valueLine2 = d3.line()
    .x(d => scaleX(d.year))
    .y(d => scaleY(d.male));

  // Add initial line paths
  var line1 = chartArea
    .append("path")
    .datum(data) // use dataum() because appending to single svg element
    .attr("d", valueLine1)
    .attr("fill", "none")
    .attr("stroke", colors[0])
    .attr("stroke-width", 3)
    .attr("class", "line female");

  var line2 = chartArea
    .append("path")
    .datum(data) // use dataum() because appending to single svg element
    .attr("d", valueLine2)
    .attr("fill", "none")
    .attr("stroke", colors[1])
    .attr("stroke-width", "3")
    .attr("class", "line male");

  // Add initial circles
  var circlesFemale = chartArea
    .selectAll(".dot")
    .data(data)
    .enter().append("circle")
      .attr("class",  d => "y" + d.year + " dotfemale")
      .attr("cx", d => scaleX(d.year))
      .attr("cy", d => scaleY(d.female))
      .attr("r", cRadius)
      .attr("fill", colors[0]);

  var circlesMale = chartArea
    .selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class",  d => "y" + d.year + " dotmale")
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.male))
    .attr("r", cRadius)
    .attr("fill", colors[1]);

   // Add axes
  yAxis.transition()
    .duration(tLong)
    .call(d3.axisLeft(scaleY));

  xAxis.transition()
    .duration(tLong)
    .call(d3.axisBottom(scaleX)
      .tickFormat(d3.format("")));

  // Add axis titles
  topG.select(".line.y.axisTitle")
    .transition()
    .duration(tLong)
    .text(varName)
    .style("text-anchor", "middle");

  topG.select(".line.x.axisTitle")
    .transition()
    .duration(tLong)
    .text("År")
    .style("text-anchor", "middle");

// Invisible rects to trigger mouseover events
var mouseRectsFemale = chartArea
  .selectAll("g")
    .data(data)
    .enter().append("rect")
    .attr("class", "mouseSvg female")
    .attr("x", d => scaleX(d.year) - (scaleXRects.bandwidth() / 2))
    .attr("width", scaleXRects.bandwidth())
    .attr("y", 0)
    .attr("height", height);

mouseRectsFemale
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseout", hideTooltip);


// Tooltip functions - these will be hoisted to top of fn call
  function showTooltip(d) {
    d3.selectAll(".y" + d.year)
      .transition()
        .ease(d3.easeLinear)
        .duration("200")
        .attr("r", bigRadius);
    tooltip.transition()
    .duration(tShort)
    .style('opacity', 0.9);
    
  }

  function moveTooltip(d){
    tooltip.html(
      varName + " i " +"<b>" + d.year + "</b>" + "<br/><br/>" +
       Object.keys(d)[1] + ": <b>" + d.female + "</b><br/>" +
       Object.keys(d)[2] + ": <b>" + d.male + "</b>")
    .style("left", d3.mouse(this)[0] + "px")
    .style("top", (d3.mouse(this)[1] + 50) + "px");
  }

  function hideTooltip(d) {
     d3.selectAll(".y" + d.year)
      .transition()
        .ease(d3.easeLinear)
        .duration("200")
        .attr("r", cRadius);
    tooltip.transition()
    .duration(tShort)
    .style('opacity', 0);
  }


}
///////////////////////////////////////////////////////////
///////////////      UPDATE     ///////////////////////////
///////////////////////////////////////////////////////////

function updateLineChart(inData, width, height, el, margin, rectPadding, colors, tLong, tShort, cRadius, bigRadius) {
  var dim = {
    width: width,
    height: height
  };

  var svg = d3.select("#containerLine").select('svg');
  var chartArea = svg.selectAll('.chartArea');
  var tooltip = d3.select("#tooltipLine");
  
  var data = HTMLWidgets.dataframeToD3(inData.data);
  var varName = data[0].variable;
  var grouping1Names = data.map(d => d.year);

  // Line generators
  var valueLine1 = d3.line()
    .x(d => scaleX(d.year))
    .y(d => scaleY(d.female));

  var valueLine2 = d3.line()
    .x(d => scaleX(d.year))
    .y(d => scaleY(d.male));

  // Scales
  var maxY = d3.max(data, d=> Math.max(d.female, d.male));
  var scaleX = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, dim.width]);

var scaleXRects = d3.scaleBand()
    .domain(grouping1Names)
    .range([0, dim.width])
    .padding(rectPadding);


  var scaleY = d3.scaleLinear()
    .domain([0, maxY])
    .range([dim.height, 0]);

  var scaleColors = d3.scaleOrdinal()
   .range(colors);

  // Update line paths with new data
  chartArea
    .select(".line.female")
    .transition()
    .duration(tLong)
    .attr("d", valueLine1(data));

  chartArea
    .select(".line.male")
    .transition()
    .duration(tLong)
    .attr("d", valueLine2(data));

  // Update circles with new data
  var dotFemale = chartArea.selectAll(".dotfemale")
    .data(data);

  dotFemale.transition()
    .duration(tLong)
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.female));

  dotFemale
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  chartArea.selectAll(".dotmale")
    .data(data)
    .transition()
    .duration(tLong)
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.male));

// Larger invisible circles to trigger mouseover events
var mouseRectsFemale = chartArea
  .selectAll(".mouseSvg.female")
    .data(data)
    .attr("x", d => scaleX(d.year) - (scaleXRects.bandwidth() / 2))
    .attr("width", scaleXRects.bandwidth())
    .attr("y", 0)
    .attr("height", height)
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseout", hideTooltip);


  // Udpate axes
  svg.select(".line.y.axis")
    .transition()
    .duration(tLong)
    .call(d3.axisLeft(scaleY));

  svg.select(".line.x.axis")
    .transition()
    .duration(tLong)
    .call(d3.axisBottom(scaleX)
      .tickFormat(d3.format("")));

  // Update axis titles
  svg.select(".line.y.axisTitle")
    .transition()
    .duration(tLong)
    .text(varName)
    .style("text-anchor", "middle");


// Tooltip functions - these will be hoisted to top of fn call
  function showTooltip(d) {
    d3.selectAll(".y" + d.year)
      .transition()
        .ease(d3.easeLinear)
        .duration("200")
        .attr("r", bigRadius);
    tooltip.transition()
    .duration(tShort)
    .style('opacity', 0.9);
    
  }

  function moveTooltip(d){
    svg.selectAll(".dotfemale")
      .attr("cx", d => scaleX(d.year))
      .attr("cy", d => scaleY(d.female));
    svg.selectAll(".dotmale")
      .attr("cx", d => scaleX(d.year))
      .attr("cy", d => scaleY(d.male));


    tooltip.html(
      varName + " i " +"<b>" + d.year + "</b>" + "<br/><br/>" +
       Object.keys(d)[1] + ": <b>" + d.female + "</b><br/>" +
       Object.keys(d)[2] + ": <b>" + d.male + "</b>")
    .style("left", d3.mouse(this)[0] + "px")
    .style("top", (d3.mouse(this)[1] + 50) + "px");
  }

  function hideTooltip(d) {
     d3.selectAll(".y" + d.year)
      .transition()
        .ease(d3.easeLinear)
        .duration("200")
        .attr("r", cRadius);
    tooltip.transition()
    .duration(tShort)
    .style('opacity', 0);
  }
}

///////////////////////////////////////////////////////////
///////////////      RESIZE     ///////////////////////////
///////////////////////////////////////////////////////////

function resizeLineChart(inData, width, height, el, margin, rectPadding, colors, tLong, tShort, cRadius, bigRadius) {
  
  var dim = {
    width: width,
    height: height
  };

  var data = HTMLWidgets.dataframeToD3(inData.data);
  var varName = data[0].variable;
  var grouping1Names = data.map(d => d.year);

  var svg = d3.select("#containerLine").select('svg')
    .attr("width", dim.width + margin.left + margin.right)
    .attr("height", dim.height + margin.top + margin.bottom);
  var chartArea = svg.select(".chartArea");
  var tooltip = d3.select("#tooltipLine");


  svg.select('.x.axisTitle')
    .attr("x", dim.width / 2)
    .attr("y", dim.height + margin.bottom);

  svg.select('.y.axisTitle')
    .attr("x", 0 - dim.height / 2)
    .attr("y", 0 - margin.left + 20);

    // Line generators
  var valueLine1 = d3.line()
    .x(d => scaleX(d.year))
    .y(d => scaleY(d.female));

  var valueLine2 = d3.line()
    .x(d => scaleX(d.year))
    .y(d => scaleY(d.male));

  // Scales
  var maxY = d3.max(data, d=> Math.max(d.female, d.male));
  var scaleX = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, dim.width]);

var scaleXRects = d3.scaleBand()
    .domain(grouping1Names)
    .range([0, dim.width])
    .padding(rectPadding);

  var scaleY = d3.scaleLinear()
    .domain([0, maxY])
    .range([dim.height, 0]);

  var scaleColors = d3.scaleOrdinal()
   .range(colors);

// Resize line paths with new size
  chartArea
    .select(".line.female")
    .transition()
    .duration(tLong)
    .attr("d", valueLine1(data));

  chartArea
    .select(".line.male")
    .transition()
    .duration(tLong)
    .attr("d", valueLine2(data));

  // Re-position circles with new size
  chartArea.selectAll(".dotfemale")
    .transition()
    .duration(tLong)
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.female));

  chartArea.selectAll(".dotmale")
    .transition()
    .duration(tLong)
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.male));

// Larger invisible circles to trigger mouseover events
  var mouseRectsFemale = chartArea
  .selectAll(".mouseSvg.female")
    .attr("x", d => scaleX(d.year) - (scaleXRects.bandwidth() / 2))
    .attr("width", scaleXRects.bandwidth())
    .attr("y", 0)
    .attr("height", height)
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseout", hideTooltip);


  
  // Udpate axes
  svg.select(".line.y.axis")
    .transition()
    .duration(tLong)
    .call(d3.axisLeft(scaleY));

  svg.select(".line.x.axis")
    .transition()
    .duration(tLong)
    .call(d3.axisBottom(scaleX)
      .tickFormat(d3.format("")));

  // Update axis titles
  svg.select(".line.y.axisTitle")
    .transition()
    .duration(tLong)
    .text(varName)
    .style("text-anchor", "middle");
  

// Mouse event functions
  // Tooltip functions - these will be hoisted to top of fn call
  function showTooltip(d) {
    d3.selectAll(".y" + d.year)
      .transition()
        .ease(d3.easeLinear)
        .duration("200")
        .attr("r", bigRadius);
    tooltip.transition()
    .duration(tShort)
    .style('opacity', 0.9);
    
  }

  function moveTooltip(d){
    svg.selectAll(".dotfemale")
      .attr("cx", d => scaleX(d.year))
      .attr("cy", d => scaleY(d.female));
    svg.selectAll(".dotmale")
      .attr("cx", d => scaleX(d.year))
      .attr("cy", d => scaleY(d.male));


    tooltip.html(
      varName + " i " +"<b>" + d.year + "</b>" + "<br/><br/>" +
       Object.keys(d)[1] + ": <b>" + d.female + "</b><br/>" +
       Object.keys(d)[2] + ": <b>" + d.male + "</b>")
    .style("left", d3.mouse(this)[0] + "px")
    .style("top", (d3.mouse(this)[1] + 50) + "px");
  }

  function hideTooltip(d) {
     d3.selectAll(".y" + d.year)
      .transition()
        .ease(d3.easeLinear)
        .duration("200")
        .attr("r", cRadius);
    tooltip.transition()
    .duration(tShort)
    .style('opacity', 0);
  }



 }