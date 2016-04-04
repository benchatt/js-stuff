
function colorMix (stack, subt) {
  var tot = [0,0,0];
  var aver = [0,0,0];
  var arrgeebee = ['r','g','b'];
  for (var f=0;f<tot.length;f++) {
    for (var i=0;i<stack.length;i++) {
      tot[f] = tot[f] + stack[i].data(arrgeebee[f]);
    };
    aver[f] = Math.round(tot[f]/stack.length);
  };
  if (subt) {
    aver[0] = 255 - aver[0];
    aver[1] = 255 - aver[1];
    aver[2] = 255 - aver[2];
  }
  return aver.join(',');
}

function doClear (button) {
  button.animate({fill: '#fff'},75,"elastic",
         resetClear(button)
        );
}

function resetClear (button) {
  button.animate({fill: '#cef'},25);
}
window.onload = function() {
  var paper = new Raphael(document.getElementById('canvas_container'),500,500);
  var stack = [];
  var SUBT = 0;
  //iife to make the circles
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
      for (var j=0;j<bits.length;j++) {
        bits[j] = bits[j]*255;
      }
      var rgb = bits.join(',');
      var temp = paper.circle(x,y,40)
                      .attr({fill: 'rgb('+ rgb +')',
                             stroke: '#333',
                             'stroke-width': 4
                           })
                      .data("r",bits[0])
                      .data("g",bits[1])
                      .data("b",bits[2]);
      //add handlers
      console.log(temp.data('r'));
      temp.node.onmouseover = function () {
        this.style.cursor = 'pointer';
      };
      temp.click(function (evt) {
        var clone = this.clone();
        clone.data("r",this.data("r"));
        clone.data("g",this.data("g"));
        clone.data("b",this.data("b"));
        clone.animate({cx: paper.width/2, cy: paper.height/2}, 600, "back-in");
        stack.push(clone);

        var nrgb = colorMix(stack,SUBT);
        clone.animate({fill: 'rgb('+nrgb+')'},600);
      });
      //temp.click(stack = cloneToCenter(this,stack););
      palette.push(temp);
    }
    return palette;
  })(paper);
  var clearButton = paper.rect(20,paper.height-40,100,30,6)
                         .attr({fill: '#cef',
                                stroke: '#222',
                                'stroke-width': 3,
                         })
                         .click(function (evt) {
                           doClear(this);
                         });
}
