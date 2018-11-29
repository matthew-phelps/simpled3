HTMLWidgets.widget({

  name: 'simpleD3Bar',

  type: 'output',

  factory: function(el, width, height) {
    var margin = ({top:10, right:20, bottom:40, left:60});
    var colors = ['#bd6916', '#166abd '];

    // State variables
    var chartExists = false;
    var resized = false;
    return {

      renderValue: function(x) {
        if(!chartExists){
          chartExists = true;
          drawBarChart(x, width, height, el, margin, colors);
        } else if (resized){
          updateBarChart(x, this.dim.width, this.dim.height, el, margin, colors);
        } else {
          updateBarChart(x, width, height, el, margin, colors);
        }
        this.x = x; // store for resize

      },

      resize: function(width, height) {
        resizeBarChart(this.x, width, height, el, margin, colors);
        var dim = {
                width: width - margin.left - margin.right,
                height: height - margin.top - margin.bottom
              };
          resized = true;
          this.dim = dim;

      }

    };
  }
});
