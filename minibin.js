function doToggle(shape) {
    var xa = shape.data("xattrs");
    var delta = 0;
    if (xa.active===true) {
        //deactivating
        shape.attr({fill:'ecc'});
        xa.undertext.attr({fill:'aaa',text:"0"});
        xa.ontext.attr({text:"0"});
        xa.active=false;
        delta = delta - xa.mult;
    } else if (xa.active===false) {
        //activating
        shape.attr({fill:'cec'});
        xa.undertext.attr({fill:'222',text:String(xa.mult)});
        xa.ontext.attr({text:"1"});
        xa.active=true;
        delta = delta + xa.mult;
    }
    return delta;
}

window.onload = function () {
    var paper = new Raphael(document.getElementById('canvas_container'),600,180);
    var size = 4;
    var wwidth = paper.width-200;
    var SIDE = ( wwidth / size ) * 0.8;
    var PAD = ( wwidth / ( size + 1 ) ) * 0.2;
    var rounding = parseInt(PAD / 2);
    var total = 0;
    var sum = paper.text(440,60,"=0")
        .attr({fill:'222', 'font-family':'monospace', 'font-size':60});
    for (var i=0;i<size-1;i++) {
        var xoffset = (i * (SIDE + PAD)) + PAD;
        paper.text(xoffset+SIDE,PAD+(SIDE*1.5),"+")
            .attr({fill:'222', 'font-family':'monospace', 'font-size':20});
    }
    var spaces = (function (paper){
        var spaces = [];
        for (var i=0;i<size;i++) {
            var xoffset = (i * (SIDE + PAD)) + PAD;
            var mult = Math.pow(2,3-i);
            var shape = paper.rect(xoffset,PAD,SIDE,SIDE,rounding)
                            .attr({fill:'ecc', stroke:'200', 'stroke-width':3});
            var undertext = paper.text(xoffset+(SIDE*0.5),PAD+(SIDE*1.5),"0")
                            .attr({fill:'aaa', 'font-family':'monospace', 'font-size':20});
            var ontext = paper.text(xoffset+(SIDE*0.5),PAD+(SIDE/2),"0")
                            .attr({fill:'222', 'font-family':'monospace', 'font-size':40})
                            .data("shape",shape);
            var xattrs = {
                active:false,
                mult:mult,
                undertext:undertext,
                ontext:ontext
            };
            shape.data("xattrs",xattrs);
            shape.click(function (evt) {
                var delta = doToggle(this);
                total = total + delta;
                sum.attr({text:"="+total});
            })
            ontext.click(function (evt) {
                var delta = doToggle(this.data("shape"));
                total = total + delta;
                sum.attr({text:"="+total});
            })
            spaces.push(shape);
        }
        return spaces;
    })(paper);
  var bulb = paper.image('./skbulb.png',paper.width-120,paper.height-100,110,110);
};
