HTMLWidgets.widget({

  name: 'simpleD3Bar',

  type: 'output',

  factory: function(el, width, height) {
    var el = el;
    var width = width;
    var height = height;

    return {

      renderValue: function(x) {
        drawChart(x, width, height, el);
        this.x = x; // store for resize

      },

      resize: function(width, height) {

        drawChart(this.x, width, height, el)
      }

    };
  }
});
