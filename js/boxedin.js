/*jslint browser: true*/
/*global Stats, PIXI, io*/
(function () {
  "use strict";

  var stage, renderer,
    textures, map, player,
    left, right, up, down,
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
    textures.push(PIXI.Texture.fromImage('images/orange.png')); //0 - 
    textures.push(PIXI.Texture.fromImage('images/purple.png')); //1 - 
    textures.push(PIXI.Texture.fromImage('images/yellow.png')); //2 - 
  }


  function Map() {
    var mapData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 9, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 9, 0, 9, 9, 1,
                   1, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 1,
                   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      WIDTH = 20,
      HEIGHT = 12,
      mapSprite = [];
    Map.prototype.init = function () {
      var ix = 0,
        iy = 0;
      //Loop through mapData and add a sprite for each non-blank (aka no 9) tile.
      for (ix = 0; ix < (HEIGHT * WIDTH); ix += 1) {
        if (mapData[ix] !== 9) {
          mapSprite[iy] = new PIXI.Sprite(textures.getTexture(mapData[ix]));
          mapSprite[iy].x = (((ix % WIDTH) + 1) * 64) - 32;
          mapSprite[iy].y = 32 + (Math.floor(ix / WIDTH) * 64);
          mapSprite[iy].gridX = ix % WIDTH;
          mapSprite[iy].gridY = Math.floor(ix / WIDTH);
          mapSprite[iy].anchor.x = 0.5;
          mapSprite[iy].anchor.y = 0.5;
          stage.addChild(mapSprite[iy]);
          iy += 1;
        }
      }
      //window.console.log("mapSprite: " + mapSprite.length);
      //window.console.log("mapData: " + mapData.length);
      //window.console.log("iy: " + iy);
    };
    Map.prototype.spin = function (timeElapsed) {
      var ix = 0;
      for (ix = 0; ix < mapSprite.length; ix += 1) {
        mapSprite[ix].rotation += (timeElapsed * 0.001 * (ix % 5));
      }
    };

    //Return the content of the tile at location x, y
    Map.prototype.getTile = function (x, y) {
      return mapData[(x - 1) + ((y - 1) * WIDTH)];
    };
  }

  function Player() {
    var isMoving = false,
      direction = 0, //0=left, 1=right, 2=up, 3= down
      speed = 0.08,
      playerSprite = new PIXI.Sprite(PIXI.Texture.fromImage('images/yellow.png'));
    playerSprite.anchor.x = 0.5;
    playerSprite.anchor.y = 0.5;
    playerSprite.gridX = 12;
    playerSprite.gridY = 8;
    playerSprite.x = (playerSprite.gridX * 64) - 32;
    playerSprite.y = (playerSprite.gridY * 64) - 32;
    stage.addChild(playerSprite);
    Player.prototype.move = function (timeElapsed) {
      if (isMoving === true) {
        switch (direction) {
        case 0:
          playerSprite.x -= timeElapsed * speed;
          if (playerSprite.x < ((playerSprite.gridX - 1) * 64) - 32) {
            playerSprite.gridX -= 1;
            playerSprite.x = (playerSprite.gridX * 64) - 32;
            isMoving = false;
          }
          break;
        case 1:
          playerSprite.x += timeElapsed * speed;
          if (playerSprite.x > ((playerSprite.gridX + 1) * 64) - 32) {
            playerSprite.gridX += 1;
            playerSprite.x = (playerSprite.gridX * 64) - 32;
            isMoving = false;
          }
          break;
        case 2:
          playerSprite.y -= timeElapsed * speed;
          if (playerSprite.y < ((playerSprite.gridY - 1) * 64) - 32) {
            playerSprite.gridY -= 1;
            playerSprite.y = (playerSprite.gridY * 64) - 32;
            isMoving = false;
          }
          break;
        case 3:
          playerSprite.y += timeElapsed * speed;
          if (playerSprite.y > ((playerSprite.gridY + 1) * 64) - 32) {
            playerSprite.gridY += 1;
            playerSprite.y = (playerSprite.gridY * 64) - 32;
            isMoving = false;
          }
          break;
        }
      } else {
        //If not already moving and key is pressed, then start moving.
        //I should really think of a better way to do this...
        if (left === true) {
          if (map.getTile(playerSprite.gridX - 1, playerSprite.gridY) === 9) {
            direction = 0;
            isMoving = true;
          }
        }
        if (right === true) {
          if (map.getTile(playerSprite.gridX + 1, playerSprite.gridY) === 9) {
            direction = 1;
            isMoving = true;
          }
        }
        if (up === true) {
          if (map.getTile(playerSprite.gridX, playerSprite.gridY - 1) === 9) {
            direction = 2;
            isMoving = true;
          }
        }
        if (down === true) {
          if (map.getTile(playerSprite.gridX, playerSprite.gridY + 1) === 9) {
            direction = 3;
            isMoving = true;
          }
        }
      }
    };
  }

  //Keyboard handler
  window.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
    case 90:
      //Key: Z -  Left
      left = true;
      break;
    case 88:
      //Key: X - Right
      right = true;
      break;
    case 80:
      //Key: P - Up
      up = true;
      break;
    case 76:
      //Key: L - Down
      down = true;
      break;
    }
  }, false);
  window.addEventListener("keyup", function (event) {
    switch (event.keyCode) {
    case 90:
      //Key: Z -  Left
      left = false;
      break;
    case 88:
      //Key: X - Right
      right = false;
      break;
    case 80:
      //Key: P - Up
      up = false;
      break;
    case 76:
      //Key: L - Down
      down = false;
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
    //map.spin(timeElapsed);  //REPLACE WITH CALL TO ANIMATE - CAN BE FUNCTION IN EACH TILE THEN.
    player.move(timeElapsed);

    //Update any game logic here!

    //sleep(100); //TESTING ONLY

    // render the stage  
    renderer.render(stage);
    stats.end();

  }

  //MAIN - Program starting point!
  textures = new Textures(); //Load textures
  map = new Map(); //Create the map object
  map.init(); //Populate the starter map
  player = new Player();
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