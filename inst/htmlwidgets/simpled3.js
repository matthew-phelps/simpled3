HTMLWidgets.widget({

  name: 'simpled3',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    var initialized = false;
    var margin = ({top:10, right:10, bottom:40, left:60});
    var width = width - margin.left - margin.right;
    var height = height -margin.top - margin.bottom;

    var barPadding = 0.2;
    var colors = ['#bd6916', '#166abd '];

    var tLong = 450;
    var tShort = 200;
    var cRadius = 7;


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

    // Tooltip

    var div = svgContainer.append("div")
        .attr('class', 'tooltip')

    return {

      renderValue: function(x) {

        var data = HTMLWidgets.dataframeToD3(x.data);
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

        xAxis.call(d3.axisBottom(scaleX)
            .tickFormat(d3.format("")))
            .attr("transform", "translate(" + 0 + "," + height + ')');

        // Line generators
        var valueLine1 = d3.line()
        .x(d => scaleX(d.year))
        .y(d => scaleY(d.female));

        var valueLine2 = d3.line()
        .x(d => scaleX(d.year))
        .y(d => scaleY(d.male));

        // Add initial line paths
        if (!initialized){
            initialized = true;

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

        }


         // Create the paths for each series of data
        chartArea
          .select(".female")
          .transition()
          .duration(tLong)
          .attr("d", valueLine1(data));

        chartArea
          .select(".male")
          .transition()
          .duration(tLong)
          .attr("d", valueLine2(data));

        // Update circles
        var dotFemale = chartArea.selectAll(".dotfemale")
          .data(data);

          dotFemale.transition()
          .duration(tLong)
          .attr("cx", d => scaleX(d.year))
          .attr("cy", d => scaleY(d.female));

          dotFemale
            .on("mouseover", function(d){
                div.transition()
                .duration(tShort)
                .style('opacity', 0.9);
                div.html(
                  "<b>" + "År " + "</b>" + d.year + "<br/>" +
                  varName + " " + "<b>" + d.female + "</br>")
                  .style("left", d3.mouse(this)[0] + "px")
                  .style("top", (d3.mouse(this)[1] + 28) + "px");
          })
            .on("mouseout", function(d){
              div.transition()
              .duration(tShort)
              .style('opacity', 0);
            });



            chartArea.selectAll(".dotmale")
              .data(data)
              .transition()
              .duration(tLong)
              .attr("cx", d => scaleX(d.year))
              .attr("cy", d => scaleY(d.male));


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





      },

      resize: function(width, height) {

        console.log(width);
        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
