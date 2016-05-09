var Board = (size) {
  this.size = size;
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
  var tempVert = new Border(x,y,0);
  var tempHoriz = new Border(x,y,1);
  if (tempVert !== null) {this.borders[0][x][y] = tempVert;}
  if (tempHoriz !== null) {this.borders[1][x][y] = tempHoriz;}
};

var Space = function(x,y,board) {
  this.x = x;this.y = y;
  this.board = board;

  this.n = [y-1,x];
  this.s = [y+1,x];
  this.e = [y,x+1];
  this.w = [y,x-1];

  if (this.n[0]<0) {this.n = null;}
  if (this.w[1]<0) {this.w = null;}
  if (this.e[1]>this.board.size) {this.e = null;}
  if (this.s[0]>this.board.size) {this.s = null;}
  this.occupant = null;
}

Space.prototype.setColor = function (col_in) {

};

Space.prototype.create = function () {

};

var Border = function(x,y,ori) {
  var VERT = 0; var HORIZ = 1;
  this.x = x; this.y = y;
  this.orientation = ori;
  this.walled = false;
}

Border.prototype.toggleWall= function () {
  this.walled = !this.walled;
};

Border.prototype.create = function () {

};

var Die = function(faces) {
  this.faces = faces;

}

Die.prototype.roll = function () {

};

Die.prototype.create = function () {

};

var Token = function (type,x,y,board) {
  this.type = type;
  this.board = board;
  this.x = x;
  this.y = y;
  this.space = board.spaces[x][y];
  board.spaces[x][y].occupant = this;
}

Token.prototype.create = function () {

};

var Minotaur = function (x,y,board) {
  this.x = x;
  this.y = y;
  this.board = board;
}

Minotaur.prototype.move = function () {

};

Minotaur.prototype.create = function () {

};

var Player = function (number) {
  this.number = number;
}

var Turn = function (player,state) {
  var INIT_WALL = 0; //placement of initial walls
  var INIT_PLAYER = 1; //placement of players on their rows/cols
  var SELECT_PLAYER = 2; //choose which player moves
  var MOVE_PLAYER = 3; //move player, prep to move Minotaur
  var MOVE_MINOTAUR = 4; //move Minotaur
  var MOVE_ESCAPE = 5; //Minotaur is dead, move to escape
  var GAME_OVER = 6;
  var SUCCESS = 7;
  this.player = player;
  this.state = state;
}

var Session = function (nplayers,size) {
  this.n = nplayers;
  this.board = new Board(size);
  this.players = [];
  this.dice['d10a'] = new Die(10);
  this.dice['d10b'] = new Die(10);
  this.dice['nsew'] = new Die(4);
}

Session.prototype.setPlayers = function () {
  for (var i=0;i<this.n;i++) {
    this.players.push(new Player(i));
  }
  //colors
  //random start locations
};

Session.prototype.start = function () {
  //run through the phases in order
};

window.onload = function () {
  var SIZE = 10;
  var SQUARE_SIZE = 40;
  var paper = new Raphael(document.getElementById('canvas_container'),500,500);
  //set graphic: ask how many players
  sesh = new Session(nplayers, SIZE);
  sesh.start();
}
