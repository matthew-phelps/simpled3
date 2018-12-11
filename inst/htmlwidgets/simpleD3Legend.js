HTMLWidgets.widget({

  name: 'simpleD3Legend',

  type: 'output',

  factory: function(el, width, height) {

    var margin = ({top:10, right:10, bottom:10, left:60});


    return {

      renderValue: function(x) {

        drawLegend(x, width, height, el, margin);
      },

      resize: function(width, height) {

        resizeLegend(x, width, height, el, margin);

      }

    };
  }
});
