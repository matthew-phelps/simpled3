HTMLWidgets.widget({

  name: 'simpleD3Line',

  type: 'output',

  factory: function(el, width, height) {
    var margin = ({top:20, right:20, bottom:40, left:60});
    var rectPadding = 0.0;
    var colors = ['#166abd', '#bd6916'];
    var tLong = 450;
    var tShort = 200;
    var cRadius = 7;
    var bigRadius = 15;
    var rectSize = 20; //dimension of colored square
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
          drawLineChart(x, width, height, el, margin, rectPadding, colors, tLong, tShort, cRadius, bigRadius, rectSize, tablePadding, numberFormat);
         } else if (resized){
          updateLineChart(x, this.dim.width, this.dim.height, el, margin, rectPadding, colors, tLong, tShort, cRadius, bigRadius,rectSize, tablePadding, numberFormat);
        } else {
          updateLineChart(x, width, height, el, margin, rectPadding, colors, tLong, tShort, cRadius, bigRadius, rectSize, tablePadding, numberFormat);
        }
        this.x = x;

      },

      resize: function(width, height) {

        resizeLineChart(this.x, width, height, el, margin, rectPadding, colors, tLong, tShort, cRadius, bigRadius, rectSize, tablePadding, numberFormat);
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
