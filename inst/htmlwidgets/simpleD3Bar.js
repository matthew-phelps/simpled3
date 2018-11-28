HTMLWidgets.widget({

  name: 'simpleD3Bar',

  type: 'output',

  factory: function(el, width, height) {
    var el = el;
    var width = width;
    var height = height;
    var chartExists = false;
    return {

      renderValue: function(x) {
        if(!chartExists){
          chartExists = true;
          drawChart(x, width, height, el);
        } else {
          updateChart(x, width, height, el);
        }
        this.x = x; // store for resize

      },

      resize: function(width, height) {

        updateChart(this.x, width, height, el);
      }

    };
  }
});
