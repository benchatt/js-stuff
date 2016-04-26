var bkg; var outside; var line;

var RADIUS; var histep;
var field; //replace old w a hash of the board, palette, subfields

var fieldsize;

var ORIGIN;

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
	//console.log(coordString(rx,ry,rz));http://ebook.3m.com/library/multnomahcountylibrary/Featured?media=all&src=lib

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

// ************BEGIN COLORPATH OBJECT

var ColorPath = function (total) {
  this.total = total;
	this.step = 1/total;
	console.log(total);
	this.i = 0;
  var middle = createVector(0,0,0);
  this.begin = this.genPoint(middle);
  this.end = this.genPoint(this.begin);
	this.curr = this.begin;
	console.log(this.begin, this.end);
}

ColorPath.prototype.genPoint = function (invec) {
  var outvec = invec;
  var a, b, c;
  while (outvec.dist(invec) < 120) {
    a = round(random(255));
    b = round(random(255));
    c = round(random(255));
    outvec = createVector(a,b,c);
  };
  return outvec;
};

ColorPath.prototype.genColor = function () {
	this.i += 1;
	var a = round(random(30)) - 15;
	var b = round(random(30)) - 15;
	var c = round(random(30)) - 15;
	var ranvec = createVector(a,b,c);
	var stepvec = p5.Vector.lerp(this.begin,this.end,this.i*this.step);
	//console.log(this.step);
	stepvec.add(ranvec);
	this.curr = stepvec;
	return (color(this.curr.x,this.curr.y,this.curr.z));
};
//*****************SETUP****************

function setup() {
	if (random()>0.5) {
		colorMode(HSB,255);
	}

	var g = createCanvas(800,800);
	fill(40,100,255);
	background(60);
	stroke(0);

	bkg = color(102); outside = color(60); line = color(0); highlight = color(144);

	RADIUS = 20;

	//board init

	fieldsize = 9;

	field = {};
	for (var aa = -fieldsize; aa < fieldsize + 1; aa++) {
		for (var ab = -fieldsize; ab < fieldsize + 1; ab++) {
			for (var ac = -fieldsize; ac < fieldsize + 1; ac++) {
				if ((aa+ab+ac) === 0) {
					field[coordString(ab,aa,ac)] = new Cell (ab,aa,ac);
					field[coordString(ab,aa,ac)].create();
				};
			};
		};
	};
	var path = new ColorPath(Object.keys(field).length);

	Object.keys(field).forEach(function (c) {
		var cor = path.genColor();
		field[c].setColor(cor);
		field[c].setLineColor(cor);
	})

	ORIGIN = field[coordString(0,0,0)];

};

//*****************END SETUP*****************

//*****************BEGIN DRAW****************

function draw() {
	update(mouseX,mouseY);
	//testing
};

function update(x,y) {

};

//*****************END DRAW********************
