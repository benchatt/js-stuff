var PLEXES;

var Goo = function() {
  this.center = createVector(random(width),random(height));
  this.vertexes = this.genVertexes(this.center);
  this.fill = color(random(255),random(255),random(255),200);
};

Goo.prototype.genVertexes = function (center) {
  var verts = [];
  var steps = floor(random(3)+5);
  var slice = (2*PI) / steps;
  for(var i=0; i<steps; i++) {
    var newx = center.x + (25 * sin(slice*i)) + (random(8)-4);
    var newy = center.y + (25 * cos(slice*i)) + (random(8)-4);
    verts.push(createVector(newx,newy));
  };
  return verts;
};

Goo.prototype.render = function () {
  fill(this.fill);
  beginShape();
  for(var i=0;i<this.vertexes.length;i++) {
    curveVertex(this.vertexes[i].x,this.vertexes[i].y);
    stroke(this.fill);
    noStroke();
  };
  endShape(CLOSE);
};

Goo.prototype.smootheVertexes = function (center) {
  for(var i=0;i<this.vertexes.length;i++) {
    if (this.vertexes[i].x>this.center.x) {
      this.vertexes[i].x -= random(5);
    } else {
      this.vertexes[i].x += random(5);
    };
    if (this.vertexes[i].y > this.center.y) {
      this.vertexes[i].y -= random(5);
    } else {
      this.vertexes[i].y += random(5);
    };
  };
};

Goo.prototype.smootheColor = function (target) {
  this.fill = lerpColor(this.fill,target,0.005);
};

Goo.prototype.tugCenter = function (target) {
  var newx = lerp(this.center.x,target.x,0.005);
  var newy = lerp(this.center.y,target.y,0.005);
  this.center = createVector(newx,newy);
  this.vertexes = this.genVertexes(this.center);
};

var Plex = function (x,y) {
  this.center = createVector(x,y);
  this.goos = [];
};

Plex.prototype.addGoo = function (goo) {
  this.goos.push(goo);
};

Plex.prototype.swirl = function () {
  var ncoltarget = this.genColorTarget();
  for(var i=0;i<this.goos.length;i++){
    var nt = createVector(this.center.x+random(10)-5,this.center.y+random(10)-5);
    this.goos[i].tugCenter(nt);
  };
};

Plex.prototype.moveAll = function () {
  var ncoltarget = this.genColorTarget();
  var ncentarget = this.genCenterTarget();
  for(var i=0;i<this.goos.length;i++){
    this.goos[i].tugCenter(ncentarget);
    //this.goos[i].smootheColor(ncoltarget);
  };
};

Plex.prototype.genColorTarget = function () {
  var col = this.goos[0].fill;
  for(var i=1;i<this.goos.length;i++){
    col = lerpColor(col,this.goos[i].fill,0.5);
  };
  return col;
};

Plex.prototype.genCenterTarget = function () {
  var cen = this.goos[0].center;
  var newx, newy;
  for(var i=1;i<this.goos.length;i++){
    newx = lerp(cen.x,this.goos[i].center.x,0.5);
    newy = lerp(cen.y,this.goos[i].center.y,0.5);
    cen = createVector(newx,newy);
  };
  return cen;
};

Plex.prototype.drawAll = function () {
  for(var i=0;i<this.goos.length;i++){
    this.goos[i].render();
  };
};

Plex.prototype.isConverged = function () {
  var cen = this.goos[0].center;
  var converged = true;
  for(var i=1;i<this.goos.length;i++){
    if (cen.dist(this.goos[i].center)>3){
      converged = false;
    };
  };
  return converged;
};

function setup () {
  PLEXES = [];
  var c = createCanvas(1200,600);
  c.background(50);
  noStroke();
  frameRate(20);
  for(var i=0;i<ceil(random(4))+1;i++){
    var p = new Plex(random(width),random(height));
    for(var j=0;j<random(10)+4;j++){
      var g = new Goo();
      p.addGoo(g);
    };
    PLEXES.push(p);
  };
};

function draw() {
  background(50);
  var converged = false;
  for(var i=0;i<PLEXES.length;i++){
    converged = converged | PLEXES[i].isConverged();
    PLEXES[i].drawAll();
    PLEXES[i].swirl();
    PLEXES[i].moveAll();
  };
  if (converged) {setup();};
};
