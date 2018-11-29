HTMLWidgets.widget({

  name: 'simpleD3Line',

  type: 'output',

  factory: function(el, width, height) {
    var margin = ({top:10, right:20, bottom:40, left:60});
    var rectPadding = 0.2;

    // State variables
    var chartExists = false;
    var resized = false;
    return {

      renderValue: function(x) {
        if(!chartExists){
          chartExists = true;
          drawLineChart(x, width, height, el, margin, rectPadding);
         } else if (resized){
          updateLineChart(x, this.dim.width, this.dim.height, el, margin);
        } else {
          updateLineChart(x, width, height, el, margin);
        }
        this.x = x;

      },

      resize: function(width, height) {

        resizeLineChart(this.x, width, height, el, margin, rectPadding);
          var dim = {
                width: width,
                height: height
              };
          resize = true;
          this.dim = dim;


      }

    };
  }
});
