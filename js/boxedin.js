/*jslint browser: true*/
/*global Stats, PIXI, io*/
(function () {
  "use strict";

  var stage, renderer,
    textures,
    yourDirection = 1,
    left, right,
    timeLast,
    stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms

  // align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild(stats.domElement);
  // END of stats init code

  // create an new instance of a pixi
  stage = new PIXI.Container();
  renderer = PIXI.autoDetectRenderer(1366, 768);
  document.body.appendChild(renderer.view);

  //Add stats counter
  document.body.appendChild(stats.domElement);

  function Textures() {
    Textures.prototype.getTexture = function (ix) {
      return textures[ix];
    };
    var textures = [];
    textures.push(PIXI.Texture.fromImage('images/orange.png'));
    textures.push(PIXI.Texture.fromImage('images/purple.png'));
    textures.push(PIXI.Texture.fromImage('images/yellow.png'));
  }

  function loadMap() {
    var mapData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 9, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 9, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 9, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 1,
                   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      mapSprite = [],
      ix = 0,
      iy = 0,
      WIDTH = 20,
      HEIGHT = 12;
    //Loop through mapData and add a sprite for each non-blank (aka no 9) tile.
    for (ix = 0; ix < (HEIGHT * WIDTH); ix += 1) {
      if (mapData[ix] !== 9) {
        mapSprite[iy] = new PIXI.Sprite(textures.getTexture(mapData[ix]));
        mapSprite[iy].x = (((ix % WIDTH) + 1) * 64) - 64;
        mapSprite[iy].y = Math.floor(ix / WIDTH) * 64;
        mapSprite[iy].gridX = ix % WIDTH;
        mapSprite[iy].gridY = Math.floor(ix / WIDTH);
        stage.addChild(mapSprite[iy]);
        iy += 1;
      }
    }
    window.console.log("mapSprite: " + mapSprite.length);
    window.console.log("mapData: " + mapData.length);
    window.console.log("iy: " + iy);
  }

  //Keyboard handler
  window.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
    case 90:
      //Key: Z -  Left
      right = true;
      break;
    case 88:
      //Key: X - Right
      left = true;
      break;
    }
  }, false);
  window.addEventListener("keyup", function (event) {
    switch (event.keyCode) {
    case 90:
      //Key: Z -  Left
      right = false;
      break;
    case 88:
      //Key: X - Right
      left = false;
      break;
    }
  }, false);

  function getTimeElapsed() {
    var timeNow, timeElapsed, limeLast;
    timeNow = new Date().getTime();
    timeElapsed = timeNow - (timeLast || timeNow);
    timeLast = timeNow;
    return timeElapsed;
  }

  //The Main Game Loop!
  function animate() {
    var timeElapsed;

    window.requestAnimationFrame(animate);

    //Calculate time since last frame
    timeElapsed = getTimeElapsed();

    stats.begin();

    //Update any game logic here!

    //sleep(100); //TESTING ONLY

    // render the stage  
    renderer.render(stage);
    stats.end();

  }

  //MAIN - Program starting point!
  textures = new Textures(); //Load textures
  loadMap(); //Populate the starter map
  window.requestAnimationFrame(animate);

  //FOR TESTING!
  function sleep(milliseconds) {
    var i, start = new Date().getTime();
    for (i = 0; i < 1e7; i += 1) {
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }
  }

}());