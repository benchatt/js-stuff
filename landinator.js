var COASTVAR, WIDTH, HEIGHT, GROUND, DROPOFF;
var PHASE;
var SETUP, GO;
var c, BUTTON, POINTS, TOPIA, BORDER;

var Country = function(points,field){
  this.points = this.orderPoints(points);
  this.field = this.genField(this.points,field);
};

Country.prototype.orderPoints = function (points) {
  var tmp = points;
  var outpoints = [];
  var one = tmp.pop();
  outpoints.push(one);
  while (tmp.length > 1) {
    var king = -1; var kinglength = 10000; var trydist;
    for (var i=0;i<tmp.length;i++){
      trydist = one.dist(tmp[i]);
      if (trydist<kinglength){
        kinglength = trydist;
        king = i;
      };
    };
    one = tmp[king];
    outpoints.push(one);
    tmp.splice(king,1);
  };
  outpoints.push(tmp[0]);
  return outpoints;
};

Country.prototype.genField = function (points,field) {
  var one, two, tmppt, tmpx, tmpy, breadth, punt;
  for (var i=0;i<points.length;i++){
    punt = random(1);
    if (punt>0.9) {
      breadth = 1;
    } else {
      breadth = COASTVAR;
    };
    one = points[i];
    if (i===points.length-1) {
      two = points[0];
    } else {
      two = points[i+1];
    };
    for (var j=0;j<1.01;j+=1/one.dist(two)) {
      tmppt = p5.Vector.lerp(one,two,j);
      tmpx = tmppt.x;
      tmpy = tmppt.y;
      for (var ix=floor(tmpx-(breadth/2));ix<ceil(tmpx+(breadth/2));ix++) {
        for (var iy=floor(tmpy-(breadth/2));iy<ceil(tmpy+(breadth/2));iy++) {
          field[ix][iy] = field[ix][iy] - (DROPOFF - random(1)) - (i+j);
        };
      };
    };
  };
  return field;
};

var Border = function (country,stroke) {
  this.field = country.field;
  this.points = country.points;
  this.origin = this.points[0];
  this.current_ = this.origin;
  this.path = [];
  this.stroke = stroke;
};

Border.prototype.go = function () {
  var last = [this.current_.x,this.current_.y];
  var best = [0,0];
  var bestscore = 1000000;
  var found = false;
  for(var ix=-1;ix<2;ix++) {
    for(var iy=-1;iy<2;iy++) {
      if (ix===0 && iy===0) {continue;};
      var curr = [last[0]+ix,last[1]+iy];
      if (curr[0]<0 || curr[0]>this.field.length-1) {continue;};
      if (curr[1]<0 || curr[1]>this.field[curr[0]].length-1) {continue;};
      if (this.field[curr[0]][curr[1]] < bestscore && !this.path.includes(curr.toString())) {
        best = curr;
        bestscore = this.field[curr[0]][curr[1]];
        found = true;
      };
    };
  };
  if (!found) {
    var shots = [[-2,0],[-2,2],[-2,-2],[0,-2],[0,2],[2,0],[2,2],[2,-2]];
    for (var i=0;i<shots.length;i++) {
      if (!this.path.includes(shots[i].toString())) {
        best = shots[i];
      };
    };
  };
  this.path.push(best.toString());
  this.current_ = createVector(best[0],best[1]);
  stroke(this.stroke);
  point(this.x,this.y);
};

var Button = function (x,y,w,h,fill) {
  this.x = x; this.y = y; this.w = w; this.h = h;
  this.fill = fill;
  this.render();
};

Button.prototype.render = function () {
  noStroke();
  fill(this.fill);
  ellipse(this.x,this.y,this.w,this.h);
};

Button.prototype.isHit = function (x,y) {
  var bigger = this.w > this.h ? this.w : this.h;
  var loc = createVector(x,y);
  var ori = createVector(this.x,this.y);
  var delta = loc.dist(ori);
  return (delta<bigger);
};

function blankField(w,h) {
  var f = [];
  for(var ix=0;ix<w;ix++) {
    f[ix] = [];
    for(var iy=0;iy<h;iy++) {
      f[ix][iy] = GROUND;
    };
  };
  return f;
};

function dropPoint(x,y) {
  noStroke();
  fill(180);
  ellipse(x-4,y-4,4,4);
  POINTS.push(createVector(x,y));
};

function setup () {
  HEIGHT = 500; WIDTH = 500;
  COASTVAR = 10; DROPOFF = 40; GROUND = 60;
  SETUP = 0; GO = 1;
  PHASE = SETUP;
  POINTS = [];
  TOPIA = null; BORDER = null;
  c = createCanvas(WIDTH,HEIGHT);
  c.background(50);
  BUTTON = new Button(WIDTH-30,HEIGHT-30,15,15,color(30,180,0));
};

function draw() {
  var x,y;
  if (PHASE === SETUP) {
    if (mouseIsPressed) {
      x = mouseX; y = mouseY;
    } else if (touchIsDown) {
      x = touchX; y = touchY;
    };
    if (!mouseIsPressed && !touchIsDown) {return null;};
    if (BUTTON.isHit(x,y)) {
      console.log("hit");
      PHASE = GO;
      background(50);
      TOPIA = new Country(POINTS,blankField(WIDTH,HEIGHT));
      BORDER = new Border(TOPIA,color(180));
    } else {
      dropPoint(x,y);
    };
  } else if (PHASE === GO) {
    BORDER.go();
  };
};
