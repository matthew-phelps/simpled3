/*jshint esversion: 6 */
function drawLineChart(
  inData,
  width,
  height,
  el,
  margin,
  rectPadding,
  tLong,
  tShort,
  cRadius,
  bigRadius,
  rectSize,
  tablePadding,
  numberFormat,
  titleHeight,
  legendHeight,
  yAxisSpace
) {
  var chartType = "Line";
  var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  var chartAreaHeight = dim.height - legendHeight - titleHeight;
  var xAxisTitleMargin = chartAreaHeight + 33;

  var container = d3
    .select(el)
    .html("")
    .style("position", "relative")
    .append("div")
    .attr("id", "container" + chartType);

  var svg = container
    .append("svg")
    .attr("id", "svg" + chartType)
    .attr("width", dim.width + margin.left + margin.right)
    .attr("height", dim.height + margin.top + margin.bottom);

  var topG = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var chartArea = topG
    .append("g")
    .attr("class", "chartArea")
    .attr("transform", "translate(" + 0 + "," + titleHeight + ")");

  var chartAxes = topG
    .append("g")
    .attr("class", "chartAxes")
    .attr("transform", "translate(" + 0 + "," + titleHeight + ")");

  // Initial axis
  var yAxis = chartAxes.append("g").attr("class", "line y axis");

  var xAxis = chartAxes.append("g").attr("class", "line x axis");

  // Axis titles
  chartAxes
    .append("text")
    .attr("x", dim.width / 2)
    .attr("y", xAxisTitleMargin)
    .attr("alignment-baseline", "hanging")
    .attr("class", "line x axisTitle");

  chartAxes
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - chartAreaHeight / 2)
    .attr("y", 0 - margin.left + (yAxisSpace - 18))
    .attr("class", "line y axisTitle one");

  chartAxes
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - chartAreaHeight / 2)
    .attr("y", 0 - margin.left + yAxisSpace)
    .attr("class", "line y axisTitle two");

  // Data management
  var data = HTMLWidgets.dataframeToD3(inData.data);
  var varName = data[0].variable;
  var yearName = Object.keys(data[0])[0];
  var colors = inData.metaData.colors;

  for (var i = 0; i < data.length; i++) {
    data[i].year = data[i][yearName];
    delete data[i][yearName];
  }
  var grouping1Names = data.map(d => d.year);
  // Split var name just before "per" so that I can manually put labels on two lines
  var varNameSplit = varName.split("  ");

  // Scales
  var maxY = d3.max(data, d => Math.max(d.female, d.male));
  var scaleX = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, dim.width]);

  var scaleXRects = d3
    .scaleBand()
    .domain(grouping1Names)
    .range([0, dim.width])
    .padding(rectPadding);

  var scaleY = d3
    .scaleLinear()
    .domain([0, maxY])
    .range([chartAreaHeight, 0]);

  var scaleColors = d3.scaleOrdinal().range(colors);

  xAxis
    .call(d3.axisBottom(scaleX).tickFormat(d3.format("")))
    .attr("transform", "translate(" + 0 + "," + chartAreaHeight + ")");

  // Line generators
  var valueLine1 = d3
    .line()
    .x(d => scaleX(d.year))
    .y(d => scaleY(d.male));

  var valueLine2 = d3
    .line()
    .x(d => scaleX(d.year))
    .y(d => scaleY(d.female));

  // Add initial line paths
  var line1 = chartArea
    .append("path")
    .datum(data) // use dataum() because appending to single svg element
    .attr("d", valueLine1)
    .attr("fill", "none")
    .attr("stroke", colors[0])
    .attr("stroke-width", 3)
    .attr("class", "line male");

  var line2 = chartArea
    .append("path")
    .datum(data) // use dataum() because appending to single svg element
    .attr("d", valueLine2)
    .attr("fill", "none")
    .attr("stroke", colors[1])
    .attr("stroke-width", "3")
    .attr("class", "line female");

  // Add initial circles
  var circlesMale = chartArea
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", d => "y" + d.year + " dotmale")
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.male))
    .attr("r", cRadius)
    .attr("fill", colors[0]);

  var circlesFemale = chartArea
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", d => "y" + d.year + " dotfemale")
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.female))
    .attr("r", cRadius)
    .attr("fill", colors[1]);

  // Add axes
  yAxis
    .transition()
    .duration(tLong)
    .call(d3.axisLeft(scaleY));

  xAxis
    .transition()
    .duration(tLong)
    .call(d3.axisBottom(scaleX).tickFormat(d3.format("")));

  // Add axis titles
  chartAxes
    .select(".line.y.axisTitle.one")
    .transition()
    .duration(tLong)
    .text(varNameSplit[0])
    .style("text-anchor", "middle");

  chartAxes
    .select(".line.y.axisTitle.two")
    .transition()
    .duration(tLong)
    .text(varNameSplit[1])
    .style("text-anchor", "middle");

  chartAxes
    .select(".line.x.axisTitle")
    .transition()
    .duration(tLong)
    .text(yearName)
    .style("text-anchor", "middle");

  // Invisible rects to trigger mouseover events
  var mouseRectsFemale = chartArea
    .selectAll("g")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "mouseSvg female")
    .attr("x", d => scaleX(d.year) - scaleXRects.bandwidth() / 2)
    .attr("width", scaleXRects.bandwidth())
    .attr("y", 0)
    .attr("height", chartAreaHeight);

  mouseRectsFemale
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);

  /// ADD LEGEND
  var wrapperName = "legendWrapper" + chartType;
  var svgName = "svgLegend" + chartType;
  drawLegend(
    topG,
    inData,
    dim,
    titleHeight,
    legendHeight,
    wrapperName,
    svgName
  );

  // TOOLTIP
  scaffoldTooltip(rectSize, colors, chartType);
  var table = d3.select("#table" + chartType);
  var tooltip = d3.select("#tooltip" + chartType);
  var thead = table.select("th");
  var maleCell = table.select(".maleCell");
  var femaleCell = table.select(".femaleCell");

  // Tooltip functions  - these will be hoisted to top of fn call
  function showTooltip(d) {
    thead.text(d.year);
    maleCell.text(Object.keys(d)[1] + ": " + numberFormat(d.male));
    femaleCell.text(Object.keys(d)[0] + ": " + numberFormat(d.female));

    d3.selectAll(".y" + d.year)
      .transition()
      .ease(d3.easeLinear)
      .duration("200")
      .attr("r", bigRadius);
    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0.9);
  }

  function moveTooltip(d) {
    tooltip
      .style(
        "left",
        d3.select(this).attr("x") - d3.select(this).attr("width") / 3 + "px"
      )
      .style("top", d3.mouse(this)[1] + 50 + "px");
  }

  function hideTooltip(d) {
    d3.selectAll(".y" + d.year)
      .transition()
      .ease(d3.easeLinear)
      .duration("200")
      .attr("r", cRadius);
    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0);
  }
}
///////////////////////////////////////////////////////////
///////////////      UPDATE     ///////////////////////////
///////////////////////////////////////////////////////////

function updateLineChart(
  inData,
  width,
  height,
  el,
  margin,
  rectPadding,
  tLong,
  tShort,
  cRadius,
  bigRadius,
  rectSize,
  tablePadding,
  numberFormat,
  legendHeight,
  titleHeight
) {
  var chartType = "Line";
  var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  var chartAreaHeight = dim.height - legendHeight - titleHeight;
  var svg = d3.select("#container" + chartType).select("svg");
  var chartArea = svg.selectAll(".chartArea");

  var data = HTMLWidgets.dataframeToD3(inData.data);
  var varName = data[0].variable;
  var yearName = Object.keys(data[0])[0];
  var colors = inData.metaData.colors;

  for (var i = 0; i < data.length; i++) {
    data[i].year = data[i][yearName];
    delete data[i][yearName];
  }
  var grouping1Names = data.map(d => d.year);
  // Split var name just before "per" so that I can manually put labels on two lines
  var varNameSplit = varName.split("  ");

  // Line generators
  var valueLine1 = d3
    .line()
    .x(d => scaleX(d.year))
    .y(d => scaleY(d.male));

  var valueLine2 = d3
    .line()
    .x(d => scaleX(d.year))
    .y(d => scaleY(d.female));

  // Scales
  var maxY = d3.max(data, d => Math.max(d.female, d.male));
  var scaleX = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, dim.width]);

  var scaleXRects = d3
    .scaleBand()
    .domain(grouping1Names)
    .range([0, dim.width])
    .padding(rectPadding);

  var scaleY = d3
    .scaleLinear()
    .domain([0, maxY])
    .range([chartAreaHeight, 0]);

  var scaleColors = d3.scaleOrdinal().range(colors);

  // Update line paths with new data
  chartArea
    .select(".line.male")
    .transition()
    .duration(tLong)
    .attr("d", valueLine1(data));

  chartArea
    .select(".line.female")
    .transition()
    .duration(tLong)
    .attr("d", valueLine2(data));

  // Update circles with new data
  var dotFemale = chartArea.selectAll(".dotfemale").data(data);

  dotFemale
    .exit()
    .transition()
    .duration(tLong)
    .attr("cx", d => scaleX(2013))
    .remove();

  dotFemale
    .enter()
    .append("circle")
    .attr("class", d => "y" + d.year + " dotfemale")
    .merge(dotFemale)
    .transition()
    .duration(tLong)
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.female))
    .attr("r", cRadius)
    .attr("fill", colors[1]);

 /* dotFemale
    .transition()
    .duration(tLong)
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.female));*/

  dotFemale.on("mouseover", showTooltip).on("mouseout", hideTooltip);

var dotMale =   chartArea
    .selectAll(".dotmale")
    .data(data);

  dotMale
    .exit()
    .transition()
    .duration(tLong)
    .attr("cx", d => scaleX(2013))
    .remove();

  dotMale
  .enter()
  .append("circle")
    .attr("class", d => "y" + d.year + " dotmale")
    .merge(dotMale)
    .transition()
    .duration(tLong)
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.male))
    .attr("r", cRadius)
    .attr("fill", colors[0]);




  // Larger invisible circles to trigger mouseover events
  var mouseRectsFemale = chartArea
    .selectAll(".mouseSvg.female")
    .data(data)
    .attr("x", d => scaleX(d.year) - scaleXRects.bandwidth() / 2)
    .attr("width", scaleXRects.bandwidth())
    .attr("y", 0)
    .attr("height", chartAreaHeight)
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);

  // Udpate axes
  svg
    .select(".line.y.axis")
    .transition()
    .duration(tLong)
    .call(d3.axisLeft(scaleY));

  svg
    .select(".line.x.axis")
    .transition()
    .duration(tLong)
    .call(d3.axisBottom(scaleX).tickFormat(d3.format("")));

  // Update axis titles
  svg
    .select(".line.y.axisTitle.one")
    .transition()
    .duration(tLong)
    .text(varNameSplit[0])
    .style("text-anchor", "middle");

  svg
    .select(".line.y.axisTitle.two")
    .transition()
    .duration(tLong)
    .text(varNameSplit[1])
    .style("text-anchor", "middle");

  /*Update plot title*/
  var wrapperName = "legendWrapper" + chartType;
  var svgName = "svgLegend" + chartType;
  updateLegend(inData, wrapperName, svgName, tLong);

  // Tooltip
  var table = d3.select("#table" + chartType);
  var tooltip = d3.select("#tooltip" + chartType);
  var thead = table.select("th");
  var maleCell = table.select(".maleCell");
  var femaleCell = table.select(".femaleCell");

  function showTooltip(d) {
    thead.text(d.year);
    maleCell.text(Object.keys(d)[1] + ": " + numberFormat(d.male));
    femaleCell.text(Object.keys(d)[0] + ": " + numberFormat(d.female));

    d3.selectAll(".y" + d.year)
      .transition()
      .ease(d3.easeLinear)
      .duration("200")
      .attr("r", bigRadius);
    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0.9);
  }

  function moveTooltip(d) {
    tooltip
      .style(
        "left",
        d3.select(this).attr("x") - d3.select(this).attr("width") / 3 + "px"
      )
      .style("top", d3.mouse(this)[1] + 50 + "px");
  }

  function hideTooltip(d) {
    d3.selectAll(".y" + d.year)
      .transition()
      .ease(d3.easeLinear)
      .duration("200")
      .attr("r", cRadius);
    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0);
  }
}

///////////////////////////////////////////////////////////
///////////////      RESIZE     ///////////////////////////
///////////////////////////////////////////////////////////

function resizeLineChart(
  inData,
  width,
  height,
  el,
  margin,
  rectPadding,
  tLong,
  tShort,
  cRadius,
  bigRadius,
  rectSize,
  tablePadding,
  numberFormat,
  legendHeight,
  titleHeight,
  yAxisSpace
) {
  var chartType = "Line";
  var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  var chartAreaHeight = dim.height - legendHeight - titleHeight;
  var xAxisTitleMargin = chartAreaHeight + 33;

  var data = HTMLWidgets.dataframeToD3(inData.data);
  var varName = data[0].variable;
  var yearName = Object.keys(data[0])[0];
  var colors = inData.metaData.colors;

  for (var i = 0; i < data.length; i++) {
    data[i].year = data[i][yearName];
    delete data[i][yearName];
  }
  var grouping1Names = data.map(d => d.year);

  var svg = d3
    .select("#container" + chartType)
    .select("svg")
    .attr("width", dim.width + margin.left + margin.right)
    .attr("height", dim.height + margin.top + margin.bottom);
  var chartArea = svg.select(".chartArea");

  svg
    .select("line.x.axisTitle")
    .attr("x", dim.width / 2)
    .attr("y", xAxisTitleMargin);

  svg
    .select("line.y.axisTitle.one")
    .attr("x", 0 - chartAreaHeight / 2)
    .attr("y", 0 - margin.left + (yAxisSpace - 18));
  svg
    .select("line.y.axisTitle.two")
    .attr("x", 0 - chartAreaHeight / 2)
    .attr("y", 0 - margin.left + yAxisSpace);

  // Line generators
  var valueLine1 = d3
    .line()
    .x(d => scaleX(d.year))
    .y(d => scaleY(d.male));

  var valueLine2 = d3
    .line()
    .x(d => scaleX(d.year))
    .y(d => scaleY(d.female));

  // Scales
  var maxY = d3.max(data, d => Math.max(d.female, d.male));
  var scaleX = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, dim.width]);

  var scaleXRects = d3
    .scaleBand()
    .domain(grouping1Names)
    .range([0, dim.width])
    .padding(rectPadding);

  var scaleY = d3
    .scaleLinear()
    .domain([0, maxY])
    .range([chartAreaHeight, 0]);

  var scaleColors = d3.scaleOrdinal().range(colors);

  // Resize line paths with new size
  chartArea
    .select(".line.male")
    .transition()
    .duration(tLong)
    .attr("d", valueLine1(data));

  chartArea
    .select(".line.female")
    .transition()
    .duration(tLong)
    .attr("d", valueLine2(data));

  // Re-position circles with new size
  chartArea
    .selectAll(".dotfemale")
    .transition()
    .duration(tLong)
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.female));

  chartArea
    .selectAll(".dotmale")
    .transition()
    .duration(tLong)
    .attr("cx", d => scaleX(d.year))
    .attr("cy", d => scaleY(d.male));

  // Larger invisible circles to trigger mouseover events
  var mouseRectsFemale = chartArea
    .selectAll(".mouseSvg.female")
    .attr("x", d => scaleX(d.year) - scaleXRects.bandwidth() / 2)
    .attr("width", scaleXRects.bandwidth())
    .attr("y", 0)
    .attr("height", chartAreaHeight)
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);

  // Udpate axes
  svg
    .select(".line.y.axis")
    .transition()
    .duration(tLong)
    .call(d3.axisLeft(scaleY));

  svg
    .select(".line.x.axis")
    .transition()
    .duration(tLong)
    .call(d3.axisBottom(scaleX).tickFormat(d3.format("")));

  // Resize legend
  var wrapperName = "legendWrapper" + chartType;
  resizeLegend(dim, wrapperName);

  var table = d3.select("#table" + chartType);
  var tooltip = d3.select("#tooltip" + chartType);
  var thead = table.select("th");
  var maleCell = table.select(".maleCell");
  var femaleCell = table.select(".femaleCell");

  // Tooltip functions  - these will be hoisted to top of fn call
  function showTooltip(d) {
    thead.text(d.year);
    maleCell.text(Object.keys(d)[1] + ": " + numberFormat(d.male));
    femaleCell.text(Object.keys(d)[0] + ": " + numberFormat(d.female));

    d3.selectAll(".y" + d.year)
      .transition()
      .ease(d3.easeLinear)
      .duration("200")
      .attr("r", bigRadius);
    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0.9);
  }

  function moveTooltip(d) {
    tooltip
      .style(
        "left",
        d3.select(this).attr("x") - d3.select(this).attr("width") / 3 + "px"
      )
      .style("top", d3.mouse(this)[1] + 50 + "px");
  }

  function hideTooltip(d) {
    d3.selectAll(".y" + d.year)
      .transition()
      .ease(d3.easeLinear)
      .duration("200")
      .attr("r", cRadius);
    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0);
  }
}
