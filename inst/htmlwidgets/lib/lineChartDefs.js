function drawLineChart(inData, width, height, el) {
  var colors = ['#bd6916', '#166abd '];
  var tLong = 450;
  var tShort = 200;
  var cRadius = 7;

  var margin = ({top:10, right:10, bottom:40, left:60});
  var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };
  
  var container = d3.select(el).html("").style("position", "relative")
    .append('div')
    .attr('id', 'container')

  var svg = container.append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var topG = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top +')');

  var chartArea = topG.append("g")
    .attr("class", "chartArea");

  // Initial axis
  var yAxis = topG.append('g')
    .attr("class", "y axis");

  var xAxis = topG.append('g')
    .attr("class", "x axis");


  // Axis titles
  topG.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .attr("class", "x axisTitle")
    
  topG.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - margin.left + 20)
    .attr("class", "y axisTitle")

  // Tooltip container
  var tooltip = container.append("div")
    .attr('class', 'tooltip');

  var data = HTMLWidgets.dataframeToD3(inData.data);
  var varName = data[0].variable;
  var grouping1Names = data.map(d => d.year);

  // Scales
  var maxY = d3.max(data, d=> Math.max(d.female, d.male));
  var scaleX = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, width]);

  var scaleY = d3.scaleLinear()
    .domain([0, maxY])
    .range([height, 0]);

var scaleColors = d3.scaleOrdinal()
   .range(colors);
  
  xAxis.call(d3.axisBottom(scaleX)
    .tickFormat(d3.format("")))
    .attr("transform", "translate(" + 0 + "," + height + ')');


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
    .attr("class", "dotfemale")
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.female))
    .attr("r", cRadius)
    .attr("fill", colors[0]);

  var circlesMale = chartArea
    .selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dotmale")
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.male))
    .attr("r", cRadius)
    .attr("fill", colors[1]);

   // Udpate axes
  yAxis.transition()
    .duration(tLong)
    .call(d3.axisLeft(scaleY));

  xAxis.transition()
    .duration(tLong)
    .call(d3.axisBottom(scaleX)
      .tickFormat(d3.format("")));

  // Update axis titles
  topG.select(".y.axisTitle")
    .transition()
    .duration(tLong)
    .text(varName)
    .style("text-anchor", "middle");

// Larger invisible circles to trigger mouseover events
var mouseCirclesFemale = chartArea
  .selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "mouseSvg female")
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.female))
    .attr("r", cRadius)
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseout", hideTooltip);

var mouseCirclesMale = chartArea
  .selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "mouseSvg male")
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.male))
    .attr("r", mRadius)
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseout", hideTooltip);



// Tooltip functions - these will be hoisted to top of fn call
  function showTooltip(d) {
    tooltip.transition()
    .duration(tShort)
    .style('opacity', 0.9);
    
  }

  function moveTooltip(d){
    tooltip.html(
      "<b>" + "År " + "</b>" + d.year + "<br/><br/>" +
      varName + " " + "<b>" + d.female + "</br>")
    .style("left", d3.mouse(this)[0] + "px")
    .style("top", (d3.mouse(this)[1] + 28) + "px");
  }

  function hideTooltip() {
    tooltip.transition()
    .duration(tShort)
    .style('opacity', 0);
  }


}
///////////////////////////////////////////////////////////
///////////////      UPDATE     ///////////////////////////
///////////////////////////////////////////////////////////

function updateLineChart(inData, width, height, el){
  var margin = ({top:10, right:10, bottom:40, left:60});
  var barPadding = 0.2;
  var colors = ['#bd6916', '#166abd '];
  var tLong = 450;
  var tShort = 200;

  var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  var svg = d3.selectAll('svg');
  var chartArea = svg.selectAll('.chartArea');
  
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
    .range([0, width]);

  var scaleY = d3.scaleLinear()
    .domain([0, maxY])
    .range([height, 0]);

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

  // Update circles with new datga
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

  // Udpate axes
  svg.select(".y.axis")
    .transition()
    .duration(tLong)
    .call(d3.axisLeft(scaleY));

  svg.select(".x.axis")
    .transition()
    .duration(tLong)
    .call(d3.axisBottom(scaleX)
      .tickFormat(d3.format("")));

  // Update axis titles
  svg.select(".y.axisTitle")
    .transition()
    .duration(tLong)
    .text(varName)
    .style("text-anchor", "middle");


  // Tooltip functions - these will be hoisted to top of fn call
  function showTooltip(d) {
    tooltip.transition()
    .duration(tShort)
    .style('opacity', 0.9);
    tooltip.html(
      "<b>" + "År " + "</b>" + d.year + "<br/><br/>" +
      varName + " " + "<b>" + d.female + "</br>")
    .style("left", d3.mouse(this)[0] + "px")
    .style("top", (d3.mouse(this)[1] + 28) + "px");
  }

  function hideTooltip() {
    tooltip.transition()
    .duration(tShort)
    .style('opacity', 0);
  }

}