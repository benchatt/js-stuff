var Board = function(size,paper,xoffset,yoffset) {
  var SIDE = ( paper.width / size ) * 0.8;
  var PAD = ( paper.width / ( size + 1 ) ) * 0.2;

  this.side = SIDE;
  this.pad = PAD;
  this.xstart = xoffset; //offset from paper
  this.ystart = yoffset;

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

Board.prototype.nibsToSpaces = function (nibstring) {
  this.nibs = nibstring.split('');
  if (this.nibs.length < 16) {
    this.nibs = '';
    return false;
  }
  var x=0; var y=0;
  for (var i=0; i<this.nibs.length; i++) {
    x = ((i&1) ? 1 : 0)*4;
    y = Math.floor(i/2);
    var bin = parseInt(this.nibs[i], 16).toString(2);
    var bits = bin.split('');
    for(var j=0; j<bits.length; j++) {
      if (bits[j] === 1) {
        this.spaces[x][y].toggle();
      } else {
        this.spaces[x][y].toggle();
      }
    }
  }
};

Board.prototype.spacesToDec = function () {
  var nib = [];
  var decs = [];
  for (var i=0; i<this.spaces.length; i++) {
    byte = this.spaces[i];
    nib[0] = byte.slice(0,4).map(String);
    nib[1] = byte.slice(4).map(String);
    decs.push(parseInt(nib[0].join(''),2));
    decs.push(parseInt(nib[1].join(''),2));
  }
  return decs;
};

var Space = function(x,y,board) {
  this.x = x;this.y = y;
  this.board = board;
  this.active = false;

  this.side = board.side;
  this.pad = board.pad;

  this.create();
}

Space.prototype.toggle = function () {
  this.active = !this.active;
  if (this.active) {
    this.setColor('#242');
  } else {
    this.setColor('#ecc');
  }
};

Space.prototype.setColor = function (col_in) {
  this.shape.attr({fill: col_in});
};

Space.prototype.create = function () {
  var self = this;
  var rounding = parseInt(this.pad / 2);
  var xoffset = (this.x * (this.side + this.pad)) + this.pad;
  var yoffset = (this.y * (this.side + this.pad)) + this.pad;

//  console.log(xoffset,yoffset);
  this.shape = this.board.paper.rect(xoffset,yoffset,this.side,this.side,rounding)
                         .attr({fill:'ecc',
                           stroke: '200',
                           'stroke-width': 3})
                          .click(self.toggle());
};

var LabelField = function(paper,board,xoffset) {
  this.paper = paper;
  this.board = board;
  this.xoffset = xoffset; //offset from paper
  this.labels = [];
  createLabels();
}

LabelField.prototype.createLabels = function () {
  var decs = this.board.spacesToDec();
  for (var i=0;i<decs.length;i=i+2) {
    var temp = this.paper.text(this.xoffset+this.board.pad, this.board.yoffset+this.board.pad
                               "First, " + decs[i].toString() + ", then" +
                               decs[i+1].toString() + ":")
                          .attr({font: Courier,
                                 'font-size': 16,
                                 'font-family': monospace,
                                  fill: '#242'});
  }
};

LabelField.prototype.resetLabels = function () {
  var decs = this.board.spacesToDec();
  for (var i=0;i<decs.length;i=i+2) {
    this.labels[Math.floor(i/2)].text = "First, " + decs[i].toString() + ", then" +
                                        decs[i+1].toString() + ":";
  }
};

window.onload = function () {
    var paper = new Raphael(document.getElementById('canvas_container'),2000,2000);
    var board = new Board(8,paper);
  }
