HTMLWidgets.widget({
  name: "simpleD3Bar",

  type: "output",

  factory: function(el, width, height) {
    var tLong = 450;
    var tShort = 200;
    var mOpacity = 0.0;

    var dims = {
      margin: { top: 80, right: 20, bottom: 70, left: 95 },
      legendBuffer: 45,
      rectSize: 20, //dimension of colored square
      yAxisSpace: 67,
      xAxisSpace: 45,
      titleHeight: 40,
      titleHeight1: 40,
      barPadding: 0.2
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
    // Download function - not sure why this can site outidethe render functions, but it works
    d3.select("#download_bar").on("click", function() {
      saveSvgAsPng(document.getElementById("svgBar"), "HjerteTal_chart.png", {
        scale: 1.5,
        backgroundColor: "#FFFFFF"
      });
    });

    return {
      renderValue: function(x) {
        if(x.metaData.lang === "dk"){          
          var numberFormat = numFormatDefDK.format(",");
          } else if (x.metaData.lang === "en"){
          var numberFormat = numFormatDefEN.format(",");
        }

        if (!chartExists) {
          chartExists = true;
          drawBarChart(
            x,
            width,
            height,
            el,
            tLong,
            tShort,
            mOpacity,
            numberFormat,
            dims
          );
        } else if (resized) {
          updateBarChart(
            x,
            this.dim.width,
            this.dim.height,
            el,
            tLong,
            tShort,
            mOpacity,
            numberFormat,
            dims
          );
        } else {
          updateBarChart(
            x,
            width,
            height,
            el,
            tLong,
            tShort,
            mOpacity,
            numberFormat,
            dims
          );
        }
        this.x = x; // store for resize

        // Download function
        d3.select("#download_bar").on("click", function() {
          saveSvgAsPng(
            document.getElementById("svgBar"),
            "HjerteTal_chart.png",
            { scale: 1.5, backgroundColor: "#FFFFFF" }
          );
        });
      },

      resize: function(width, height) {
        if(this.x.metaData.lang === "dk"){          
          var numberFormat = numFormatDefDK.format(",");
          } else if (this.x.metaData.lang === "en"){
          var numberFormat = numFormatDefEN.format(",");
        }
        resizeBarChart(
          this.x,
          width,
          height,
          el,
          tLong,
          tShort,
          mOpacity,
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
