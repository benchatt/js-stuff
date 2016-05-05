var Space = function(x,y) {
  this.x = x;this.y = y;

  this.n = [y-1,x];
  this.s = [y+1,x];
  this.e = [y,x+1];
  this.w = [y,x-1];
}

Space.prototype.setColor = function (col_in) {

};

Space.prototype.create = function () {

};

var Border = function(space1,space2) {
  var VERT = 0; var HORIZ = 1;
  var dx = space1.x - space2.x;
  var dy = space1.y - space2.y;

  if (dx === 0 && dy !== 0) {
    this.orientation = VERT;
  } else if (dx !== 0 && dy === 0) {
    this.orientation = HORIZ;
  } else {
    this.orientation = false;
  }
}

var Die = function(faces) {

}

window.onload = function () {
  var paper = new Raphael(document.getElementById('canvas_container'),500,500);
}
