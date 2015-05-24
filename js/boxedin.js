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
    textures.push(PIXI.Texture.fromImage('images/crate.png')); //0 - Pushable tiles
    textures.push(PIXI.Texture.fromImage('images/edge.png')); //1 - Fixed Tiles (Used for map edges)
    textures.push(PIXI.Texture.fromImage('images/static1.png')); //2 - Fixed Tiles
    textures.push(PIXI.Texture.fromImage('images/static2.png')); //3 - Fixed Tiles
    textures.push(PIXI.Texture.fromImage('images/left.png')); //4 - Left Only
    textures.push(PIXI.Texture.fromImage('images/right.png')); //5 - Right Only
    textures.push(PIXI.Texture.fromImage('images/up.png')); //6 - Up Only
    textures.push(PIXI.Texture.fromImage('images/down.png')); //7 - Down Only
    textures.push(PIXI.Texture.fromImage('images/key.png')); //8 - A Key!
  }


  function Map() {
    var mapData = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 1,
                   1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 9, 9, 1,
                   1, 0, 0, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 9, 9, 1,
                   1, 0, 0, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 1,
                   1, 0, 0, 9, 9, 9, 9, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 9, 9, 1,
                   1, 0, 0, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 9, 9, 9, 0, 9, 9, 9, 9, 9, 9, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 9, 0, 0, 7, 0, 0, 6, 0, 9, 0, 9, 9, 1,
                   1, 0, 0, 0, 0, 0, 0, 9, 0, 0, 7, 5, 5, 5, 0, 9, 0, 9, 9, 1,
                   1, 9, 9, 9, 9, 9, 9, 9, 4, 4, 7, 0, 0, 0, 0, 0, 0, 9, 9, 1,
                   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      spriteToMap = [],
      WIDTH = 20,
      HEIGHT = 12,
      mapSprite = [];
    Map.prototype.init = function () {
      var ix = 0,
        iy = 0,
        keyCount = 0;
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
          spriteToMap[ix] = iy; //Store the mapSprite index number in a morror array for reference
          iy += 1;
          if (mapData[ix] === 8) {
            keyCount += 1;
          }
        }
      }
    };
    Map.prototype.moveTile = function (x, y, timeElapsed, speed, direction, isMoving) {
      var spriteIx,
        playerIx;
      spriteIx = spriteToMap[(x - 1) + ((y - 1) * WIDTH)];
      playerIx = ((x - 1) + ((y - 1) * WIDTH));
      switch (direction) {
      case 0:
        if (isMoving === true) {
          mapSprite[spriteIx].x -= timeElapsed * speed;
        } else {
          //adjust the tile grids to reflect the moved tile
          mapData[playerIx] = 9; //Old position is now blank (with player stood in it)
          mapData[playerIx - 1] = 0;
          spriteToMap[playerIx - 1] = spriteIx;
          mapSprite[spriteIx].x = ((x - 1) * 64) - 32; //Snap tile to grid
        }
        break;
      case 1:
        if (isMoving === true) {
          mapSprite[spriteIx].x += timeElapsed * speed;
        } else {
          //adjust the tile grids to reflect the moved tile
          mapData[playerIx] = 9; //Old position is now blank (with player stood in it)
          mapData[playerIx + 1] = 0;
          spriteToMap[playerIx + 1] = spriteIx;
          mapSprite[spriteIx].x = ((x + 1) * 64) - 32; //Snap tile to grid
        }
        break;
      case 2:
        if (isMoving === true) {
          mapSprite[spriteIx].y -= timeElapsed * speed;
        } else {
          //adjust the tile grids to reflect the moved tile
          mapData[playerIx] = 9; //Old position is now blank (with player stood in it)
          mapData[playerIx - WIDTH] = 0;
          spriteToMap[playerIx - WIDTH] = spriteIx;
          mapSprite[spriteIx].y = ((y - 1) * 64) - 32; //Snap tile to grid
        }
        break;
      case 3:
        if (isMoving === true) {
          mapSprite[spriteIx].y += timeElapsed * speed;
        } else {
          //adjust the tile grids to reflect the moved tile
          mapData[playerIx] = 9; //Old position is now blank (with player stood in it)
          mapData[playerIx + WIDTH] = 0;
          spriteToMap[playerIx + WIDTH] = spriteIx;
          mapSprite[spriteIx].y = ((y + 1) * 64) - 32; //Snap tile to grid
        }
        break;
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
      tile,
      tileMoveX = 99,
      tileMoveY = 99,
      pushing = false,
      playerSprite = new PIXI.Sprite(PIXI.Texture.fromImage('images/truck.png'));
    playerSprite.anchor.x = 0.5;
    playerSprite.anchor.y = 0.5;
    playerSprite.gridX = 12;
    playerSprite.gridY = 8;
    playerSprite.x = (playerSprite.gridX * 64) - 32;
    playerSprite.y = (playerSprite.gridY * 64) - 32;
    stage.addChild(playerSprite);

    function moveTile(isMoving, timeElapsed) {
      map.moveTile(tileMoveX, tileMoveY, timeElapsed, speed, direction, isMoving);
      if (isMoving === false) {
        tileMoveX = 99; //Set global tileMoveX to 99 so that we don't continue to move tile.
      }
    } //end moveTile

    Player.prototype.getPos = function (timeElapsed) {
      return {
        x: playerSprite.gridX,
        y: playerSprite.gridY
      };
    };

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
        if (tileMoveX !== 99) {
          moveTile(isMoving, timeElapsed);
        }
      } else {
        //If not already moving and key is pressed, then start moving.
        //I should really think of a better way to do this...
        if (left === true) {
          tile = map.getTile(playerSprite.gridX - 1, playerSprite.gridY);
          if (tile === 9 || tile === 0 || tile === 4 || tile === 8) {
            direction = 0;
            isMoving = true;
            if (tile === 0) {
              if (map.getTile(playerSprite.gridX - 2, playerSprite.gridY) === 9) {
                //only allow block to push if space after is empty
                tileMoveX = (playerSprite.gridX - 1);
                tileMoveY = playerSprite.gridY;
              } else {
                isMoving = false;
              }
            }
          }
        }
        if (right === true) {
          tile = map.getTile(playerSprite.gridX + 1, playerSprite.gridY);
          if (tile === 9 || tile === 0 || tile === 5 || tile === 8) {
            direction = 1;
            isMoving = true;
            if (tile === 0) {
              if (map.getTile(playerSprite.gridX + 2, playerSprite.gridY) === 9) {
                //only allow block to push if space after is empty
                tileMoveX = (playerSprite.gridX + 1);
                tileMoveY = playerSprite.gridY;
              } else {
                isMoving = false;
              }
            }
          }
        }
        if (up === true) {
          tile = map.getTile(playerSprite.gridX, playerSprite.gridY - 1);
          if (tile === 9 || tile === 0 || tile === 6 || tile === 8) {
            direction = 2;
            isMoving = true;
            if (tile === 0) {
              if (map.getTile(playerSprite.gridX, playerSprite.gridY - 2) === 9) {
                //only allow block to push if space after is empty
                tileMoveX = playerSprite.gridX;
                tileMoveY = playerSprite.gridY - 1;
              } else {
                isMoving = false;
              }
            }
          }
        }
        if (down === true) {
          tile = map.getTile(playerSprite.gridX, playerSprite.gridY + 1);
          if (tile === 9 || tile === 0 || tile === 7 || tile === 8) {
            direction = 3;
            isMoving = true;
            if (tile === 0) {
              if (map.getTile(playerSprite.gridX, playerSprite.gridY + 2) === 9) {
                //only allow block to push if space after is empty
                tileMoveX = playerSprite.gridX;
                tileMoveY = playerSprite.gridY + 1;
              } else {
                isMoving = false;
              }
            }
          }
        }
      }
      //Just started moving, so set the truck to face the right direction.
      //Should improve this to rotate into position rather then just jump to it.
      switch (direction) {
      case 0:
        playerSprite.rotation = 4.7123889804; //270 degrees in radions (degrees x PI / 180)
        break;
      case 1:
        playerSprite.rotation = 1.5707963268; //90 degrees in radions
        break;
      case 2:
        playerSprite.rotation = 0.0000000000; //0 degrees in radions
        break;
      case 3:
        playerSprite.rotation = 3.1415926536; //180 degrees in radions
        break;
      } //end switch direction
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
    player.move(timeElapsed);

    //sleep(100); //TESTING ONLY - Reduce to 10 TPS

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