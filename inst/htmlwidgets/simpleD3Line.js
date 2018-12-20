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


    // State variables
    var chartExists = false;
    var resized = false;
    return {

      renderValue: function(x) {
        if(!chartExists){
          chartExists = true;
          drawLineChart(x, width, height, el, margin, rectPadding, colors, tLong, tShort, cRadius, bigRadius);
         } else if (resized){
          updateLineChart(x, this.dim.width, this.dim.height, el, margin, rectPadding, colors, tLong, tShort, cRadius, bigRadius);
        } else {
          updateLineChart(x, width, height, el, margin, rectPadding, colors, tLong, tShort, cRadius, bigRadius);
        }
        this.x = x;

      },

      resize: function(width, height) {

        resizeLineChart(this.x, width, height, el, margin, rectPadding, colors, tLong, tShort, cRadius, bigRadius);
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
