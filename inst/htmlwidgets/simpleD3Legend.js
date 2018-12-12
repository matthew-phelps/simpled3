HTMLWidgets.widget({

  name: 'simpleD3Legend',

  type: 'output',

  factory: function(el, width, height) {

    var margin = ({top:10, right:10, bottom:10, left:60});
    var chartExists = false;

    return {

      renderValue: function(x) {
        if(!chartExists){
          chartExists = true;
          drawLegend(x, width, height, el, margin);
        }
        
      },

      resize: function(width, height) {

        resizeLegend(width, height, margin);

      }

    };
  }
});
