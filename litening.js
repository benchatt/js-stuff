var HEIGHT;
var WIDTH;
var DROPOFF;
var currentBolt;
var BOLTS;

var Strike = function (field, x, cstep) {
  this.x = x;
  this.y = 0;
  this.field = field;
  this.fill = color(150+cstep);
  this.path = [];
};

Strike.prototype.go = function () {
  var last = [this.x,this.y];
  var best = [0,0];
  var bestscore = 100000;
  for(var ix=-1;ix<2;ix++) {
    for(var iy=-1;iy<2;iy++) {
      if (ix===0 && iy===0) {continue;};
      var curr = [last[0]+ix,last[1]+iy];
      if (curr[0]<0 || curr[0]>this.field.length-1) {continue;};
      if (curr[1]<0 || curr[1]>this.field[curr[0]].length-1) {continue;};
      if (this.field[curr[0]][curr[1]] < bestscore && !this.path.includes(curr.toString())) {
        best = curr;
        bestscore = this.field[curr[0]][curr[1]];
      };
    };
  };
  console.log(best);
  this.path.push(best.toString());
  this.x = best[0]; this.y = best[1]
  stroke(this.fill);
  point(this.x,this.y);
};

function genField(w,h) {
  var f = [];
  var step = DROPOFF/HEIGHT;
  for(var ix=0;ix<w;ix++) {
    f[ix] = [];
    for(var iy=0;iy<h;iy++) {
      f[ix][iy] = random(1)-(iy*step);
    };
  };
  return f;
};

function setup () {
  WIDTH = 700;
  HEIGHT = 300;
  DROPOFF = 30;
  BOLTS = [];
  currentBolt = 0;
  var c = createCanvas(WIDTH,HEIGHT);
  c.background(60);
  var field;
  var strikes = random(10) + 20;
  for (var i=0;i<strikes;i++) {
    field = genField(WIDTH,HEIGHT);
    var bolt = new Strike(field,floor(random(WIDTH)),floor((i/strikes)*100));
    BOLTS.push(bolt);
  };
};

function draw () {
  if (BOLTS[currentBolt].y>height-2) {
    currentBolt++;
    if (currentBolt>=BOLTS.length) {
      setup();
    };
  };
  BOLTS[currentBolt].go();
};
