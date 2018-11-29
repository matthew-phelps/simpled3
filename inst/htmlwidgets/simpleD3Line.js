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

       





      },

      resize: function(width, height) {

        console.log(width);
        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
