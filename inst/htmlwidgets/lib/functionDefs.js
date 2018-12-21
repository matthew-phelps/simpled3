/*jshint esversion: 6 */
function drawBarChart(inData, width, height, el, margin, colors, barPadding, tLong, tShort, mOpacity, rectSize, tablePadding) {

  var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };
  var container = d3.select(el).style("position", "relative")
    .append('div')
    .attr("id", "containerBar");

  var svg = container.append('svg')
    .attr("width", dim.width + margin.left + margin.right)
    .attr("height", dim.height + margin.top + margin.bottom);

  var topG = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top +')');

  var chartArea = topG.append("g").attr("class", "chartArea");

  // Initial axis
  var yAxis = topG.append('g')
    .attr("class", "bar y axis");

  var xAxis = topG.append('g')
    .attr("class", "bar x axis");


  // Axis titles
  topG.append("text")
    .attr("x", dim.width / 2)
    .attr("y", dim.height + margin.bottom - 5)
    .attr("class", "bar x axisTitle");
    
  topG.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - dim.height / 2)
    .attr("y", 0 - margin.left + 20)
    .attr("class", "bar y axisTitle");

  // TOOLTIP
  var tooltip = container.append("div")
    .attr('id', 'tooltipBar')
    .style('opacity', 0);
  tooltipTable = tooltip.append("table")
      .classed("table", true);

  

  // Data management
  var data = HTMLWidgets.dataframeToD3(inData.data);
  var groupingName = Object.keys(data[0])[1];
  var varName = Object.keys(data[0])[2];
  var sexName = Object.keys(data[0])[0];

  // Variable/key names may changes, so standardized them
  for (var i = 0; i<data.length; i++) {
    data[i].sex = data[i][sexName];
    data[i].grouping = data[i][groupingName];
    data[i].value = data[i][varName];
    delete data[i][sexName];
    delete data[i][varName];
    delete data[i][groupingName];
    }

  var newData= d3.nest()
  .key(d => d.grouping)
  .entries(data);

  grouping1Names = newData.map(d => d.key);
  grouping2Names = newData[0].values.map(d => d.sex);

  // Scales
  var maxY = d3.max(newData, d => d3.max(d.values, k => k.value));
  var scaleY = d3.scaleLinear()
    .domain([0, maxY])
    .range([dim.height, 0]);

  var scaleX = d3.scaleBand()
    .domain(grouping1Names)
    .range([0, dim.width])
    .padding(barPadding);

  var scaleX1 = d3.scaleBand()
    .domain(grouping2Names)
    .rangeRound([0, scaleX.bandwidth()]);

  var scaleColors = d3.scaleOrdinal()
    .range(colors);


  // Perform the data joins for visibile elements
  var barGroupWithData = chartArea
  .selectAll('g')
  .data(newData, d => d.key);

  // Remove any bar-groups not present in incoming data
  barGroupWithData.exit()
  .transition()
  .duration(tShort)
  .ease(d3.easeLinear)
  .style('opacity', 0)
  .remove();

  var barsData = barGroupWithData.enter()
    .append("g")
    .attr('class', d => 'barGroups ' + "i" + d.key.slice(0,2))
    .merge(barGroupWithData)
    .attr("transform", d => "translate(" + scaleX(d.key) + ",0)");

  // Visible bars
  var	bars = barsData.selectAll("rect")
    .data(d => Object.keys(d.values)
    .map(k => ({
        keyL2: grouping2Names[k],
        value: d.values[k].value }) ));

  bars.exit()
    .transition()
      .duration(tLong)
      .attr("y", d=> scaleY(0)).remove();

  var barsEntered = bars.enter()
    .append("rect")
    .attr("class", "bars")
    .attr("fill", d => scaleColors(d.keyL2))
    .attr("y", d => scaleY(0))
    .merge(bars)
    .attr("x", (d) => scaleX1(d.keyL2))
      .transition()
      .duration(tLong)
      .ease(d3.easeLinear)
      .attr("width", scaleX1.bandwidth())
      .attr('y', d => scaleY(d.value))
      .attr("height", d => scaleY(0) - scaleY(d.value));


  // Data join for mouseover elements - invisible to user
  var mouseSvg = chartArea
    .selectAll('.mouseSvg')
    .data(newData, d => d.key);
  

  mouseSvg.exit().remove();
  mouseSvg.enter()
    .append('rect')
    // Need to give unique non-numeric class to each rect
    .attr('class', d => 'mouseSvg ' + "i" + d.key.slice(0,2))
    .attr("x", d => scaleX(d.key))
    .attr("width", scaleX.bandwidth())
    .attr('y', 0)
    .attr("height", dim.height)
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip);

  // Add axes
  yAxis.transition()
    .call(d3.axisLeft(scaleY));
  
  xAxis.transition()
    .call(d3.axisBottom(scaleX))
    .attr("transform", 'translate(0,' + dim.height + ')');

  // Add axes titles
  topG.select(".bar.y.axisTitle")
    .transition()
    .duration(tLong)
    .text(varName)
      .style("text-anchor", "middle");

  topG.select(".bar.x.axisTitle")
    .transition()
    .duration(tLong)
    .style('opacity', 1)
    .text(groupingName)
      .style("text-anchor", "middle");

  //// Tooltip functions
  var cellSvgWidth = "20%";
  var cellTextWidth = "80%";
  var thead = tooltipTable.append('thead').append('tr').append('th');
  var tbody = tooltipTable.append('tbody');
  var rowMale = tbody.append('tr');
  rowMale.append('td').attr('width', cellSvgWidth)
  .append('svg')
      .attr('height', rectSize)
  .append('rect')
      .attr('width', rectSize)
      .attr('height', rectSize)
      .style('fill', colors[0]);
var maleCell = rowMale.append('td').attr("class", 'maleCell');

var rowFemale = tbody.append('tr');
rowFemale.append('td')
  .append('svg')
      .attr('height', rectSize)
  .append('rect')
      .attr('width', rectSize)
      .attr('height', rectSize)
      .style('fill', colors[1]);
var femaleCell = rowFemale.append('td').attr("class", 'femaleCell');

function showTooltip(d) {
    thead.text(groupingName + ": " + d.key);
    maleCell.text(d.values[0].sex + ": " + d.values[0].value);
    femaleCell.text(d.values[1].sex + ": " + d.values[1].value);

    tooltip.transition()
        .duration(tShort)
        .style('opacity', 0.9);
    d3.select('.mouseSvg' + ".i" + d.key.slice(0,2))
        .style('opacity', mOpacity);
    d3.select('.barGroups' + ".i" + d.key.slice(0,2))
        .append('line')
        .attr("class", 'guide')
        .attr("x1", scaleX1.bandwidth())
        .attr("x2", scaleX1.bandwidth())
        .attr("y1", 0)
        .attr("y2", dim.height);

  }

  function moveTooltip(d) {
          tooltip
            .style("left", d3.mouse(this)[0] + "px")
            .style("top", (d3.mouse(this)[1] + 50) + "px");

  }
  function hideTooltip(d) {
    tooltip.transition()
      .duration(tShort)
      .style('opacity', 0);
    d3.select('.mouseSvg' + ".i" + d.key.slice(0,2))
        .transition().duration(tShort)
        .style('opacity', 0.0);
    d3.selectAll('.guide')
      .transition().duration(tShort)
      .style('opacity', 0)
      .remove();
  }

}

/*html(
        "<b>" + d.key + "</b>" + "<br/><br/>" +
        d.values[0].sex + ": " + d.values[0].value + "</br>" +
        d.values[1].sex + ": " + d.values[1].value + "</br>");
*/
//////////////////////////////////////////////////////////////////////////////
//////////////////    UPDATE     /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function updateBarChart(inData, width, height, el, margin, colors, barPadding, tLong, tShort, mOpacity) {

  var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };


  svg = d3.select('#containerBar').select('svg');
  var chartArea = svg.selectAll('.chartArea');
  var tooltip = d3.select("#tooltipBar");

 // Data management
  var data = HTMLWidgets.dataframeToD3(inData.data);
  var groupingName = Object.keys(data[0])[1];
  var varName = Object.keys(data[0])[2];
  var sexName = Object.keys(data[0])[0];

  // Variable/key names may changes, so standardized them
  for (var i = 0; i<data.length; i++) {
    data[i].sex = data[i][sexName];
    data[i].grouping = data[i][groupingName];
    data[i].value = data[i][varName];
    delete data[i][sexName];
    delete data[i][varName];
    delete data[i][groupingName];
    }

  var newData= d3.nest()
    .key(d => d.grouping)
    .entries(data);

  var maxY = d3.max(newData, d => d3.max(d.values, k => k.value));
  grouping1Names = newData.map(d => d.key);
  grouping2Names = newData[0].values.map(d => d.sex);


  // Scales
  var scaleY = d3.scaleLinear()
    .domain([0, maxY])
    .range([dim.height, 0]);

  var scaleX = d3.scaleBand()
    .domain(grouping1Names)
    .range([0, dim.width])
    .padding(barPadding);

  var scaleX1 = d3.scaleBand()
    .domain(grouping2Names)
    .rangeRound([0, scaleX.bandwidth()]);

  var scaleColors = d3.scaleOrdinal()
    .range(colors);

    // Perform the data joins
  var barGroupWithData = chartArea
    .selectAll('g')
    .data(newData, d => d.key);



  // Remove any bar-groups not present in incoming data
  barGroupWithData.exit()
    .transition()
    .duration(tShort)
    .ease(d3.easeLinear)
    .style('opacity', 0)
    .remove();

  var barsData = barGroupWithData.enter()
    .append("g")
    .attr('class', d => 'barGroups ' + "i" + d.key.slice(0,2))
    .merge(barGroupWithData)
    .attr("transform", d => "translate(" + scaleX(d.key) + ",0)");

  barGroupWithData.selectAll('.mouseSvg').remove();

  var bars = barsData.selectAll("rect")
    .data(d => Object.keys(d.values)
    .map(k => ({
        keyL2: grouping2Names[k],
        value: d.values[k].value }) ));

  bars.exit()
    .transition()
      .duration(tLong)
      .attr("y", d=> scaleY(0)).remove();

  var barsEntered = bars.enter()
    .append("rect")
    .attr("class", "bars")
    .attr("fill", d => scaleColors(d.keyL2))
    .attr("y", d => scaleY(0))
    .merge(bars)
    .attr("x", (d) => scaleX1(d.keyL2))
      .transition()
      .duration(tLong)
      .ease(d3.easeLinear)
      .attr("width", scaleX1.bandwidth())
      .attr('y', d => scaleY(d.value))
      .attr("height", d => scaleY(0) - scaleY(d.value));


// Data join for mouseover elements - invisible to user
  var mouseSvg = chartArea
    .selectAll('.mouseSvg')
    .data(newData, d => d.key);
  
  mouseSvg.exit().remove();
  mouseSvg.enter()
    .append('rect')
    .merge(mouseSvg)
    // Need to give unique non-numeric class to each rect
    .attr('class', d => 'mouseSvg ' + "i" + d.key.slice(0,2))
    .attr("x", d => scaleX(d.key))
    .attr("width", scaleX.bandwidth())
    .attr('y', 0)
    .attr("height", height)
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip);


  // Update axes scales
  svg.selectAll(".bar.x.axis")
    .transition()
    .duration(tShort)
    .call(d3.axisBottom(scaleX));

  svg.selectAll(".bar.y.axis")
    .transition()
    .duration(tShort)
    .call(d3.axisLeft(scaleY));


  // Axis titles
  d3.selectAll('.bar.x.axisTitle')
    .transition()
    .duration(tLong)
    .text(groupingName)
    .style("text-anchor", "middle");

  d3.selectAll('.bar.y.axisTitle')
    .transition()
    .duration(tLong)
    .text(varName)
    .style("text-anchor", "middle");


  /* Tooltip functions. These should be hoisted to top of updateChart() function
  call, and therefore accessible at anytime from inside updateChart() */
  function showTooltip(d) {
      tooltip.transition()
        .duration(tShort)
        .style('opacity', 0.9);
      d3.select('.mouseSvg' + ".i" + d.key.slice(0,2))
        .style('opacity', mOpacity);

      d3.select('.barGroups' + ".i" + d.key.slice(0,2))
        .append('line')
        .attr("class", 'guide')
        .attr("x1", scaleX1.bandwidth())
        .attr("x2", scaleX1.bandwidth())
        .attr("y1", 0)
        .attr("y2", dim.height);

  }

  function moveTooltip(d) {
     tooltip.html(
        "<b>" + d.key + "</b>" + "<br/><br/>" +
        d.values[0].sex + ": " + d.values[0].value + "</br>" +
        d.values[1].sex + ": " + d.values[1].value + "</br>")
          .style("left", d3.mouse(this)[0] + "px")
          .style("top", (d3.mouse(this)[1] + 50) + "px");

  }
  function hideTooltip(d) {
    tooltip.transition()
      .duration(tShort)
      .style('opacity', 0);
    d3.select('.mouseSvg' + ".i" + d.key.slice(0,2))
        .transition().duration(tShort)
        .style('opacity', 0.0);
    d3.selectAll('.guide')
      .transition().duration(tShort)
      .style('opacity', 0)
      .remove();
  }
}


//////////////////////////////////////////////////////////////////////////////
//////////////////    RESIZE     /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function resizeBarChart(inData, width, height, el, margin, colors, barPadding, tLong, tShort, mOpacity) {
  var dim = {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  };

  var svg = d3.select('#containerBar').select('svg')
    .attr("width", dim.width + margin.left + margin.right)
    .attr("height", dim.height + margin.top + margin.bottom);



  // Axis titles
  d3.selectAll('.bar.x.axisTitle')
    .attr("x", dim.width / 2)
    .attr("y", dim.height + margin.bottom - 5);

    d3.selectAll('.bar.y.axisTitle')
    .attr("x", 0 - dim.height / 2)
    .attr("y", 0 - margin.left + 20);

  var data = HTMLWidgets.dataframeToD3(inData.data);
  var groupingName = Object.keys(data[0])[1];
  var varName = Object.keys(data[0])[2];
  var sexName = Object.keys(data[0])[0];

  for (var i = 0; i<data.length; i++) {
    data[i].sex = data[i][sexName];
    data[i].grouping = data[i][groupingName];
    data[i].value = data[i][varName];
    delete data[i][sexName];
    delete data[i][varName];
    delete data[i][groupingName];
    }

  var newData= d3.nest()
  .key(d => d.grouping)
  .entries(data);


  var maxY = d3.max(newData, d => d3.max(d.values, k => k.value));
  grouping1Names = newData.map(d => d.key);
  grouping2Names = newData[0].values.map(d => d.sex);


  // SCALES
  var scaleY = d3.scaleLinear()
    .domain([0, maxY])
    .range([dim.height, 0]);

  var scaleX = d3.scaleBand()
    .domain(grouping1Names)
    .range([0, dim.width])
    .padding(barPadding);

  var scaleX1 = d3.scaleBand()
    .domain(grouping2Names)
    .rangeRound([0, scaleX.bandwidth()]);

   // BAR GROUPS
  svg.selectAll(".barGroups")
    .transition()
    .duration(tShort)
    .attr("transform", d => "translate(" + scaleX(d.key) + ",0)");


  // BARS
  svg.selectAll(".bars")
    .transition()
    .duration(tShort)
    .attr("x", (d) => scaleX1(d.keyL2))
    .attr("width", scaleX1.bandwidth())
    .attr('y', d => scaleY(d.value))
    .attr("height", d => scaleY(0) - scaleY(d.value));

  // MOUSE SVG RECT
  svg.selectAll(".mouseSvg")
  .transition()
  .duration(tShort) 
    .attr("x", d => scaleX(d.key))
    .attr("width", scaleX.bandwidth())
    .attr('y', 0)
    .attr("height", dim.height);


  // Resize Axes
  svg.selectAll(".bar.x.axis")
    .transition()
    .duration(tShort)
    .call(d3.axisBottom(scaleX));


  svg.selectAll(".bar.y.axis")
    .transition()
    .duration(tShort)
    .call(d3.axisLeft(scaleY));

  //// Tooltip functions
  function showTooltip(d) {
      tooltip.transition()
        .duration(tShort)
        .style('opacity', 0.9);
      d3.select('.mouseSvg' + ".i" + d.key.slice(0,2))
        .style('opacity', mOpacity);

      d3.select('.barGroups' + ".i" + d.key.slice(0,2))
        .append('line')
        .attr("class", 'guide')
        .attr("x1", scaleX1.bandwidth())
        .attr("x2", scaleX1.bandwidth())
        .attr("y1", 0)
        .attr("y2", dim.height);

  }

  function moveTooltip(d) {
     tooltip.html(
        "<b>" + d.key + "</b>" + "<br/><br/>" +
        d.values[0].sex + ": " + d.values[0].value + "</br>" +
        d.values[1].sex + ": " + d.values[1].value + "</br>")
          .style("left", d3.mouse(this)[0] + "px")
          .style("top", (d3.mouse(this)[1] + 50) + "px");

  }
  function hideTooltip(d) {
    tooltip.transition()
      .duration(tShort)
      .style('opacity', 0);
    d3.select('.mouseSvg' + ".i" + d.key.slice(0,2))
        .transition().duration(tShort)
        .style('opacity', 0.0);
    d3.selectAll('.guide')
      .transition().duration(tShort)
      .style('opacity', 0)
      .remove();
  }

  }


