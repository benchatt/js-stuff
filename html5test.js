// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
//end polyfill

//keystroke iife by james long
(function() {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        }
    };
})();
//end keystroke iife

var lastTime;

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

function main () {
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;

  update(dt);
  render();

  lastTime = now;
  requestAnimationFrame(main);
}

function init() {
  reset();
  lastTime = Date.now();
  main();
}

//game state
var player = {
  pos: Victor(0,0),
  health: 20,
  r: 255,
  g: 255,
  b: 255
};

var bullets = [];
var enemyBlobs = [];
var enemySpikes = [];

var lastChomp = Date.now();
var lastFire = Date.now();
var gameTime = 0;
var isGameOver = false;

var homeBase = {
  rhealth = 100,
  ghealth = 100,
  bhealth = 100
}

var score = 0;

var playerSpeed = 200;
var bulletSpeed = 500;
var blobSpeed = 150;
var spikeSpeed = 250;
var timeFactor = 0.01;

function update(dt) {
  gameTime += dt;
  timeFactor = getTimeFactor(gameTime);
  handleInput(dt);
  updateEntries(dt);

  if(timeToReleaseBlob(gameTime)){
    enemyBlobs.push({
      pos: Vector(Math.random() * (canvas.width - 20),
                  Math.random() * (canvas.height - 20)),
      r: 255 - (Math.random() * timeFactor);
      g: 255 - (Math.random() * timeFactor);
      b: 255 - (Math.random() * timeFactor);
    });
  }
  if(timeToReleaseSpike(gameTime)){
    enemySpikes.push({
      pos: Vector(Math.random() * (canvas.width - 20),
                  Math.random() * (canvas.height * 0.75)),
    });
  }
  checkCollisions();
}

/*To do:
getTimeFactor, timeToReleaseSpike, timeToReleaseBlob
