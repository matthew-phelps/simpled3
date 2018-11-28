HTMLWidgets.widget({

  name: 'simpleD3Bar',

  type: 'output',

  factory: function(el, width, height) {

    var initialized = false;
    var margin = ({top:10, right:10, bottom:40, left:60});
    var width = width - margin.left - margin.right;
    var height = height -margin.top - margin.bottom;

    var barPadding = 0.2;
    var colors = ['#bd6916', '#166abd '];

    var tLong = 450;
    var tShort = 200;

    var scaleColors = d3.scaleOrdinal()
        .range(colors);

    var svgContainer = d3.select(el).style("position", "relative");
    var svg = svgContainer.append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    var topG = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top +')');

    var chartArea = topG.append("g");

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
      .text("Year")
      .style("text-anchor", "middle");

    topG.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - height / 2)
      .attr("y", 0 - margin.left + 20)
      .attr("class", "y axisTitle")
      .text("Total");

    // Tooltip div
    var div = svgContainer.append("div")
        .attr('class', 'tooltip');


    //Hide the tooltip when the mouse moves away
    function removeTooltip() {


    	//Hide tooltip
    	$('.popover').each(function() {
    		$(this).remove();
    	});

    }

    //Show the tooltip on the hovered over slice
    function showTooltip(d) {

    	//Define and show the tooltip
    	$(this).popover({
    		placement: 'auto top',
    		container: '#chart',
    		trigger: 'manual',
    		html : true,
    		content: function() {
    			return "<span style='font-size: 11px; text-align: center;'>" + d.Country + "</span>"; }
    	});
    	$(this).popover('show');
    }





    return {

      renderValue: function(x) {
        var data = HTMLWidgets.dataframeToD3(x.data);
        var groupingName = Object.keys(data[0])[1];
        var varName = Object.keys(data[0])[2];
        for (var i = 0; i<data.length; i++) {
            data[i].grouping = data[i][groupingName];
            data[i].value = data[i][varName];
            delete data[i][varName];
            delete data[i][groupingName];
            }

        var newData= d3.nest()
          .key(d => d.grouping)
          .entries(data);


        var maxY = d3.max(newData, d => d3.max(d.values, k => k.value));
        grouping1Names = newData.map(d => d.key);
        grouping2Names = newData[0].values.map(d => d.Sex);


        // Scales
        var scaleY = d3.scaleLinear()
          .domain([0, maxY])
          .range([height, 0]);

        var scaleX = d3.scaleBand()
          .domain(grouping1Names)
          .range([0, width])
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
            .merge(barGroupWithData)
            .attr("transform", d => "translate(" + scaleX(d.key) + ",0)");

           //barsData.transition().duration(t).

      		var	bars = barsData.selectAll("rect")
            .data(d => Object.keys(d.values)
            .map(k => ({
                keyL2: grouping2Names[k],
                value: d.values[k].value }) ));

          bars.exit()
            .transition()
              .duration(tLong)
              .attr("y", d=> scaleY(0)).remove();

          bars.enter()
            .append("rect")
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

          // Tooltip events

          barGroupWithData
            .on("mouseover", function(d){
                div.transition()
                .duration(tShort)
                .style('opacity', 0.9);
                div.html(
                  "<b>" + "År " + "</b>" + d.key + "<br/><br/>" +
                  varName + " " + "<b>" + d.values[0].value+ "</br>")
                  .style("left", d3.mouse(this)[0] + "px")
                  .style("top", (d3.mouse(this)[1] + 28) + "px");
            })
            .on("mouseout", function(d){
              div.transition()
              .duration(tShort)
              .style('opacity', 0);
            });


          // Udpate axes
          yAxis.transition()
            .duration(tLong)
            .call(d3.axisLeft(scaleY));

          xAxis.transition()
            .duration(tLong)
            .call(d3.axisBottom(scaleX))
            .attr("transform", 'translate(' + 0 + "," + height + ')');


          topG.select(".y.axisTitle")
            .transition()
            .duration(tLong)
            .text(varName)
              .style("text-anchor", "middle");

          topG.select(".x.axisTitle")
            .transition()
            .duration(tLong)
            .style('opacity', 1)
            .text(groupingName)
              .style("text-anchor", "middle");

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
