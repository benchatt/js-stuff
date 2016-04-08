
function colorMix (stack) {
  var tot = [0,0,0];
  var aver = [0,0,0];
  var arrgeebee = ['r','g','b'];
  for (var f=0;f<tot.length;f++) {
    for (var i=0;i<stack.length;i++) {
      tot[f] = tot[f] + stack[i].data(arrgeebee[f]);
    };
    aver[f] = Math.round(tot[f]/stack.length);
  };
  return aver;
}

function doClear (button) {
  button.animate({
        "10%": {fill: '#fff', easing: "linear"},
        "100%": {fill: '#cef', easing: "ease-in"}
      },100);
  var paper = button.paper;
  blot = paper.circle(paper.width/2,paper.height/2,80)
              .attr({fill: '#fff',
                    'stroke-width': 0});
}

function doToggle (lb,pb,s) {
  var cols = ['#cef','#9bc'];
  lb.animate({fill: cols[(1-s)], easing: "ease-in-out"},200);
  pb.animate({fill: cols[s], easing: "ease-in-out"},200);
}

window.onload = function() {
  var paper = new Raphael(document.getElementById('canvas_container'),500,500);
  var stack = [];
  //iife to make the circles
  var palette = (function(paper) {
    var palette = [];
    var total = 8;
    var w = paper.width; var h = paper.height;
    var radstep = (2*Math.PI) / total;
    var outers = []; var inners = [];
    var shouter = []; var shinner = [];
    var midx = paper.width/2; var midy = paper.height/2;
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
        clone.animate({cx: midx, cy: midy}, 600, "back-in");
        stack.push(clone);

        var rawnrgb = colorMix(stack);
        var nrgb = rawnrgb.join(',');
        clone.animate({
          "80%": {fill: clone.attr('fill')},
          "100%": {fill: 'rgb('+nrgb+')', easing: 'ease-in'}
        },660);
        for (var ib=0;ib<rawnrgb.length;ib++) {
          var orgb = [ib===0 ? 255 : 0,ib===1 ? 255 : 0,ib===2 ? 255 : 0];
          shouter[ib] = paper.circle(midx+((ib-1)*18),midy+51,8)
                             .attr({fill: '#fff',
                                      stroke: 'rgb('+orgb+')',
                                      'stroke-width': 2
                                   });
          var radb = Math.round(8 * (rawnrgb[ib]/255));
          shinner[ib] = paper.circle(midx+((ib-1)*18),midy+51,radb)
                             .attr({fill: 'rgb(' + orgb + ')',
                                      'stroke-width': 0
                                    });
        }
      });
      for (var ib=0;ib<bits.length;ib++) {
        outers[ib] = []; inners[ib] = [];
        var orgb = [ib===0 ? 255 : 0,ib===1 ? 255 : 0,ib===2 ? 255 : 0];
        outers[ib][i] = paper.circle(x+((ib-1)*18),y+51,8)
                             .attr({fill: '#fff',
                                    stroke: 'rgb('+orgb+')',
                                    'stroke-width': 2
                                 });
        var radb = Math.round(8 * (bits[ib]/255));
        inners[ib][i] = paper.circle(x+((ib-1)*18),y+51,radb)
                             .attr({fill: 'rgb(' + orgb + ')',
                                    'stroke-width': 0
                                  });
      }
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
  var bulb = paper.image('./skbulb.png',paper.width-120,paper.height-100,110,110);
}
