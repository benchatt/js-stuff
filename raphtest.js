var Traveler = function (obj, ori, dest) {
  this.thing = obj;
  this.ori = ori;
  this.dest = dest;
  this.vel = Victor(0,0);
}

window.onload = function() {
  var paper = new Raphael(document.getElementById('canvas_container'),500,500);
}
