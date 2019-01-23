HTMLWidgets.widget({

  name: 'simpleD3Bar',

  type: 'output',

  factory: function(el, width, height) {
    var margin = ({top:1, right:20, bottom:40, left:60});
    var colors = [ '#166abd', '#bd6916'];
    var barPadding = 0.2;
    var tLong = 450;
    var tShort = 200;
    var mOpacity = 0.25;
    var rectSize = 20; //dimension of colored square
    legendHeight = 50;
    titleHeight = 25;
    var tablePadding = 10; 

    /*Format requires defining formats for several data types even though they will not be uses - apparently*/
    var localeFormatter = d3.formatLocale({
      "decimal": ",",
      "thousands": ".",
      "grouping": [3],
      "currency": ["", "€"],
      "dateTime": "%a, %e %b %Y, %X",
                "date": "%d.%m.%Y",
                "time": "%H:%M:%S",
                "periods": ["", ""],
                "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
                "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "December"],
                "shortMonths": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
    });
    var numberFormat = localeFormatter.format(",");
    // State variables
    var chartExists = false;
    var resized = false;

    // Download function - not sure why this can site outidethe render functions, but it works
      d3.select("#download_bar").on("click", function(){
            saveSvgAsPng(document.getElementById("svgBar"), "HjerteTal_chart.png", {scale: 2, backgroundColor: "#FFFFFF"});
        });



 

    return {

      renderValue: function(x) {
        if(!chartExists){
          chartExists = true;
          drawBarChart(x, width, height, el, margin, colors, barPadding, tLong, tShort, mOpacity, rectSize, tablePadding, numberFormat,
           legendHeight, titleHeight);

          

        } else if (resized){
          updateBarChart(x, this.dim.width, this.dim.height, el, margin, colors, barPadding, tLong, tShort, mOpacity, numberFormat, legendHeight);
        } else {
          updateBarChart(x, width, height, el, margin, colors, barPadding, tLong, tShort, mOpacity, numberFormat, legendHeight);

        }
        this.x = x; // store for resize
        
        // Download function
          d3.select("#download_bar").on("click", function(){
                saveSvgAsPng(document.getElementById("svgBar"), "HjerteTal_chart.png", {scale: 1.5, backgroundColor: "#FFFFFF"});
            });
      },

      resize: function(width, height) {
        resizeBarChart(this.x, width, height, el, margin, colors, barPadding, tLong, tShort, mOpacity, numberFormat, legendHeight);
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
