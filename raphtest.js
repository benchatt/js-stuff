var Traveler = function (obj, ori, dest) {
  this.thing = obj;
  this.ori = ori;
  this.loc = ori;
  this.dest = dest;
  this.vel = Victor(0,0);
}

Traveler.prototype.setVel = function (vel) {
  this.vel = vel; // px/s
};

Traveler.prototype.move = function (dt) {
  this.thing.transform("t"+Math.floor(this.vel.x/dt)+","+
                       Math.floor(this.vel.y/dt));
  this.loc.add(this.vel);
};

window.onload = function() {
  var paper = new Raphael(document.getElementById('canvas_container'),500,500);
  var ball = paper.circle(30,30,30)
                  .attr({fill: "#a33", stroke: "#04e", 'stroke-width': 4})
                  .click(function(){
                    this.animate({fill: "#33a", 'stroke-width': 2}, 300,
                                 "bounce",
                                 this.animate({fill: "#a33",
                                               'stroke-width':4}, 300)
                                );
                  });
  var t1 = new Traveler(ball,30,30);

}
