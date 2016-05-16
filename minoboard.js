var Board = function(size,paper) {
  var SIDE = 35;
  var PAD = 12;

  this.side = SIDE;
  this.pad = PAD;

  this.size = size;
  this.paper = paper;
  this.spaces = [];
  this.borders = [];

  this.borders[0] = [];
  this.borders[1] = [];
  for (var i=0;i<=size;i++) {
    if (i<size) {
      this.spaces[i] = [];
      this.borders[1][i] = [];
    }
    this.borders[0][i] = [];
    for (var j=0;j<=size;j++) {
      if (i<size && j<size) {
        this.createSpace(i,j);
      }
      if ((i+j) < (size*2)) {
        this.createBorders(i,j);
      }
    }
  }
}

Board.prototype.createSpace = function (x,y) {
  var tempSpace = new Space(x,y,this);
  this.spaces[x][y] = tempSpace;
};

Board.prototype.createBorders = function (x,y) {
  if (this.borders[0][x] !== undefined && y<this.size)
    {this.borders[0][x][y] = new Border(x,y,0,this);}
  if (this.borders[1][x] !== undefined) {this.borders[1][x][y] = new Border(x,y,1,this);}
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
  var xoffset = (this.x * (this.side + this.pad)) + this.pad;
  var yoffset = (this.y * (this.side + this.pad)) + this.pad;
//  console.log(xoffset,yoffset);
  this.board.paper.rect(xoffset,yoffset,this.side,this.side,6)
                  .attr({fill:'ecc',
                         stroke: '200',
                         'stroke-width': 3});
};

var Border = function(x,y,ori,board) {
  var VERT = 0; var HORIZ = 1;
  this.x = x; this.y = y;
  this.orientation = ori;
  this.board = board;
  this.walled = false;
  this.side = board.side;
  this.pad = board.pad;
  this.create();
}

Border.prototype.toggleWall = function () {
  this.walled = !this.walled;
  //change color
};

Border.prototype.create = function () {

  if (this.orientation === 0) {
    var xoffset = (this.x * (this.side + this.pad)) + (this.pad/2);
    var yoffset = (this.y * (this.side + this.pad)) + this.pad;
    var spath = "M"+xoffset.toString()+" "+yoffset.toString()+"L"+xoffset.toString()+
                " "+(yoffset+this.side).toString();
    this.board.paper.path(spath)
              .attr({stroke:'aca',
                     'stroke-width': 3
              });
  } else {
    var xoffset = (this.x * (this.side + this.pad)) + this.pad;
    var yoffset = (this.y * (this.side + this.pad)) + (this.pad/2);
    var spath = "M"+xoffset.toString()+" "+yoffset.toString()+"L"+
                (xoffset+this.side).toString()+" "+yoffset.toString();
    this.board.paper.path(spath)
              .attr({stroke:'aca',
                     'stroke-width': 3
              });
  }
};

window.onload = function () {
    var paper = new Raphael(document.getElementById('canvas_container'),500,500);
    var board = new Board(10,paper);
}
