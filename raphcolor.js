
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
  button.animate({
        "75%": {fill: '#fff', easing: "ease-out"},
        "100%": {fill: '#cef', easing: "ease-in"}
      },100);
}

function doToggle (lb,pb,s) {
  var cols = ['#cef','#9bc'];
  lb.animate({fill: cols[(1-s)], easing: "ease-in-out"},200);
  pb.animate({fill: cols[s], easing: "ease-in-out"},200);
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
        clone.animate({
          "90%": {fill: clone.attr('fill')},
          "100%": {fill: 'rgb('+nrgb+')', easing: 'ease-in'}
        },660);
      });
      //temp.click(stack = cloneToCenter(this,stack););
      palette.push(temp);
    }
    return palette;
  })(paper);
  var clearButton = paper.rect(20,paper.height-40,100,30,6)
                         .attr({fill: '#cef',
                                stroke: '#222',
                                'stroke-width': 3
                         })
                         .click(function (evt) {
                           doClear(this);
                           for (var i=0;i<stack.length;i++) {
                             stack[i].remove();
                           }
                           stack = [];
                         });
  var clearText = paper.text(70,paper.height-24,"clear")
                       .attr({fill: "#222",
                          'font-family': 'arial',
                          'font-size': 24
                      })
                      .click(function (evt) {
                        doClear(clearButton);
                        for (var i=0;i<stack.length;i++) {
                          stack[i].remove();
                        }
                        stack = [];
                      });
  clearButton.node.onmouseover = function () {
    this.style.cursor = 'pointer';
  };
  clearText.node.onmouseover = function () {
    this.style.cursor = 'pointer';
  };

  var lightButton = paper.rect(paper.width-180,paper.height-40,70,30,6)
                         .attr({fill: '#cef',
                                stroke: '#222',
                                'stroke-width': 3
                              });
  var paintButton = paper.rect(paper.width-90,paper.height-40,70,30,6)
                         .attr({fill: '#cef',
                                stroke: '#222',
                                'stroke-width': 3
                              });
  var lightText = paper.text(paper.width-145,paper.height-24,"light")
                       .attr({fill: "#222",
                          'font-family': 'arial',
                          'font-size': 24
                      })
                      .click(function (evt) {
                        for (var i=0;i<stack.length;i++) {
                          stack[i].remove();
                        }
                        stack = [];
                        SUBT = 0;
                        doToggle(lightButton,paintButton,SUBT);
                      });
  var blank = paper.circle(paper.width/2,paper.height/2,40)
                   .attr({fill: '#fff', stroke: '#fff'})
                   .data('r',255).data('g',255).data('b',255);
  var paintText = paper.text(paper.width-55,paper.height-24,"paint")
                       .attr({fill: "#222",
                          'font-family': 'arial',
                          'font-size': 24
                      })
                      .click(function (evt) {
                        for (var i=0;i<stack.length;i++) {
                          stack[i].remove();
                        }
                        stack = [];
                        stack.push(blank);
                        SUBT = 1;
                        doToggle(lightButton,paintButton,SUBT);
                      });
  lightText.node.onmouseover = function () {
    this.style.cursor = 'pointer';
  }
  paintText.node.onmouseover = function () {
    this.style.cursor = 'pointer';
  }
  doToggle(lightButton,paintButton,SUBT);
}
