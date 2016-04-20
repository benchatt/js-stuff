var PlayBoard = function (paper,xdim,ydim) {
  this.paper = paper;
  this.xdim = xdim; this.ydim = ydim;
  var sqw = Math.floor(this.paper.width / xdim);
  this.squares = this.squareInit(xdim,ydim,sqw);
}

PlayBoard.prototype.squareInit = function (x,y,w) {
  var temp = [];
  for (var ix=0;ix<x;ix++) {
    temp[x] = [];
    for (var iy=0;iy<y;iy++) {
      temp[x][y] = new Square(this.paper,x,y,w);
    }
  }
};

var Square = function (paper,x,y,w) {
  this.x = x;
  this.y = y;
  this.paper = paper;
  var self = this;
  this.shape = paper.rect((x-1)*w,(y-1)*w,x*w,y*w,6)
                    .attr({fill: '#fff',
                           stroke: '#222',
                           stroke-width: 4,
                         })
                    .click(function (evt) {
                      //click stuff here
                    });
  this.occ = null;
}

var Player = function (board) {
  this.board = board;
  
}

window.onload = function () {
  var paper = new Raphael(document.getElementById('canvas_container'),600,700);
  //var ticker, a plaintext field w scrollbars for the program
  var board = new PlayBoard(paper,8,8);
  var input = new InputField(paper,board,600); //y-value
  board.initObstacles();
  var sprite = new Player(board);
}
