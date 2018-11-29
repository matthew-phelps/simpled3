HTMLWidgets.widget({

  name: 'simpleD3Line',

  type: 'output',

  factory: function(el, width, height) {

    initialized = false;

    
    return {

      renderValue: function(x) {
        if(!initialized){
          initialized = true;
          drawLineChart(x, width, height, el);
        } else {
          updateLineChart(x, width, heigt, el);
        }

       





      },

      resize: function(width, height) {

        console.log(width);
        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
