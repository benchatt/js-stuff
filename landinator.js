var COASTVAR, WIDTH, HEIGHT, GROUND, DROPOFF;

var Country = function(points,field){
  this.points = this.orderPoints(points);
  this.field = this.genField(this.points,field);
}

Country.prototype.orderPoints = function (points) {
  var tmp = points;
  var outpoints = [];
  var one = tmp.pop();
  outpoints.push(one);
  while (tmp.length > 1) {
    var king = -1; var kinglength = 10000; var trydist;
    for (var i=0;i<tmp.length;i++){
      trydist = one.dist(tmp[i]);
      if (trydist<kinglength){
        kinglength = trydist;
        king = i;
      };
    };
    one = tmp[king];
    outpoints.push(one);
    tmp.splice(king,1);
  };
  outpoints.push(tmp[0]);
  return outpoints;
};

Country.prototype.genField = function (points,field) {
  var one, two, tmppt, tmpx, tmpy, breadth, punt;
  for (var i=0;i<points.length;i++){
    punt = random(1);
    if (punt>0.9) {
      breadth = 1;
    } else {
      breadth = COASTVAR;
    }
    one = points[i];
    if (i===points.length-1) {
      two = points[0];
    } else {
      two = points[i+1];
    };
    for (var i=0;i<1.01;i+=1/one.dist(two)) {
      tmpx = lerp(one.x,two.x,i);
      tmpy = lerp(one.y,two.y,i);
      for (var ix=floor(tmpx-(breadth/2));ix<ceil(tmpx+(breadth/2));ix++) {
        for (var iy=floor(tmpy-(breadth/2));iy<ceil(tmpy+(breadth/2));iy++) {
          points[ix][iy] = points[ix][iy] - (DROPOFF - random(1));
        };
      };
    };
  };
  return points;
};
