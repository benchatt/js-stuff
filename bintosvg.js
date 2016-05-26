var Board = function(size,paper) {
  var SIDE = ( 2000 / size ) * 0.8;
  var PAD = ( 2000 / ( size + 1 ) ) * 0.2;

  this.side = SIDE;
  this.pad = PAD;

  this.size = size;
  this.paper = paper;
  this.spaces = [];

  for (var i=0;i<=size;i++) {
    if (i<size) {
      this.spaces[i] = [];
    }
    for (var j=0;j<=size;j++) {
      if (i<size && j<size) {
        this.createSpace(i,j);
      }
    }
  }
}

Board.prototype.createSpace = function (x,y) {
  var tempSpace = new Space(x,y,this);
  this.spaces[x][y] = tempSpace;
};

var Space = function(x,y,board) {
  this.x = x;this.y = y;
  this.board = board;

  this.side = board.side;
  this.pad = board.pad;

  this.n = [y-1,x];
  this.s = [y+1,x];
  this.e = [y,x+1];
  this.w = [y,x-1];

  if (this.n[0]<0) {this.n = null;}
  if (this.w[1]<0) {this.w = null;}
  if (this.e[1]>this.board.size) {this.e = null;}
  if (this.s[0]>this.board.size) {this.s = null;}
  this.create();
}

Space.prototype.setColor = function (col_in) {

};

Space.prototype.create = function () {
  var rounding = parseInt(this.pad / 2);
  var xoffset = (this.x * (this.side + this.pad)) + this.pad;
  var yoffset = (this.y * (this.side + this.pad)) + this.pad;
//  console.log(xoffset,yoffset);
  this.board.paper.rect(xoffset,yoffset,this.side,this.side,rounding)
                  .attr({fill:'ecc',
                         stroke: '200',
                         'stroke-width': 3});
};

window.onload = function () {
    var paper = new Raphael(document.getElementById('canvas_container'),2000,2000);
    var board = new Board(8,paper);
  }
