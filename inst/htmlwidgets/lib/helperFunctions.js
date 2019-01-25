/*jshint esversion: 6 */

var insertLinebreaks = function (d) {
    var el = d3.select(this);
    var words = d.split(' ');
    el.text('');

    for (var i = 0; i < words.length; i++) {
        var tspan = el.append('tspan').text(words[i]);
        if (i > 0)
            tspan.attr('x', 0).attr('dy', '15');
    }
};



function showTooltip(d) {
    thead.text(groupingName + ": " + d.key);
    maleCell.text(d.values[0].sex + ": " + numberFormat(d.values[0].value));
    femaleCell.text(d.values[1].sex + ": " + numberFormat(d.values[1].value));

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
        .attr("y2", dim.height - legendHeight);
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