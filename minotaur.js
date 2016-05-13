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
  //change color
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

var Player = function (number,session) {
  this.number = number;
  this.session = session;
}

Player.prototype.move = function (x,y) {
  this.location = [x,y];
};

Player.prototype.showAvailableMoves = function () {
  //highlight Spaces that are available moves.
  //add onclicks that point to a "move" function of player instance
};

var Session = function (nplayers,size,paper) {
  this.paper = paper;
  this.n = nplayers;
  this.board = new Board(size);
  this.players = [];
  this.dice['d10a'] = new Die(10);
  this.dice['d10b'] = new Die(10);
  this.dice['nsew'] = new Die(4);
}

Session.prototype.setPlayers = function () {
  for (var i=0;i<this.n;i++) {
    this.players.push(new Player(i,this));
  }
  //colors
  //random start locations
};

Session.prototype.start = function () {
  //run through the phases in order
  var PLAYER_WALLS = Math.ceil(21/this.n);
  this.playersSetWalls(PLAYER_WALLS);
  this.initializePlayers();
  var RANDOM_WALLS = 41 - PLAYER_WALLS;
  this.rollForWalls(RANDOM_WALLS);
  var MINOTAURS = 2;
  this.initializeMinotaurs(MINOTAURS);
  var PLAYER_MOVES = this.n;
  this.turnStates(PLAYER_MOVES);
};

Session.prototype.playersSetWalls = function (nwalls) {
  for (var i=0;i<nwalls;i++) {
    //output that player (i%4)+1 is up
    //accept a click from player
    //identify the Border object and toggleWall
  };
  return true;
};

Session.prototype.initializePlayers = function () {
  for (var i=0;i<this.n;i++) {
    var place = Math.ceil(Math.random(10));
    //find x,y based on player number
    //check collisions
    //set player's x,y
    //^^also sets correct token to Space object
  }
  for (var i=this.n;i<4;i++) {
    this.initializeAmulet(i);
  }
};

Session.prototype.initializeAmulet = function (id) {
  //find x,y based on id
  //check collisions
  //set amulet x,y
  var newtoken = new Token("amulet",x,y,this.board);
  //newtoken.set a bunch of stuff
  this.amulets.push(newtoken);
};

Session.prototype.rollForWalls = function (nwalls) {
  for (var i=0;i<nwalls;i++) {
    var ori=0; var x=0; var y=0;
    do {
      ori = Math.round(Math.random());
      if (ori===0) {
        x = Math.floor(Math.random(this.board.size+2));
        y = Math.floor(Math.random(this.board.size+1));
      } else {
        x = Math.floor(Math.random(this.board.size+1));
        y = Math.floor(Math.random(this.board.size+2));
      }
    } while (this.board.borders[ori][x][y].walled);
    this.board.borders[ori][x][y].toggleWall();
  }
};

Session.prototype.initializeMinotaurs = function (nminos) {
  for (var i=0;i<nminos;i++) {
    x = Math.floor(Math.random(this.board.size+1));
    y = Math.floor(Math.random(this.board.size+1));
    if (this.board.spaces[x][y].occ === null) {
      this.minotaurs.push(new Minotaur(x,y));
    }
  }
};

Session.prototype.turnStates = function (m) {
  //players' turn
  this.allowMoves(m);
  //during each move, check for:
    //collision
    //full unity
    //win condition
  //minos' turn
  //each mino rolls the d4.
  //check to see if wall directly in that direction, if so re-roll
  //roll d10
  //go as many open spaces as possible
  //check collisions
  //check for lose condition
};

Session.prototype.allowMoves = function (m) {
  for (var i=0;i<this.n;i++) {
    this.player[i].showAvailableMoves();
  };

};

window.onload = function () {
  var SIZE = 10;
  var SQUARE_SIZE = 40;
  var paper = new Raphael(document.getElementById('canvas_container'),500,500);
  //set graphic: ask how many players
  sesh = new Session(nplayers, SIZE, paper);
  sesh.start();
}
