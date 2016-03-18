var placing; var moving; var firing; var dying;
var remaining;
var gamePhase;
//game phases
var PLACE; var PLAY; var ENDTURN; var ENDGAME;

var placePhase;
//place state phases
var NONE; var SELECT; var LOCATE; var FINISH;

var movePhase;
//move state phases
//tk

var aiPhase;
//AI move state phases
//tk

var blue; var gray; var lightGray; var darkGray;
var red; var yellow; var black; var white;
var green;

var bkg; var outside; var line; var highlight;

var RECT; var ELLIPSE; var TRIANGLE; var LINE;

//font stuff tk

var RADIUS; var histep;
var fields; //replace old w a hash of the board, palette, subfields
var sets; //replace old w a hash of the p1 piece set, etc
var moves; //replace old with a hash of temp, commit, ai moves, etc
var shots;
var counters;

var fieldsize; var piecemax; var movemax;

var tokenColors; var tokenShapes; var allTokenTypes;

var FONT;

var ORIGIN; var COMMIT;

var lastCell;
var snapshot; var tokensnaps;

var vvcount;

var coordString = function (x,y,z) {
	return parseInt(x).toString()+","+parseInt(y).toString()+","+parseInt(z).toString();
}

//CELL OBJECT

var Cell = function (x,y,z) {
	this.x = x;this.y = y;this.z = z;

	this.radius = RADIUS;
	this.color_=bkg; this.line=line;

	var high = sqrt(3)/2 * (2*this.radius);
	var wide = this.radius * 2;
	this.high = high; this.wide = wide;

	this.occupant = null;

	if ((x+y+z) !== 0) {
		this.exists = false;
	} else {
		var x0 = width / 2;
		var y0 = height / 2;
		var cartX = x0 + (this.x * wide * 0.75);
		var cartY = y0 + ( ( this.z - this.y ) * high * 0.5);
	};
	//console.log("cartX "+cartX+" cartY "+cartY+" w h "+width);
	if (cartX > width || cartY > height || cartX < 0 || cartY < 0) {
		this.exists = false;
	} else {
		this.cx = cartX;
		this.cy = cartY;
		this.exists = true;
	};
	this.n = coordString(x,y+1,z-1);
	this.ne = coordString(x+1, y, z-1);
	this.se = coordString(x+1, y-1, z);
	this.s = coordString(x, y-1, z+1);
	this.sw = coordString(x-1, y, z-1);
	this.nw = coordString(x-1, y+1, z);

};

Cell.prototype.setColor = function (newcol) {
	this.color_ = newcol;
	this.create();
};

Cell.prototype.setLineColor = function (newline) {
	this.line = newline;
	this.create();
	this.line = line;
};

Cell.prototype.setRadius = function (newrad) {
	this.radius = newrad;
};

Cell.prototype.create = function () {
	if (!this.exists) {return false};
	stroke(this.line);
	fill(this.color_);
	var angle = radians(60);
	var sx; var sy;
	beginShape();
	for (var a = 0; a < 6; a++) {
		sx = this.cx + (cos(a*angle) * this.radius);
		sy = this.cy + (sin(a*angle) * this.radius);
		vertex(sx,sy);
	};
	endShape(CLOSE);
	return true;
};

Cell.prototype.reset = function () {
	this.color_ = bkg;
	this.occupant = null;
	return create();
};

Cell.prototype.findDistanceTo = function (dest) {
	return max(abs(this.x - dest.x), abs(this.y - dest.y), abs(this.z - dest.z));
};

Cell.prototype.lerpTo = function (dest, t) {
	return [this.x + (dest.x - this.x) * t, this.y + (dest.y - this.y) * t, this.z + (dest.z - this.z) * t];
};

Cell.prototype.drawLineTo = function (dest) {
	var n = this.findDistanceTo(dest);
	var results = []; var lerp = [];
	for (var i = 0; i < n + 1; i++) {
		lerp = this.lerpTo(dest, (1.0/n) * i);
		results.push(this.cubeRound(lerp[0],lerp[1],lerp[2]));
	};
	return results;
};

Cell.prototype.findPathTo = function (dest) {
	var frontier = [];
	var came_from = {};
	frontier.push(this);
	came_from[this] = null;
	var curr; var neighbs;
	while (frontier.length > 0) {
		curr = frontier.shift();
		neighbs = curr.neighbors();
		neighbs.forEach(function(next) {
			var p1block = sets['p1-locs'].includes(next.coords());
			var p2block = sets['p2-locs'].includes(next.coords());
			if (!came_from.keys().includes(next) && !p1block && !p2block && next != null) {
				frontier.push(next);
				came_from[next] = curr;
			};
		}, this);
	};
	curr = dest;
	var path = [];
	path.push(curr);
	while (curr !== this) {
		curr = came_from[curr];
		path.push(curr);
	};
	path.reverse();
	return path;
};

Cell.prototype.cubeRound = function(x_,y_,z_,fieldname) {
	if (x_ === null || y_ === null || z_ === null || fieldname === null) {
		console.log("Missing argument cubeRound")
	}
	var rx = round(x_);
	var ry = round(y_);
	var rz = round(z_);
	//console.log(coordString(rx,ry,rz));

	var dx = abs(rx - x_);
	var dy = abs(ry - y_);
	var dz = abs(rz - z_);

	if (dx > dy && dx > dz) {
		rx = -ry - rz;
	} else if (dy > dz) {
		ry = -rx - rz;
	} else {
		rz = -rx - ry;
	};
	if (Object.keys(fields[fieldname]).includes(coordString(rx,ry,rz))) {
		return fields[fieldname][coordString(rx,ry,rz)];
	} else {return null;};
};

Cell.prototype.absToMap = function(cx_,cy_,fieldname) {
	//console.log(cx_+","+cy_);
	cx_ = cx_ - (width/2);
	cy_ = cy_ - (height/2);
	var q = (cx_ * (2.0/3.0)) / this.radius;
	var s = (-cx_ / 3.0 + (sqrt(3)/3.0) * cy_) / this.radius;
	var r = -q - s;
	return this.cubeRound(q,r,s,fieldname);
};

Cell.prototype.neighbors = function(fieldname) {
	var neighbs = [this.n,this.ne,this.se,this.s,this.sw,this.nw];
	var out = []; var x; var check;
	for (var i=0;i<6;i++) {
		x = neighbs[i];
        check = fields[fieldname][coordString(x[0],x[1],x[2])];
				if (check !== null) {
					out[i] = check;
				} else {
					out[i] = null;
				};
		};
		return out;
};

Cell.prototype.coords = function() {
	return coordString(this.x,this.y,this.z);
};

Cell.prototype.colorProfile = function () {
	var profile = {};
	profile['fill'] = this.color_;
	profile['border'] = this.line;
	profile['token'] = this.occupant;
	return profile;
};

// ************END CELL OBJECT

// ************BEGIN TOKEN OBJECT

var Token = function (loc,cellColor,charColor,shapeConst) {
	this.loc = loc; this.cellColor = cellColor;
	this.charColor = charColor; this.shapeConst = shapeConst;

	if (loc.exists) {this.loc.occupant = this; this.exists = true;}
	else {this.exists = false;};
	this.setShape();
};

Token.prototype.setShape = function () {
	var x = this.loc.cx;
	var y = this.loc.cy;
	if (this.shapeConst === RECT) {
		this.shape_ = new BShape([RECT, x - 8, y - 8, 16, 16]);
	} else if (this.shapeConst === ELLIPSE) {
		this.shape_ = new BShape([ELLIPSE, x, y, 18, 18]);
	} else if (this.shapeConst === TRIANGLE) {
		var a = this.loc.radius;
		var h = (sqrt(3.0)/2) * a;
		var d = h / 3.0;
		this.shape_ = new BShape([TRIANGLE, x, y - (2*d), x + (a/2), y + d, x - (a/2), y + d]);
	};
};

Token.prototype.setColor = function (c) {
	this.cellColor = c;
	this.render();
};

Token.prototype.setCharColor = function (c) {
	var x = this.charColor;
	this.charColor = c;
	this.render();
	this.charColor = x;
};

Token.prototype.render = function () {
	if (this.loc.exists && this.exists) {
		this.loc.setColor(this.cellColor);
		this.shape_.setStroke(this.cellColor);
		this.shape_.setFill(this.charColor)
		this.shape_.render();
		return true;
	} else {
		return false;
	};
};

Token.prototype.move = function (dest) {
	if (dest != null && dest.exists) {
		this.loc.reset();
		this.loc = dest;
		this.loc.occupant = this;
		this.setShape();
		return this.render();
	} else {
		return false;
	};
};

Token.prototype.tokenProfile = function () {
	var profile = {};
	profile['fill'] = this.cellColor;
	profile['stroke'] = this.charColor;
	profile['shape'] = this.shape_;
	profile['cell'] = this.loc;
	return profile;
};
//**************END TOKEN CLASS

//**************BEGIN BULLET CLASS

var Bullet = function (ax,ay,bx,by,len) {
	this.originVec = createVector(ax,ay);
	this.destVec = createVector(bx,by);
	this.deltaVec = createVector(bx,by);
	this.originCell = ORIGIN.absToMap(ax,ay,'board');
	this.destCell = ORIGIN.absToMap(bx,by,'board');
	this.len = len * ORIGIN.radius * 2.0;
  this.color_ = black;
};

Bullet.prototype.setColor = function (color_) {
	this.color_ = color_;
};

Bullet.prototype.cut = function () {
	this.deltaVec.sub(this.originVec);
	this.deltaVec.normalize();
	this.deltaVec.mult(this.len);
};

Bullet.prototype.render = function () {
	this.deltaVec.add(this.originVec);
	var bline = new BShape([LINE, this.originVec.x, this.originVec.y, this.deltaVec.x, this.deltaVec.y]);
	this.deltaVec.sub(this.originVec);
	stroke(this.color_);
	bline.render();
	stroke(0);
};

//************END BULLET CLASS

//************BEGIN BSHAPE CLASS

var BShape = function (args) {
	this.a = args[0]; this.b = args[1];
	this.c = args[2]; this.d = args[3];
	this.e = args[4]
	if (args.length > 5) {
		this.f = args[5];
	} else {
		this.f = null;
	}
	if (args.length > 6) {
		this.g = args[6];
	} else {
		this.g = null;
	};
	this.fill = null;
	this.stroke = null;
};

BShape.prototype.setFill = function (col) {
	this.fill = col;
};

BShape.prototype.setStroke = function (col) {
	this.stroke = col;
};

BShape.prototype.translate = function (x,y) {
	//put code here to translate
}

BShape.prototype.render = function () {
	if (this.fill != null) {fill(this.fill)};
	if (this.stroke != null) {stroke(this.stroke)};

	if (this.a === RECT) {
		rect(this.b,this.c,this.d,this.e);
	} else if (this.a === ELLIPSE) {
		ellipse(this.b,this.c,this.d,this.e);
	} else if (this.a === TRIANGLE) {
		triangle(this.b,this.c,this.d,this.e,this.f,this.g);
	} else if (this.a === LINE) {
		line(this.b,this.c,this.d,this.e);
	};
};

//***********END BSHAPE CLASS

//*****************SETUP****************

function setup() {
	var g = createCanvas(800,800);
	fill(40,100,255);
	background(60);
	stroke(0);
	//find font stuff later
  PLACE = 0; PLAY = 1; ENDTURN = 2; ENDGAME = 3;
	NONE = 0; SELECT = 1; LOCATE = 2; FINISH = 3;

	remaining = {};

	gamePhase = PLACE;
	placePhase = NONE;
	movePhase = NONE;
	aiPhase = NONE;

	blue = color(40,100,255);
	gray = color(102);
	lightGray = color(144);
	darkGray = color(60);
	red = color(255,40,0);
	yellow = color(255,255,80);
	black = color(0);
	white = color(255);
	green = color(40,255,100);

	bkg = gray; outside = darkGray; line = black; highlight = lightGray;

	RECT = 0; ELLIPSE = 1; TRIANGLE = 2; LINE = 3;
	RADIUS = 20;
	fields = {}; sets = {}; moves = {}; shots = {}; counters = {};

	lastCell = null;

	tokenColors = [];
	tokenColors.push(red);
	tokenColors.push(yellow);
	tokenColors.push(blue);
	tokenShapes = [RECT, ELLIPSE, TRIANGLE];
	allTokenTypes = ["red", "yellow", "blue", "RECT", "ELLIPSE", "TRIANGLE"];

	FONT = {};
	FONT["typeface"] = "Courier";
	FONT["size"] = 16;

	//board init

	fieldsize = 9; piecemax = 3; movemax = 7;

	fields['board'] = {};
	for (var aa = -fieldsize; aa < fieldsize + 1; aa++) {
		for (var ab = -fieldsize; ab < fieldsize + 1; ab++) {
			for (var ac = -fieldsize; ac < fieldsize + 1; ac++) {
				if ((aa+ab+ac) === 0) {
					fields['board'][coordString(aa,ab,ac)] = new Cell (aa,ab,ac);
					fields['board'][coordString(aa,ab,ac)].create();
				};
			};
		};
	};
	ORIGIN = fields['board'][coordString(0,0,0)];

	snapshot = {}; tokensnaps = {};

	paletteInit();
	subfieldInit();
	commitInit();
	//testing

	vvcount = 0;

};

function paletteInit () {
	fields['palette'] = {};
	counters['palette'] = {};
	remaining['p1'] = {};
	for (var tt=0;tt<allTokenTypes.length;tt++) {
		remaining['p1'][allTokenTypes[tt]] = piecemax;
	};
	for (var zz = 0; zz < 2; zz++) {
		for (var aa = 0; aa < 3; aa++) {
			var palz = fieldsize + 2 + zz;
			var paly = aa - 4;
			var palx = -paly - palz;
			var i = new Cell(palx,paly,palz);
			fields['palette'][i.coords()] = i;
			i.create();

			if ((zz & 1) === 0) {
				i.setColor(tokenColors[aa]);
			} else {
				var t = new Token(i, bkg, line, tokenShapes[aa]);
				t.render();
			};
			var pmOne = ((zz == 1) ? 1 : -1);
			counters['palette'][aa + (zz * 3)] = [];
			counters['palette'][aa + (zz * 3)][0] = i.cx + 3;
			counters['palette'][aa + (zz * 3)][1] = i.cy+ 6 + (pmOne * i.high);
		};
	};

};

function subfieldInit () {
	fields['p1home'] = {};
	for (q in fields['board']) {
		var c = fields['board'][q];
		if (c.z > fieldsize-3) {
			fields['p1home'][c.coords()] = c;
			c.setColor(highlight);
		};
	};
};

function commitInit () {
	var ccx = (-fieldsize - 3);
	var ccz = (fieldsize + 2);
	var ccy = -ccz - ccx;
	COMMIT = new Cell(ccx,ccy,ccz);
	COMMIT.setColor(green);
}
//*****************END SETUP*****************

//*****************BEGIN DRAW****************

function draw() {
	textSize(FONT['size']);
	textFont(FONT['typeface']);
	textAlign(CENTER,CENTER);
	fill(darkGray);
	noStroke();
	for (var i=0;i<remaining['p1'].length; i++) {
		rect(counters['palette'][i][0]-12,counters['palette'][i][1]-12,20,18);
	};
	fill(white);
	for (var k=0;k<allTokenTypes.length; k++) {
		var j = allTokenTypes[k];
		text(parseInt(remaining['p1'][j]), counters['palette'][k][0], counters['palette'][k][1]);
	};
	update(mouseX,mouseY);
	//testing
};

//*****************END DRAW********************

//*****************BEGIN UPDATE FUNCS**********

function update(x,y) {
	highlightCell(x,y);
	if (gamePhase === PLACE) {
		if (placePhase === NONE) {
			//space for pre-placement stuff
			placePhase = SELECT;
		} else if (placePhase === SELECT) {
			if (mouseButton === LEFT) {
				//selectUpdate(x,y); //this is targetUpdate
			} else {
				//freehandSelect(x,y);
			};
		} else if (placePhase === LOCATE) {

		} else if (placePhase === FINISH) {

		};
	} else if (gamePhase === PLAY) {

	} else if (gamePhase === ENDTURN) {

	} else if (gamePhase === ENDGAME) {

	};
};

function highlightCell(x,y) {
	var inCell = null; var change = false;
	var inToken = null;
	var hoverColor; var profile;
	var kys = Object.keys(fields);
	for (var k of kys) {
		if (ORIGIN.absToMap(x,y,k) !== null) {
			inCell = ORIGIN.absToMap(x,y,k);
			if (inCell !== lastCell) {
				if (lastCell !== null) {
					lastCell.setColor(snapshot[lastCell.coords()]['fill']);
					if (snapshot[lastCell.coords()]['token'] !== null) {
						var lastToken = snapshot[lastCell.coords()]['token'];
						lastToken.setColor(tokensnaps[lastCell.coords()]['fill']);
					};
				};
				snapshot[inCell.coords()] = inCell.colorProfile();
			  profile = inCell.colorProfile();
				if (profile['token'] !== null) {
					inToken = profile['token'];
					var tprof = inToken.tokenProfile();
					tokensnaps[inCell.coords()] = tprof;
					hoverColor = lerpColor(tprof['fill'],white,0.20);
					tprof.setColor(hoverColor);
				} else {
					hoverColor = lerpColor(profile['fill'],white,0.20);
					inCell.setColor(hoverColor);
					console.log(hoverColor.toString());
					hoverColor.levels[3] = 1.0;
					console.log(hoverColor.toString());
				};
			};
			lastCell = inCell;
		};
	};
};
