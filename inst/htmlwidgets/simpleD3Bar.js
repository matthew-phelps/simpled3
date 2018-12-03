HTMLWidgets.widget({

  name: 'simpleD3Bar',

  type: 'output',

  factory: function(el, width, height) {
    var margin = ({top:10, right:20, bottom:40, left:60});
    var colors = ['#bd6916', '#166abd '];
    var barPadding = 0.2;
    var tLong = 450;
    var tShort = 200;

    // State variables
    var chartExists = false;
    var resized = false;
    return {

      renderValue: function(x) {
        if(!chartExists){
          chartExists = true;
          drawBarChart(x, width, height, el, margin, colors, barPadding, tLong, tShort);
        } else if (resized){
          updateBarChart(x, this.dim.width, this.dim.height, el, margin, colors, barPadding, tLong, tShort);
        } else {
          updateBarChart(x, width, height, el, margin, colors, barPadding, tLong, tShort);

        }
        this.x = x; // store for resize

      },

      resize: function(width, height) {
        resizeBarChart(this.x, width, height, el, margin, colors, barPadding, tLong, tShort);
        var dim = {
                width: width,
                height: height
              };
          resized = true;
          this.dim = dim;

      }

    };
  }
});
