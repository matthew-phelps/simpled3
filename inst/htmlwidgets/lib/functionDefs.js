/*jshint esversion: 6 */
function drawBarChart(
  inData,
  width,
  height,
  el,
  margin,
  barPadding,
  tLong,
  tShort,
  mOpacity,
  rectSize,
  tablePadding,
  numberFormat,
  legendHeight,
  titleHeight,
  yAxisSpace,
  xAxisSpace
) {
  var dim = {
   innerWidth: width - margin.left - margin.right,
    innerHeight: height - margin.top - margin.bottom
  };

  var chartType = "Bar";

  var chartAreaHeight = dim.height - legendHeight - titleHeight;

  var xAxisTitleMargin = chartAreaHeight + xAxisSpace;
  var container = d3
    .select(el)
    .style("position", "relative")
    .append("div")
    .attr("id", "container" + chartType);

  var svg = container
    .append("svg")
    .attr("id", "svg" + chartType)
    .attr("width", width)
    .attr("height", height);

  var topG = svg
    .append("g")
    .attr("id", "topG")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

///// TESTING to see where stuff falls /////
topG.append("rect")
  .attr("class", "inner")
  .attr("width", dim.innerWidth)
  .attr("height", dim.innerHeight)
  .attr("fill", "white")
  .attr("stroke", "black");
///////////////////////////////////


  var chartArea = topG
    .append("g")
    .attr("class", "chartArea");

  var chartAxes = topG
    .append("g")
    .attr("class", "chartAxes");


/// ADD LEGEND AND TITLE
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


  // Initial axis
  var yAxis = chartAxes.append("g").attr("class", "bar y axis plot_text");
  var xAxis = chartAxes.append("g").attr("class", "bar x axis plot_text");

  // X axis titles
  chartAxes
    .append("text")
    .attr("x", dim.innerWidth / 2)
    .attr("y", dim.innerHeight )
    .attr("alignment-baseline", "hanging")
    .attr("class", "bar x axisTitle plot_text");

// Y axis titles (2 rows)
  chartAxes
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - dim.innerHeight /2)
    .attr("y", -18)
    .attr("class", "bar y axisTitle one plot_text");

  chartAxes
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - dim.innerHeight   / 2)
    .attr("y", -yAxisSpace)
    .attr("class", "bar y axisTitle two plot_text");

  // Data management
  var data = HTMLWidgets.dataframeToD3(inData.data);
  var groupingName = Object.keys(data[0])[1];
  var varName = Object.keys(data[0])[2];
  var sexName = Object.keys(data[0])[0];
  var colors = inData.metaData.colors;

  // Variable/key names may changes, so standardized them
  var newData = dataManagement(data, sexName, groupingName, varName);

  // Split var name just before "per" so that I can manually put labels on two lines
  var varNameSplit = varName.split("  ");

  grouping1Names = newData.map(d => d.key);
  grouping2Names = newData[0].values.map(d => d.sex);

  // Scales
  var maxY = d3.max(newData, d => d3.max(d.values, k => k.value));
  var scaleY = d3
    .scaleLinear()
    .domain([0, maxY])
    .range([chartAreaHeight, 0]);

  var scaleX = d3
    .scaleBand()
    .domain(grouping1Names)
    .range([0, dim.width])
    .padding(barPadding);

  var scaleX1 = d3
    .scaleBand()
    .domain(grouping2Names)
    .rangeRound([0, scaleX.bandwidth()]);

  var scaleColors = d3.scaleOrdinal().range(colors);

  // Perform the data joins for visibile elements
  var barGroupWithData = chartArea.selectAll("g").data(newData, d => d.key);

  // Remove any bar-groups not present in incoming data
  barGroupWithData
    .exit()
    .transition()
    .duration(tShort)
    .ease(d3.easeLinear)
    .style("opacity", 0)
    .remove();

  var barsData = barGroupWithData
    .enter()
    .append("g")
    .attr("class", d => "barGroups " + d.mouseSvgName)
    .merge(barGroupWithData)
    .attr("transform", d => "translate(" + scaleX(d.key) + ",0)");

  // Visible bars
  var bars = barsData.selectAll("rect").data(d =>
    Object.keys(d.values).map(k => ({
      keyL2: grouping2Names[k],
      value: d.values[k].value
    }))
  );

  bars
    .exit()
    .transition()
    .duration(tLong)
    .attr("y", d => scaleY(0))
    .remove();

  var barsEntered = bars
    .enter()
    .append("rect")
    .attr("class", "bars")
    .attr("fill", d => scaleColors(d.keyL2))
    .attr("y", d => scaleY(0))
    .merge(bars)
    .attr("x", d => scaleX1(d.keyL2))
    .transition()
    .duration(tLong)
    .ease(d3.easeLinear)
    .attr("width", scaleX1.bandwidth())
    .attr("y", d => scaleY(d.value))
    .attr("height", d => scaleY(0) - scaleY(d.value));

  // Data join for mouseover elements - invisible to user
  var mouseSvg = chartArea.selectAll(".mouseSvg").data(newData, d => d.key);

  mouseSvg.exit().remove();
  mouseSvg
    .enter()
    .append("rect")
    // Need to give unique non-numeric class to each rect
    .attr("class", d => "mouseSvg " + d.mouseSvgName)
    .attr("x", d => scaleX(d.key))
    .attr("width", scaleX.bandwidth())
    .attr("y", 0)
    .attr("height", chartAreaHeight)
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);

  // Add axes
  yAxis.transition().call(d3.axisLeft(scaleY));

  xAxis
    .call(d3.axisBottom(scaleX))
    .attr("transform", "translate(0," + chartAreaHeight + ")");

  if (newData.length > 10) {
    xAxis
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
  }

  /*Wrap x axis labels*/
  chartAxes.selectAll(".tick text").call(wrap, scaleX.bandwidth());

  // Add axes titles
  chartAxes
    .select(".bar.y.axisTitle.one")
    .transition()
    .duration(tLong)
    .text(varNameSplit[0])
    .style("text-anchor", "middle");

  chartAxes
    .select(".bar.y.axisTitle.two")
    .transition()
    .duration(tLong)
    .text(varNameSplit[1])
    .style("text-anchor", "middle");

  chartAxes
    .select(".bar.x.axisTitle")
    .transition()
    .duration(tLong)
    .style("opacity", 1)
    .text(groupingName)
    .style("text-anchor", "middle");

  

  // TOOLTIP
  scaffoldTooltip(rectSize, colors, chartType);
  var table = d3.select("#table" + chartType);
  var tooltip = d3.select("#tooltip" + chartType);
  var thead = table.select("th");
  var maleCell = table.select(".maleCell");
  var femaleCell = table.select(".femaleCell");

  function showTooltip(d) {
    thead.text(d.key);
    maleCell.text(d.values[0].sex + ": " + numberFormat(d.values[0].value));
    femaleCell.text(d.values[1].sex + ": " + numberFormat(d.values[1].value));

    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0.9);
    d3.select(".mouseSvg" + "." + d.mouseSvgName).style("opacity", 0);

    d3.select(".barGroups" + "." + d.mouseSvgName)
      .append("line")
      .attr("class", "guide")
      .attr("x1", scaleX1.bandwidth())
      .attr("x2", scaleX1.bandwidth())
      .attr("y1", 0)
      .attr("y2", chartAreaHeight);
  }

  function moveTooltip(d) {
    tooltip
      .style("left", d3.select(this).attr("x") + "px")
      .style("top", d3.mouse(this)[1] + 50 + "px");
  }

  function hideTooltip(d) {
    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0);
    d3.select(".mouseSvg" + "." + d.mouseSvgName)
      .transition()
      .duration(tShort)
      .style("opacity", mOpacity);
    d3.selectAll(".guide").remove();
  }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////    UPDATE     /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function updateBarChart(
  inData,
  width,
  height,
  el,
  margin,
  barPadding,
  tLong,
  tShort,
  mOpacity,
  numberFormat,
  legendHeight,
  titleHeight
) {
  var chartType = "Bar";
  var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  svg = d3.select("#container" + chartType).select("svg");
  var chartArea = svg.selectAll(".chartArea");

  var wrapperName = "legendWrapper" + chartType;
  var svgName = "svgLegend" + chartType;

  // Data management
  var data = HTMLWidgets.dataframeToD3(inData.data);
  var groupingName = Object.keys(data[0])[1];
  var varName = Object.keys(data[0])[2];
  var sexName = Object.keys(data[0])[0];
  var colors = inData.metaData.colors;

  // Variable/key names may changes, so standardized them
  var newData = dataManagement(data, sexName, groupingName, varName);

  // Split var name just before "per" so that I can manually put labels on two lines
  var varNameSplit = varName.split("  ");

  var maxY = d3.max(newData, d => d3.max(d.values, k => k.value));
  grouping1Names = newData.map(d => d.key);
  grouping2Names = newData[0].values.map(d => d.sex);

  /*Chart height needs to be smaller for rotated text labels - but only for those labels*/
  var chartInitHeight = dim.height - legendHeight - titleHeight;
  var chartHeightReduction = 50;
  if (newData.length > 10) {
    var chartAreaHeight = chartInitHeight - chartHeightReduction;
  } else {
    var chartAreaHeight = chartInitHeight;
  }

  // Scales
  var scaleY = d3
    .scaleLinear()
    .domain([0, maxY])
    .range([chartAreaHeight, 0]);

  var scaleX = d3
    .scaleBand()
    .domain(grouping1Names)
    .range([0, dim.width])
    .padding(barPadding);

  var scaleX1 = d3
    .scaleBand()
    .domain(grouping2Names)
    .rangeRound([0, scaleX.bandwidth()]);

  var scaleColors = d3.scaleOrdinal().range(colors);

  // Perform the data joins
  var barGroupWithData = chartArea.selectAll("g").data(newData, d => d.key);

  // Remove any bar-groups not present in incoming data
  barGroupWithData
    .exit()
    .transition()
    .duration(tShort)
    .ease(d3.easeLinear)
    .style("opacity", 0)
    .remove();

  var barsData = barGroupWithData
    .enter()
    .append("g")
    .attr("class", d => "barGroups " + d.mouseSvgName)
    .merge(barGroupWithData);

  barsData
    .attr("transform", d => "translate(" + scaleX(d.key) + ",0)")
    .transition()
    .duration(tLong);

  barGroupWithData.selectAll(".mouseSvg").remove();

  var bars = barsData.selectAll("rect").data(d =>
    Object.keys(d.values).map(k => ({
      keyL2: grouping2Names[k],
      value: d.values[k].value
    }))
  );

  // This seemingly does nothing
  bars
    .exit()
    .transition()
    .duration(tLong)
    .attr("y", d => scaleY(0))
    .remove();

  var barsEntered = bars
    .enter()
    .append("rect")
    .attr("class", "bars")
    .attr("fill", d => scaleColors(d.keyL2))
    .attr("y", d => scaleY(0))
    .merge(bars)
    .attr("x", d => scaleX1(d.keyL2))
    .transition()
    .duration(tLong)
    .ease(d3.easeLinear)
    .attr("width", scaleX1.bandwidth())
    .attr("y", d => scaleY(d.value))
    .attr("height", d => scaleY(0) - scaleY(d.value));

  // Data join for mouseover elements - invisible to user
  var mouseSvg = chartArea.selectAll(".mouseSvg").data(newData, d => d.key);

  mouseSvg.exit().remove();
  mouseSvg
    .enter()
    .append("rect")
    .merge(mouseSvg)
    // Need to give unique non-numeric class to each rect
    .attr("class", d => "mouseSvg " + d.mouseSvgName)
    .attr("x", d => scaleX(d.key))
    .attr("width", scaleX.bandwidth())
    .attr("y", 0)
    .attr("height", dim.height - legendHeight)
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);

  // Remove old x-labels
  svg.selectAll(".bar.x.axis").remove();

  var xAxis = svg
    .select(".chartAxes")
    .append("g")
    .attr("class", "bar x axis plot_text")
    .call(d3.axisBottom(scaleX))
    .attr("transform", "translate(0," + chartAreaHeight + ")");

  if (newData.length > 10) {
    xAxis
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dx", "-1.6em")
      .attr("transform", "rotate(-70)")
      .style("text-anchor", "end")
      .style("font-size", "1.1rem");
  } else {
    xAxis.selectAll(".tick text").call(wrap, scaleX.bandwidth());
  }

  svg
    .selectAll(".bar.y.axis")
    .transition()
    .duration(tShort)
    .call(d3.axisLeft(scaleY));

  // Axis titles
  d3.selectAll(".bar.x.axisTitle")
    .transition()
    .duration(tLong)
    .text(groupingName)
    .style("text-anchor", "middle");

  d3.selectAll(".bar.y.axisTitle.one")
    .transition()
    .duration(tLong)
    .text(varNameSplit[0])
    .style("text-anchor", "middle");

  d3.selectAll(".bar.y.axisTitle.two")
    .transition()
    .duration(tLong)
    .text(varNameSplit[1])
    .style("text-anchor", "middle");

  /*Update plot title*/
  updateLegend(inData, wrapperName, svgName, tLong);

  /* Tooltip functions. These should be hoisted to top of updateChart() function
  call, and therefore accessible at anytime from inside updateChart() */

  var table = d3.select("#table" + chartType);
  var tooltip = d3.select("#tooltip" + chartType);
  var thead = table.select("th");
  var maleCell = table.select(".maleCell");
  var femaleCell = table.select(".femaleCell");

  function showTooltip(d) {
    thead.text(d.key);
    maleCell.text(d.values[0].sex + ": " + numberFormat(d.values[0].value));
    femaleCell.text(d.values[1].sex + ": " + numberFormat(d.values[1].value));

    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0.9);
    d3.select(".mouseSvg" + "." + d.mouseSvgName).style("opacity", 0);
    d3.select(".barGroups" + "." + d.mouseSvgName)
      .append("line")
      .attr("class", "guide")
      .attr("x1", scaleX1.bandwidth())
      .attr("x2", scaleX1.bandwidth())
      .attr("y1", 0)
      .attr("y2", chartAreaHeight);
  }

  function moveTooltip(d) {
    tooltip
      .style("left", d3.select(this).attr("x") + "px")
      .style("top", d3.mouse(this)[1] + 50 + "px");
  }

  function hideTooltip(d) {
    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0);
    d3.select(".mouseSvg" + "." + d.mouseSvgName)
      .transition()
      .duration(tShort)
      .style("opacity", mOpacity);
    d3.selectAll(".guide").remove();
  }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////    RESIZE     /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function resizeBarChart(
  inData,
  width,
  height,
  el,
  margin,
  barPadding,
  tLong,
  tShort,
  mOpacity,
  numberFormat,
  legendHeight,
  titleHeight,
  yAxisSpace,
  xAxisSpace
) {
  var chartType = "Bar";
  var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  var data = HTMLWidgets.dataframeToD3(inData.data);
  var groupingName = Object.keys(data[0])[1];
  var varName = Object.keys(data[0])[2];
  var sexName = Object.keys(data[0])[0];
  var colors = inData.metaData.colors;

  var newData = dataManagement(data, sexName, groupingName, varName);

  // Split var name just before "per" so that I can manually put labels on two lines
  var varNameSplit = varName.split("  ");

  var maxY = d3.max(newData, d => d3.max(d.values, k => k.value));
  grouping1Names = newData.map(d => d.key);
  grouping2Names = newData[0].values.map(d => d.sex);

  var chartInitHeight = dim.height - legendHeight - titleHeight;
  var xAxisTitleMargin = chartInitHeight + xAxisSpace;
  var chartHeightReduction = 50;
  if (newData.length > 10) {
    var chartAreaHeight = chartInitHeight - chartHeightReduction;
  } else {
    var chartAreaHeight = chartInitHeight;
  }

  var svg = d3
    .select("#container" + chartType)
    .select("svg")
    .attr("width", dim.width + margin.left + margin.right)
    .attr("height", dim.height + margin.top + margin.bottom);

  // Axis titles
  d3.selectAll(".bar.x.axisTitle")
    .attr("x", dim.width / 2)
    .attr("y", xAxisTitleMargin);

  d3.selectAll(".bar.y.axisTitle.one")
    .attr("x", 0 - chartAreaHeight / 2)
    .attr("y", 0 - margin.left + (yAxisSpace - 18));
  d3.selectAll(".bar.y.axisTitle.two")
    .attr("x", 0 - chartAreaHeight / 2)
    .attr("y", 0 - margin.left + yAxisSpace);

  // SCALES
  var scaleY = d3
    .scaleLinear()
    .domain([0, maxY])
    .range([chartAreaHeight, 0]);

  var scaleX = d3
    .scaleBand()
    .domain(grouping1Names)
    .range([0, dim.width])
    .padding(barPadding);

  var scaleX1 = d3
    .scaleBand()
    .domain(grouping2Names)
    .rangeRound([0, scaleX.bandwidth()]);

  // BAR GROUPS
  svg
    .selectAll(".barGroups")
    .transition()
    .duration(tShort)
    .attr("transform", d => "translate(" + scaleX(d.key) + ",0)");

  // BARS
  svg
    .selectAll(".bars")
    .transition()
    .duration(tShort)
    .attr("x", d => scaleX1(d.keyL2))
    .attr("width", scaleX1.bandwidth())
    .attr("y", d => scaleY(d.value))
    .attr("height", d => scaleY(0) - scaleY(d.value));

  // MOUSE SVG RECT
  var mouseSvg = svg.selectAll(".mouseSvg");

  mouseSvg
    .transition()
    .duration(tShort)
    .attr("x", d => scaleX(d.key))
    .attr("width", scaleX.bandwidth())
    .attr("y", 0)
    .attr("height", chartAreaHeight);

  mouseSvg
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);

  // Resize Axes
  // Remove old x-labels
  svg.selectAll(".bar.x.axis").remove();

  var xAxis = svg
    .select(".chartAxes")
    .append("g")
    .attr("class", "bar x axis plot_text")
    .call(d3.axisBottom(scaleX))
    .attr("transform", "translate(0," + chartAreaHeight + ")");

  if (newData.length > 10) {
    xAxis
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dx", "-1.6em")
      .attr("transform", "rotate(-70)")
      .style("text-anchor", "end")
      .style("font-size", "1.1rem");
  } else {
    xAxis.selectAll(".tick text").call(wrap, scaleX.bandwidth());
  }


  svg
    .selectAll(".bar.y.axis")
    .transition()
    .duration(tShort)
    .call(d3.axisLeft(scaleY));

  // Resize legend
  var wrapperName = "legendWrapperBar";
  resizeLegend(dim, wrapperName);

  /* Tooltip functions. These should be hoisted to top of resizeChart() function
  call, and therefore accessible at anytime from inside resizeChart() */
  var table = d3.select("#table" + chartType);
  var tooltip = d3.select("#tooltip" + chartType);
  var thead = table.select("th");
  var maleCell = table.select(".maleCell");
  var femaleCell = table.select(".femaleCell");

  function showTooltip(d) {
    thead.text(d.key);
    maleCell.text(d.values[0].sex + ": " + numberFormat(d.values[0].value));
    femaleCell.text(d.values[1].sex + ": " + numberFormat(d.values[1].value));

    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0.9);
    d3.select(".mouseSvg" + "." + d.mouseSvgName).style("opacity", 0);
    d3.select(".barGroups" + "." + d.mouseSvgName)
      .append("line")
      .attr("class", "guide")
      .attr("x1", scaleX1.bandwidth())
      .attr("x2", scaleX1.bandwidth())
      .attr("y1", 0)
      .attr("y2", chartAreaHeight);
  }

  function moveTooltip(d) {
    tooltip
      .style("left", d3.select(this).attr("x") + "px")
      .style("top", d3.mouse(this)[1] + 50 + "px");
  }

  function hideTooltip(d) {
    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0);
    d3.select(".mouseSvg" + "." + d.mouseSvgName)
      .transition()
      .duration(tShort)
      .style("opacity", mOpacity);
    d3.selectAll(".guide").remove();
  }
}

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//                       FUNCTIONS                                 //
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

/*Text wrap frunction*/
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
      words = text
        .text()
        .split(/\s+/)
        .reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em");
  i = 0; // set up counter
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width && i > 0) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
      i++ // increment word count
    }
  });
}
