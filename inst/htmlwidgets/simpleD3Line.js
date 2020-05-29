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

/*Format requires defining formats for several data types even though they will not be uses - apparently*/
    var numFormatDefDK= d3.formatLocale({
      decimal: ",",
      thousands: ".",
      grouping: [3],
      currency: ["", "DKK"]
    });

    var numFormatDefEN= d3.formatLocale({
      decimal: ".",
      thousands: ",",
      grouping: [3],
      currency: ["", "$"]
    });

    // State variables
    var chartExists = false;
    var resized = false;

    return {
      renderValue: function(x) {
        if(x.metaData.lang === "dk"){          
          var numberFormat = numFormatDefDK.format(",");
          } else if (x.metaData.lang === "en"){
          var numberFormat = numFormatDefEN.format(",");
        }
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
         if(x.metaData.lang === "dk"){          
          var numberFormat = numFormatDefDK.format(",");
          } else if (x.metaData.lang === "en"){
          var numberFormat = numFormatDefEN.format(",");
        }

        resizeLineChart(
          this.x,
          width,
          height,
          el,
          tLong,
          tShort,
          numberFormat,
          dims
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
