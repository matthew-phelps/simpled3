HTMLWidgets.widget({

  name: 'simpled3',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    var chart = null

    return {

      renderValue: function(x) {
          var data = HTMLWidgets.dataframeToD3(x.data)

          var margin = ({top:10, right:10, bottom:40, left:60});
          var Gwidth = width - margin.left - margin.right
          var Gheight = height - margin.top - margin.bottom
          var barPadding = 0.2;
          var colors = ['#bd6916', '#166abd ']

          var tLong = 450;
          var tShort = 200;
          var cRadius = 7;

          var svg = d3.select('el').append('svg')

          var topG = svg.append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top +')')


          // Initial scale

          // Scale between the keys (i.e. b/w age groups, edu, etc`)
          var scaleX = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([0, Gwidth])


          var scaleColors = d3.scaleOrdinal()
              .range(colors)

          // Initial axis
          var yAxis = topG.append('g')
            .attr("class", "y axis")

          var xAxis = topG.append('g')
              .attr("class", "x axis")

          xAxis.call(d3.axisBottom(scaleX)
                        .tickFormat(d3.format("")))
              .attr("transform", 'translate(' + 0 + "," + Gheight + ')')



          // Axis titles
          topG.append("text")
            .attr("x", Gwidth / 2)
            .attr("y", Gheight + margin.bottom)
            .attr("class", "x axisTitle")
            .text("Year")
            .style("text-anchor", "middle");

          topG.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - Gheight / 2)
            .attr("y", 0 - margin.left + 20)
            .attr("class", "y axisTitle")
            .text("Total")

          var chartArea = topG.append("g");

          var maxY = d3.max(data, d=> Math.max(d.female, d.male))
          grouping1Names = data.map(d => d.year);


          // Scales used in updates
          var scaleY = d3.scaleLinear()
            .domain([0, maxY])
            .range([Gheight, 0]);

          var scaleX = d3.scaleLinear()
          .domain(d3.extent(data, d => d.year))
          .range([0, Gwidth])

          // Line generators
          var valueLine1 = d3.line()
          .x(d => scaleX(d.year))
          .y(d => scaleY(d.female))

          var valueLine2 = d3.line()
          .x(d => scaleX(d.year))
          .y(d => scaleY(d.male))

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


          var div = svg.append("rect")
              .attr('class', 'tooltip')
              .style('opacity', 0)
              .attr("position", "absolute")
              .attr("text-align", "center")
              .attr("width"," 60px")
              .attr("height", "28px")
              /*.attr("padding", "2px")				*/
              /*.attr("font", "12px sans-serif")*/
              .attr("fill", "lightsteelblue")
              /*.attr("border", "0px")
              .attr("border-radius"," 8px")
          */

            // UPDATE FUNCTION - will be called by r2d3.onRender()
          function update(newData) {

            // Reshape data
            var maxY = d3.max(newData, d=> Math.max(d.female, d.male))
            var varName = newData[0].variable

            // Tooltip



            // Scales used in updates
            var scaleY = d3.scaleLinear()
              .domain([0, maxY])
              .range([Gheight, 0]);

            var scaleX = d3.scaleLinear()
            .domain(d3.extent(newData, d => d.year))
            .range([0, Gwidth])

            // Line generators
            var valueLine1 = d3.line()
            .x(d => scaleX(d.year))
            .y(d => scaleY(d.female))

            var valueLine2 = d3.line()
            .x(d => scaleX(d.year))
            .y(d => scaleY(d.male))

             // Create the paths for each series of data
            chartArea
              .select(".female")
              .transition()
              .duration(tLong)
              .attr("d", valueLine1(newData))

            chartArea
              .select(".male")
              .transition()
              .duration(tLong)
              .attr("d", valueLine2(newData))

            // Update circles
            var dotFemale = chartArea.selectAll(".dotfemale")
              .data(newData)

              dotFemale.transition()
              .duration(tLong)
              .attr("cx", d => scaleX(d.year))
              .attr("cy", d => scaleY(d.female))

              dotFemale.on("mouseover", function(d){
                                    div.transition()
                                    .duration(tShort)
                                    .style('opacity', .9);
                                    div.html(d)
                                      .style("left", d3.event.pageX + "px")
                                      .style("top", (d3.event.pageY - 28) + "px");
              })


            chartArea.selectAll(".dotmale")
              .data(newData)
              .transition()
              .duration(tLong)
              .attr("cx", d => scaleX(d.year))
              .attr("cy", d => scaleY(d.male))


            // Udpate axes
            yAxis.transition()
              .duration(tLong)
              .call(d3.axisLeft(scaleY))

            xAxis.transition()
              .duration(tLong)
              .call(d3.axisBottom(scaleX)
                      .tickFormat(d3.format("")))

            // Update axis titles
            topG.select(".y.axisTitle")
              .transition()
              .duration(tLong)
              .text(varName)
              .style("text-anchor", "middle");




          }

          update(data)

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
