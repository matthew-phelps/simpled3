HTMLWidgets.widget({

  name: 'simpleD3Line',

  type: 'output',

  factory: function(el, width, height) {
    var el = el;
    var width  = width;
    var height = height;
    var chartExists = false;
    
    return {

      renderValue: function(x) {
        if(!chartExists){
          chartExists = true;
          drawLineChart(x, width, height, el);
        } else {
          updateLineChart(x, width, height, el);
        }
        this.x = x

      },

      resize: function(width, height) {

        resizeLineChart(this.x, width, height, el)

      }

    };
  }
});
