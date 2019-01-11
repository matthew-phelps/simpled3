HTMLWidgets.widget({

  name: 'simpleD3Bar',

  type: 'output',

  factory: function(el, width, height) {
    var margin = ({top:10, right:20, bottom:40, left:60});
    var colors = [ '#166abd', '#bd6916'];
    var barPadding = 0.2;
    var tLong = 450;
    var tShort = 200;
    var mOpacity = 0.25;
    var rectSize = 20; //dimension of colored square
    legendHeight = 60;
    var tablePadding = 10; 
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
                "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                "shortMonths": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
    });
    var numberFormat = localeFormatter.format(",");
    // State variables
    var chartExists = false;
    var resized = false;
    return {

      renderValue: function(x) {
        if(!chartExists){
          chartExists = true;
          drawBarChart(x, width, height, el, margin, colors, barPadding, tLong, tShort, mOpacity, rectSize, tablePadding, numberFormat, legendHeight);
        } else if (resized){
          updateBarChart(x, this.dim.width, this.dim.height, el, margin, colors, barPadding, tLong, tShort, mOpacity, numberFormat, legendHeight);
        } else {
          updateBarChart(x, width, height, el, margin, colors, barPadding, tLong, tShort, mOpacity, numberFormat, legendHeight);

        }
        this.x = x; // store for resize

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
