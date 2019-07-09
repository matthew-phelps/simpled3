HTMLWidgets.widget({
  name: "simpleD3Line",

  type: "output",

  factory: function(el, width, height) {
    var tLong = 450;
    var tShort = 200;
    var dims = {
      margin: { top: 40, right: 20, bottom: 70, left: 95 },
      legendBuffer: 45,
      rectSize: 20, //dimension of colored square
      yAxisSpace: 67,
      xAxisSpace: 45,
      titleHeight: 40,
      rectPadding: 0.0,
      cRadius: 7,
      bigRadius: 15
    };

    var localeFormatter = d3.formatLocale({
      decimal: ",",
      thousands: ".",
      grouping: [3],
      currency: ["", "€"],
      dateTime: "%a, %e %b %Y, %X",
      date: "%d.%m.%Y",
      time: "%H:%M:%S",
      periods: ["", ""],
      days: [
        "Sonntag",
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag"
      ],
      shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      months: [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "December"
      ],
      shortMonths: [
        "Jan",
        "Feb",
        "Mär",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dec"
      ]
    });
    var numberFormat = localeFormatter.format(",");

    // State variables
    var chartExists = false;
    var resized = false;

    return {
      renderValue: function(x) {
        if (!chartExists) {
          chartExists = true;
          drawLineChart(
            x,
            width,
            height,
            el,
            tLong,
            tShort,
            numberFormat,
            dims
          );
        } else if (resized) {
          updateLineChart(
            x,
            this.dim.width,
            this.dim.height,
            el,
            tLong,
            tShort,
            numberFormat,
            dims
          );
        } else {
          updateLineChart(
            x,
            width,
            height,
            el,
            tLong,
            tShort,
            numberFormat,
            dims
          );
        }
        this.x = x;

        // Download function
        d3.select("#download_line").on("click", function() {
          saveSvgAsPng(
            document.getElementById("svgLine"),
            "HjerteTal_chart.png",
            { scale: 2, backgroundColor: "#FFFFFF" }
          );
        });
      },

      resize: function(width, height) {
        resizeLineChart(
          this.x,
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
        );
        var dim = {
          width: width,
          height: height
        };
        resized = true;
        this.dim = dim;
      }
    };
  }
});
