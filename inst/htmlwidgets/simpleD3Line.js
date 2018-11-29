HTMLWidgets.widget({

  name: 'simpleD3Line',

  type: 'output',

  factory: function(el, width, height) {
    var chartExists = false;
    var margin = ({top:10, right:20, bottom:40, left:60});
    rectPadding = 0.2;
    return {

      renderValue: function(x) {
        if(!chartExists){
          chartExists = true;
          drawLineChart(x, width, height, el, margin, rectPadding);
        } else {
          updateLineChart(x, this.dim.width, this.dim.height, el, margin, rectPadding);
        }
        this.x = x;

      },

      resize: function(width, height) {

        resizeLineChart(this.x, width, height, el, margin, rectPadding);
          var dim = {
                width: width - margin.left - margin.right,
                height: height - margin.top - margin.bottom
              };

          this.dim = dim;


      }

    };
  }
});
