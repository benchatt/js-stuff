var white;
var black;
var gray;
var red;
var blue;
var yellow;
var orange;
var purple;
var green;
var pink;
var lightPink;
var lime;
var cyan;
var g;

var Rectangle = function (x,y,w,h) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.rounding = false;
    this.rounds = [0,0,0,0];
    console.log("rect constr a " + x + " " + y + " " + w + " " + h);
    this.fill = null;
    this.stroke = null;
    //console.log("rect constr b");
};

Rectangle.prototype.setFill = function (fill) {
    //console.log("rect fill a");
    this.fill = fill;
    //console.log("rect fill b", this.fill);
};

Rectangle.prototype.setStroke = function (stroke) {
    //console.log("stroke fill a");
    this.stroke = stroke;
    //console.log("stroke fill b", this.stroke);
};

Rectangle.prototype.setRounding = function (rounding_) {
    this.rounding = true;
    switch (rounding_.length) {
        case 1:
            this.rounds = [rounding_, rounding_, rounding_, rounding_];
            break;
        case 2:
            this.rounds = [rounding_[0], rounding_[1], 0, 0];
            break;
        case 3:
            this.rounds = [rounding_[0], rounding_[1], rounding_[2], 0];
            break;
        case 4:
            this.rounds = rounding_;
            break;
        default:
            this.rounding = false;
            this.rounds = [0,0,0,0];
    };
    //console.log("rounding end");
};

Rectangle.prototype.render = function () {
    x = this.x; y = this.y; w = this.w; h = this.h;
    //console.log("rect render a");
    if (this.fill !== null) {fill(this.fill);};
    if (this.stroke !== null) {
        if (this.stroke === false) {
            noStroke();
        } else {stroke(this.stroke);};
    };
    if (this.rounding) {
        console.log("rect " + x + " " + y + " " + w + " " + h + " " + rounding);
        rect(x,y,w,h,rounding[0],rounding[1],rounding[2],rounding[3]);
    } else {
        console.log("rect " + x + " " + y + " " + w + " " + h);
        rect(x,y,w,h);
    };
    //console.log("rect render b");
};

var Loom = function () {
    //
    var STD = 18;
    var GAP = 8;

    var xrange; var yrange;
    var xcolors; var ycolors;

    var xpattern; var ypattern;

    this.xrange = STD;
    this.yrange = STD;
    this.xcolors = [];
    this.ycolors = [];
    this.GAP = GAP;
    this.STD = STD;
    this.setColors();

};

Loom.prototype.setColors = function(){
    //
    //console.log("setc a");
    var one = [0,1];
    var two = [0,0,1,1];
    var three = [0,0,0,0,0,0,1,1,1,1,1,1];
    var four = [0,1,0,1,0,1,0,0,1,1,0,0,1,1,1,0,0,0];
    var five = [0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0];
    var six = [0,0,0,1,1,1];
    var seven = [0,1,1];
    //var palette = [white,black,red,blue,green,lime,pink,purple,cyan,lightPink,yellow,orange];
    var patterns = [one,two,three,four,five,six,seven];
    this.xpattern = patterns[int(random(patterns.length))];
    this.ypattern = patterns[int(random(patterns.length))];
    //console.log("setc b");
    //var xc = [palette[int(random(palette.length))], palette[int(random(palette.length))]];
    //var yc = [palette[int(random(palette.length))], palette[int(random(palette.length))]];
    var xc = [color(random(255),random(255),random(255)), color(random(255),random(255),random(255))];
    var yc = [color(random(255),random(255),random(255)), color(random(255),random(255),random(255))];
    var j = 0;
    //console.log("setc c");
    for (var i=0; i<this.xrange; i++) {
        if (j>this.xpattern.length-1) {j = 0;}
        this.xcolors[i] = xc[this.xpattern[j]];
        j++;
    }
    //console.log("setc d");
    j = 0;
    for (var i=0; i<this.xrange; i++) {
        if (j>this.ypattern.length-1) {j = 0;}
        this.ycolors[i] = yc[this.ypattern[j]];
        j++;
    }
    //console.log("setc out");
};

Loom.prototype.renderAll = function() {
    var xrange = this.xrange; var yrange = this.yrange;
    var xcolors = this.xcolors; var ycolors = this.ycolors;
    //console.log(xcolors);
    var GAP = this.GAP;
    var wstep = int(width / (xrange + 4));
    var hstep = int(height / (yrange + 4));

    //console.log("render b "+wstep + " " +hstep);
    var wstart = wstep * 2;
    var hstart = hstep * 2;

    var ya = hstart;
    var xa; var strap;
    for (var i = 0; i<xrange; i++) {
        xa = int((i*wstep) + wstart);
        strap = new Rectangle(xa+GAP,ya,wstep-GAP,height-(hstart*2),5);
        strap.setFill(xcolors[i]);
        strap.setStroke(false);
        strap.render();
    };
    //console.log("render c");
    xa = wstart;
    for (var j = 0; j<yrange; j++) {
        ya = int((j*hstep) + hstart);
        strap = new Rectangle(xa,ya+GAP,width-(wstart*2),hstep-GAP,5);
        strap.setFill(ycolors[j]);
        strap.setStroke(false);
        strap.render();
    };
    console.log("render d");
    for (var i = 0; i<xrange; i++) {
        for (var j = 0; j<yrange; j++) {
            xa = int((i*wstep) + wstart);
            ya = int((j*hstep) + hstart);
            if (((i+j) & 1) == 1) {
                strap = new Rectangle(xa+GAP,ya,wstep-GAP,hstep);
                strap.setFill(xcolors[i]);
                if (xcolors[i] === ycolors[j]) {
                    strap.setStroke(gray);
                } else {
                    strap.setStroke(false);
                };
                strap.render();
            };
        };
    };
    console.log("render e");
};

function setup() {
    white = color(255);
    black = color(0);
    gray = color(150);
    red = color(240,0,50);
    blue = color(40,40,240);
    yellow = color(255,255,60);
    orange = color(255,180,40);
    purple = color(140,0,200);
    green = color(0,180,0);
    pink = color(255,100,230);
    lightPink = color(255,200,230);
    lime = color(0,230,0);
    cyan = color(0,230,230);

    g = createCanvas(600,600);
    g.background(gray);
    var loom = new Loom();
    loom.renderAll();
};

function draw() {
    //
};

function mousePressed() {
    setup();
}
