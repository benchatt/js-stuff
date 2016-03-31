function radians(n) {
  return (n * (Math.PI/180.0));
}

function degrees(n) {
  return (n * (180.0/Math.PI));
}

window.onload = function() {
  var paper = new Raphael(document.getElementById('canvas_container'),500,500);
  var palette = (function(paper) {
    var palette = [];
    var total = 8;
    var w = paper.width; var h = paper.height;
    var radstep = (2*Math.PI) / total;
    for (var i=0;i<total;i++) {
      var bini = i.toString(2);
      var bits = bini.split('');
      while (bits.length < 3) {
        bits.unshift('0');
      }
      bits = bits.map(Number);
      var x = Math.round(Math.cos(i*radstep)*(w/3)) + (w/2);
      var y = Math.round(Math.sin(i*radstep)*(h/3)) + (h/2);
      console.log(x,y);
      for (var j=0;j<bits.length;j++) {
        bits[j] = bits[j]*255;
      }
      var rgb = bits.join(',');
      var temp = paper.circle(x,y,40)
                      .attr({fill: 'rgb('+rgb.toString()+')',
                             stroke: '#333',
                             'stroke-width': 4
                           });
      //add handlers
      temp.node.onmouseover = function () {
        this.style.cursor = 'pointer';
      };
      palette.push(temp);
    }
    return palette;
  })(paper);
}
