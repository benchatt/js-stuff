//varspace
var MARGIN; var M;
var OFFC; var ONC;
var MBACKGROUND; var SELCOLOR;
var MSTROKE; var MARGIN;
var KEYS;

var Nibble = function (row,col,matrix) {
  this.row = row;
  this.col = col;
  this.matrix = matrix;
  this.state = 0;
  this.bits = [];
  this.active = false;
  this.assignBits();
};

Nibble.prototype.assignBits = function () {
  state = this.state;
  var binstate = state.toString(2);
  var strbits = binstate.split('');
  while (strbits.length < 4){
    strbits.unshift("0");
  }
  this.bits = strbits.map(Number);
};

Nibble.prototype.render = function () {
  var xo = this.matrix.xoff; var yo = this.matrix.yoff;
  var colors = this.matrix.nibcolors;
  var px = this.matrix.side;
  if (this.bits.length === 4) {
    var xstep = px+MARGIN; var ystep = px+MARGIN;
    if (this.active) {
      fill(this.matrix.bsel);
      stroke(this.matrix.sel);
      rect(this.col*xstep*4+2+xo,this.row*ystep+2+yo,xstep*4+(MARGIN/2),ystep+(MARGIN/2),1,5,1,5);
    };
    for (var i=0; i<this.bits.length; i++) {
      stroke(this.matrix.stroke_);
      fill(colors[this.bits[i]]);
      var xstart = (this.col*xstep*4)+i*xstep+MARGIN;
      var y = this.row*ystep+MARGIN;
      rect(xo+xstart,yo+y,px,px,2);
    };
    if (this.matrix.label_ !== null) {this.matrix.label_.render();};
  } else {return false;};
};

//

var Matrix = function (rows,cols,boxlengths) {
  this.xoff = 0; this.yoff = 0;
  this.rownum = rows;
  this.colnum = cols;
  this.side = boxlengths;
  this.xlen = (MARGIN*5*this.colnum)+(this.side*4*this.colnum);
  this.ylen = (MARGIN*(this.rownum+2))+(this.side*this.rownum);
  //this.pointer = new Pointer(0,0,this);
  this.nibbles = [];
  this.bkg = MBACKGROUND;
  this.sel = SELCOLOR;
  this.bsel = BSELCOLOR;
  this.stroke_ = MSTROKE;
  this.nibcolors = [OFFC,ONC];
  this.select = createVector(0,0);
  this.label_ = null;
  for (var i=0;i<rows;i++) {
    this.nibbles[i] = [];
    for (var j=0;j<cols;j++) {
      this.nibbles[i][j] = new Nibble(i,j,this);
    };
  };
};

Matrix.prototype.refresh = function () {
  this.renderBkg();
  this.updateSelection();
};

Matrix.prototype.offset = function (x,y) {
  this.xoff = x; this.yoff = y;
};

Matrix.prototype.labelize = function () {
  this.label_ = new Label(this);
};

Matrix.prototype.updateSelection = function () {
  if (this.select !== null) {
    this.nibbles[this.select.x][this.select.y].active = true;
  };
  this.renderAll();
};

Matrix.prototype.sendValue = function (val) {
  var nib = this.nibbles[this.select.x][this.select.y];
  nib.state = val;
  nib.assignBits();
  this.renderAll();
};

Matrix.prototype.assignString = function (code) {
  var states = code.split('');
  var h = 0;
  for (var i=0;i<this.nibbles.length;i++) {
    for (var j=0;j<this.nibbles[i].length;j++) {
      this.select = createVector(i,j);
      var outstate = parseInt(states[h],16);
      this.sendValue(outstate);
      h++;
    };
  };
  this.select = null;
};

Matrix.prototype.moveSelect = function (r,c) {
  var selnib = this.nibbles[this.select.x][this.select.y];
  selnib.active = false;
  var mov = createVector(r,c);
  var rownum = this.rownum; var colnum = this.colnum;
  this.select.add(mov);
  if (this.select.x < 0) {this.select.x = 0;};
  if (this.select.y < 0) {this.select.y = 0;};
  if (this.select.x > rownum-1) {this.select.x = rownum-1;};
  if (this.select.y > colnum-1) {this.select.y = colnum-1;};
  this.updateSelection();
  this.renderBkg();
  this.renderAll();
};

Matrix.prototype.renderBkg = function () {
  noStroke();
  fill(this.bkg);
  rect(this.xoff,this.yoff,this.xlen,this.ylen);
};

Matrix.prototype.renderAll = function () {
  //this.renderBkg();
  for (var i=0;i<this.nibbles.length;i++) {
    for (var j=0;j<this.nibbles[i].length;j++) {
      this.nibbles[i][j].render();
    };
  };
  if (this.label_ !== null) {
    this.label_.render();
  }
};

var Label = function (matrix) {
  this.matrix = matrix;
  this.xoff = this.matrix.xoff;
  this.yoff = this.matrix.ylen+MARGIN;
  this.xwidth = this.xoff + (4*MARGIN*this.matrix.rownum);
  this.xstep = this.xwidth / this.matrix.rownum;
};

Label.prototype.render = function () {
  textFont("Courier");
  textSize(28);
  noStroke();
  fill(this.matrix.bkg);
  rect(this.xoff+(8*MARGIN)-2,this.yoff+MARGIN,this.xwidth,38,5);//change 20 to font size
  var strout = '';
  var nibs = this.matrix.nibbles;
  for (var i=0;i<nibs.length;i++) {
    for (var j=0;j<nibs[i].length;j++) {
      var state = nibs[i][j].state;
      strout = strout + state.toString(16);
    }
    fill(this.matrix.nibcolors[1]);
    text(strout,this.xoff+(i*this.xstep)+(8*MARGIN),this.yoff+(4*MARGIN));
    strout = '';
  }
};

//

function setup(){
  var g = createCanvas(1000,600);
  var insize = 500;
  g.background(70);
  KEYS = ['0','1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','A','B','C','D','E','F'];
  OFFC = color(40);
  ONC = color(180);
  MBACKGROUND = color(0);
  SELCOLOR = color(0,180,40);
  BSELCOLOR = color(0,60,10);
  MSTROKE = color(255);
  var cols = 2;
  var side = (insize * 0.8) / (cols * 4);
  var codes = ["c3c3663c18181818","187e66c3ffffc3c3","feffc3fec7c3fffe","7effc3c0c0c3ff7e","feffc3c3c3c3fffe","ffffc0fefec0ffff","ffffc0fcfcc0c0c0","7effc3c0c7c3ff7f","c3c3c3ffffc3c3c3","3c3c181818183c3c","7e7e0c0c0c6c7c38","c6ccd8f0d8ccc6c3","c0c0c0c0c0c0ffff","c3e7ffdbc3c3c3c3","c3e3f3dbdbcfc7c3","3c7ec3c3c3c37e3c","feffc3fffec0c0c0","3c7ec3c3cbcf7e3f","feffc3fffeccc6c3","3f7fc0fe7f03fefc","ffff181818181818","c3c3c3c3c3c3ff7e","c3c366663c3c1818","c3c3c3dbdbdbff66","c3663c18183c66c3","ffff0e1c3870ffff","7e81a581a599817e","181c16121070f060","8442211008844221","1a264281819999ff","0066999942241800","3c4299a5a599423c"];
  MARGIN = (insize * 0.2) / ((cols*4) + 2);
  M = new Matrix(8,2,side);
  M.labelize();
  M.refresh();
  N = new Matrix(8,2,side);
  N.offset(500,0);
  N.nibbles[N.select.x][N.select.y].active = false;
  N.select = null;
  N.nibcolors = [color(70,30,30),color(190,100,100)];
  N.refresh();
};

function keyPressed(){
  if (KEYS.includes(key)) {
    M.sendValue(parseInt(key,16));
  } else if (keyCode === UP_ARROW) {
    M.moveSelect(-1,0);
  } else if (keyCode === DOWN_ARROW) {
    M.moveSelect(1,0);
  } else if (keyCode === LEFT_ARROW) {
    M.moveSelect(0,-1);
  } else if (keyCode === RIGHT_ARROW) {
    M.moveSelect(0,1);
  };
};

function draw (){}
