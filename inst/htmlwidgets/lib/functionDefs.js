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
  titleHeight
) {
  var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  var chartType = "Bar";

  var chartAreaHeight = dim.height - legendHeight - titleHeight;

  var xAxisTitleMargin = chartAreaHeight + 30;
  var container = d3
    .select(el)
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
  var yAxis = chartAxes.append("g").attr("class", "bar y axis plot_text");
  var xAxis = chartAxes.append("g").attr("class", "bar x axis plot_text");

  // Axis titles
  chartAxes
    .append("text")
    .attr("x", dim.width / 2)
    .attr("y", chartAreaHeight + 25)
    .attr("alignment-baseline", "hanging")
    .attr("class", "bar x axisTitle plot_text");

  chartAxes
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - chartAreaHeight / 2)
    .attr("y", 0 - margin.left + 30)
    .attr("class", "bar y axisTitle plot_text");

  // Data management
  var data = HTMLWidgets.dataframeToD3(inData.data);
  var groupingName = Object.keys(data[0])[1];
  var varName = Object.keys(data[0])[2];
  var sexName = Object.keys(data[0])[0];
  var colors = inData.metaData.colors;
  // Variable/key names may changes, so standardized them
  for (var i = 0; i < data.length; i++) {
    data[i].sex = data[i][sexName];
    data[i].grouping = data[i][groupingName];
    data[i].value = data[i][varName];
    delete data[i][sexName];
    delete data[i][varName];
    delete data[i][groupingName];
  }

  var newData = d3
    .nest()
    .key(d => d.grouping)
    .entries(data);

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
    .attr("class", d => "barGroups " + "i" + d.key.slice(0, 2))
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
    .attr("class", d => "mouseSvg " + "i" + d.key.slice(0, 2))
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

  // Add axes titles
  chartAxes
    .select(".bar.y.axisTitle")
    .transition()
    .duration(tLong)
    .text(varName)
    .style("text-anchor", "middle");

  chartAxes
    .select(".bar.x.axisTitle")
    .transition()
    .duration(tLong)
    .style("opacity", 1)
    .text(groupingName)
    .style("text-anchor", "middle");

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

  function showTooltip(d) {
    thead.text(groupingName + ": " + d.key);
    maleCell.text(d.values[0].sex + ": " + numberFormat(d.values[0].value));
    femaleCell.text(d.values[1].sex + ": " + numberFormat(d.values[1].value));

    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0.9);
    d3.select(".mouseSvg" + ".i" + d.key.slice(0, 2)).style(
      "opacity",
      mOpacity
    );
    d3.select(".barGroups" + ".i" + d.key.slice(0, 2))
      .append("line")
      .attr("class", "guide")
      .attr("x1", scaleX1.bandwidth())
      .attr("x2", scaleX1.bandwidth())
      .attr("y1", 0)
      .attr("y2", chartAreaHeight);
  }

  function moveTooltip(d) {
    tooltip
      .style("left", d3.mouse(this)[0] + "px")
      .style("top", d3.mouse(this)[1] + 50 + "px");
  }

  function hideTooltip(d) {
    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0);
    d3.select(".mouseSvg" + ".i" + d.key.slice(0, 2))
      .transition()
      .duration(tShort)
      .style("opacity", 0.0);
    d3.selectAll(".guide")
      .transition()
      .duration(tShort)
      .style("opacity", 0)
      .remove();
  }

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
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
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
      }
    });
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

  var chartAreaHeight = dim.height - legendHeight - titleHeight;
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
  for (var i = 0; i < data.length; i++) {
    data[i].sex = data[i][sexName];
    data[i].grouping = data[i][groupingName];
    data[i].value = data[i][varName];
    delete data[i][sexName];
    delete data[i][varName];
    delete data[i][groupingName];
  }

  var newData = d3
    .nest()
    .key(d => d.grouping)
    .entries(data);

  var maxY = d3.max(newData, d => d3.max(d.values, k => k.value));
  grouping1Names = newData.map(d => d.key);
  grouping2Names = newData[0].values.map(d => d.sex);

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
    .attr("class", d => "barGroups " + "i" + d.key.slice(0, 2))
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
    .attr("class", d => "mouseSvg " + "i" + d.key.slice(0, 2))
    .attr("x", d => scaleX(d.key))
    .attr("width", scaleX.bandwidth())
    .attr("y", 0)
    .attr("height", dim.height - legendHeight)
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);

  // Update axes scales
  svg
    .selectAll(".bar.x.axis")
    .transition()
    .duration(tShort)
    .call(d3.axisBottom(scaleX));

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

  d3.selectAll(".bar.y.axisTitle")
    .transition()
    .duration(tLong)
    .text(varName)
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
    thead.text(groupingName + ": " + d.key);
    maleCell.text(d.values[0].sex + ": " + numberFormat(d.values[0].value));
    femaleCell.text(d.values[1].sex + ": " + numberFormat(d.values[1].value));

    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0.9);
    d3.select(".mouseSvg" + ".i" + d.key.slice(0, 2)).style(
      "opacity",
      mOpacity
    );
    d3.select(".barGroups" + ".i" + d.key.slice(0, 2))
      .append("line")
      .attr("class", "guide")
      .attr("x1", scaleX1.bandwidth())
      .attr("x2", scaleX1.bandwidth())
      .attr("y1", 0)
      .attr("y2", chartAreaHeight);
  }

  function moveTooltip(d) {
    tooltip
      .style("left", d3.mouse(this)[0] + "px")
      .style("top", d3.mouse(this)[1] + 50 + "px");
  }

  function hideTooltip(d) {
    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0);
    d3.select(".mouseSvg" + ".i" + d.key.slice(0, 2))
      .transition()
      .duration(tShort)
      .style("opacity", 0.0);
    d3.selectAll(".guide")
      .transition()
      .duration(tShort)
      .style("opacity", 0)
      .remove();
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
  titleHeight
) {
  var chartType = "Bar";
  var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  var chartAreaHeight = dim.height - legendHeight - titleHeight;
  var xAxisTitleMargin = chartAreaHeight + 25;

  var svg = d3
    .select("#container" + chartType)
    .select("svg")
    .attr("width", dim.width + margin.left + margin.right)
    .attr("height", dim.height + margin.top + margin.bottom);

  // Axis titles
  d3.selectAll(".bar.x.axisTitle")
    .attr("x", dim.width / 2)
    .attr("y", xAxisTitleMargin);

  d3.selectAll(".bar.y.axisTitle")
    .attr("x", 0 - chartAreaHeight / 2)
    .attr("y", 0 - margin.left + 20);

  var data = HTMLWidgets.dataframeToD3(inData.data);
  var groupingName = Object.keys(data[0])[1];
  var varName = Object.keys(data[0])[2];
  var sexName = Object.keys(data[0])[0];
  var colors = inData.metaData.colors;

  for (var i = 0; i < data.length; i++) {
    data[i].sex = data[i][sexName];
    data[i].grouping = data[i][groupingName];
    data[i].value = data[i][varName];
    delete data[i][sexName];
    delete data[i][varName];
    delete data[i][groupingName];
  }

  var newData = d3
    .nest()
    .key(d => d.grouping)
    .entries(data);

  var maxY = d3.max(newData, d => d3.max(d.values, k => k.value));
  grouping1Names = newData.map(d => d.key);
  grouping2Names = newData[0].values.map(d => d.sex);

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
  svg
    .selectAll(".bar.x.axis")
    .transition()
    .duration(tShort)
    .call(d3.axisBottom(scaleX));

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
    thead.text(groupingName + ": " + d.key);
    maleCell.text(d.values[0].sex + ": " + numberFormat(d.values[0].value));
    femaleCell.text(d.values[1].sex + ": " + numberFormat(d.values[1].value));

    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0.9);
    d3.select(".mouseSvg" + ".i" + d.key.slice(0, 2)).style(
      "opacity",
      mOpacity
    );
    d3.select(".barGroups" + ".i" + d.key.slice(0, 2))
      .append("line")
      .attr("class", "guide")
      .attr("x1", scaleX1.bandwidth())
      .attr("x2", scaleX1.bandwidth())
      .attr("y1", 0)
      .attr("y2", chartAreaHeight);
  }

  function moveTooltip(d) {
    tooltip
      .style("left", d3.mouse(this)[0] + "px")
      .style("top", d3.mouse(this)[1] + 50 + "px");
  }

  function hideTooltip(d) {
    tooltip
      .transition()
      .duration(tShort)
      .style("opacity", 0);
    d3.select(".mouseSvg" + ".i" + d.key.slice(0, 2))
      .transition()
      .duration(tShort)
      .style("opacity", 0.0);
    d3.selectAll(".guide")
      .transition()
      .duration(tShort)
      .style("opacity", 0)
      .remove();
  }
}
