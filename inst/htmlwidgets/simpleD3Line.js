HTMLWidgets.widget({

  name: 'simpleD3Line',

  type: 'output',

  factory: function(el, width, height) {
    
    
    var chartExists = false;
    var margin = ({top:10, right:20, bottom:40, left:60});
    return {

      renderValue: function(x) {
        if(!chartExists){
          chartExists = true;
          drawLineChart(x, width, height, el, margin);
        } else {
          updateLineChart(x, this.dim.width, this.dim.height, el, margin);
        }
        this.x = x;

      },

      resize: function(width, height) {

        resizeLineChart(this.x, width, height, el, margin);
          var dim = {
                width: width - margin.left - margin.right,
                height: height - margin.top - margin.bottom
              };

          this.dim = dim;


      }

    };
  }
});
