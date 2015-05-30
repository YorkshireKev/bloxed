/*jslint browser: true*/
/*global PIXI, io*/
(function () {
  "use strict";

  var stage, renderer,
    textures, map, player, startScreen,
    left, right, up, down, cheat, enterPressed,
    timeLast,
    gameState = 0,
    level = 1;

  // create an new instance of a pixi
  stage = new PIXI.Container();
  renderer = PIXI.autoDetectRenderer(1280, 768);
  renderer.view.style.position = "absolute";
  if (window.innerWidth > window.innerHeight) {
    renderer.view.style.width = Math.floor(window.innerHeight * 1.666666667) + "px";
    renderer.view.style.height = Math.floor(window.innerHeight) + "px";
  } else {
    renderer.view.style.width = Math.floor(window.innerWidth) + "px";
    renderer.view.style.height = Math.floor(window.innerWidth * 0.600000000) + "px";
  }
  renderer.view.style.display = "block";
  renderer.view.style.left = Math.floor((window.innerWidth - parseInt(renderer.view.style.width, 10)) / 2) + "px";
  document.body.appendChild(renderer.view);

  function StartScreen() {
    var zoomIn, titleText, instrText, startText, copyText;
    titleText = new PIXI.Text("Bloxed", {
      font: "bold " + Math.floor(renderer.width / 10) + "px Verdana",
      fill: "#415df7",
      align: "center",
      stroke: "#f7ae0b",
      strokeThickness: 35
    });
    titleText.anchor.x = 0.5;
    titleText.anchor.y = 0.5;
    titleText.position.x = renderer.width / 2;
    titleText.position.y = titleText.height / 1.5;

    instrText = new PIXI.Text("How to play:\nPush some blocks about and collect the keys!" +
      "\nMove around by pressing Z, X, P and L... or just use the cursor Keys." +
      "\nPress R or Escape to Restart the Level.", {
        font: "bold " + Math.floor(renderer.width / 40) + "px Verdana",
        fill: "#082cf0",
        align: "center",
        stroke: "#f7ae0b",
        strokeThickness: 6
      });
    instrText.anchor.x = 0.5;
    instrText.anchor.y = 0.5;
    instrText.position.x = renderer.width / 2;
    instrText.position.y = titleText.height + (instrText.height / 1.2);


    startText = new PIXI.Text("Press ENTER to Start", {
      font: "bold " + Math.floor(renderer.width / 20) + "px Verdana",
      fill: "#ff2700",
      align: "center",
      stroke: "#f7ae0b",
      strokeThickness: 6
    });
    startText.anchor.x = 0.5;
    startText.anchor.y = 0.5;
    startText.position.x = renderer.width / 2;
    startText.position.y = renderer.height / 1.4;

    copyText = new PIXI.Text("(c)2015 Kev Ellis - Released under the MIT Open Source Licence", {
      font: "bold " + Math.floor(renderer.width / 40) + "px Verdana",
      fill: "#a5a4a3",
      align: "center",
      stroke: "#4d4940",
      strokeThickness: 6
    });
    copyText.anchor.x = 0.5;
    copyText.anchor.y = 0.5;
    copyText.position.x = renderer.width / 2;
    copyText.position.y = renderer.height - copyText.height;


    StartScreen.prototype.init = function () {
      //First remove any existing objects from stage
      while (stage.children[0]) {
        stage.removeChild(stage.children[0]);
      }
      stage.addChild(titleText);
      stage.addChild(instrText);
      stage.addChild(startText);
      stage.addChild(copyText);
      zoomIn = true;
      level = 1;
    };

    StartScreen.prototype.animate = function (timeElapsed) {
      if (enterPressed === true) {
        enterPressed = false;
        map.init(1); //Populate the starter map
        gameState = 1; //Start the game!
      }
      //Animate the game logo
      if (zoomIn === true) {
        startText.scale.x += timeElapsed * 0.0002;
        startText.scale.y = startText.scale.x;
        if (startText.scale.x > 1.05) {
          zoomIn = false;
        }
      } else {
        startText.scale.x -= timeElapsed * 0.0002;
        startText.scale.y = startText.scale.x;
        if (startText.scale.x < 1) {
          zoomIn = true;
        }
      }
    };
  }


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
    var level1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9,
                  1, 9, 9, 4, 9, 9, 9, 9, 8, 9, 2, 2, 2, 1, 9, 9, 9, 9, 9, 9,
                  1, 9, 3, 3, 3, 3, 9, 9, 9, 0, 9, 0, 9, 1, 9, 9, 9, 9, 9, 9,
                  1, 9, 3, 9, 9, 9, 9, 9, 9, 9, 2, 6, 2, 1, 9, 9, 9, 9, 9, 9,
                  1, 9, 3, 9, 0, 9, 9, 9, 9, 9, 2, 6, 2, 1, 9, 9, 9, 9, 9, 9,
                  1, 9, 3, 9, 9, 0, 9, 9, 9, 9, 2, 9, 2, 1, 9, 9, 9, 9, 9, 9,
                  1, 1, 1, 9, 0, 9, 0, 9, 9, 9, 2, 6, 2, 1, 9, 9, 9, 9, 9, 9,
                  9, 9, 1, 9, 9, 0, 9, 0, 9, 9, 2, 6, 2, 1, 1, 9, 9, 9, 9, 9,
                  9, 9, 1, 9, 0, 9, 0, 9, 9, 9, 2, 6, 2, 9, 1, 1, 1, 1, 1, 1,
                  9, 9, 1, 0, 9, 0, 9, 0, 9, 9, 2, 6, 2, 9, 9, 9, 0, 9, 9, 1,
                  9, 9, 1, 9, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 9, 9, 9, 9, 1,
                  9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      level2 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9,
                1, 9, 9, 4, 9, 9, 9, 9, 9, 9, 2, 2, 2, 1, 9, 9, 9, 9, 9, 9,
                1, 9, 3, 3, 3, 3, 9, 9, 9, 0, 9, 0, 9, 1, 9, 9, 9, 9, 9, 9,
                1, 9, 3, 9, 9, 9, 9, 9, 9, 9, 2, 6, 2, 1, 9, 9, 9, 9, 9, 9,
                1, 9, 3, 9, 0, 9, 9, 9, 9, 9, 2, 6, 2, 1, 9, 9, 9, 9, 9, 9,
                1, 8, 3, 9, 9, 0, 9, 9, 9, 9, 2, 8, 2, 1, 9, 9, 9, 9, 9, 9,
                1, 1, 1, 9, 0, 9, 0, 9, 9, 9, 2, 6, 2, 1, 9, 9, 9, 9, 9, 9,
                9, 9, 1, 9, 9, 0, 9, 0, 9, 9, 2, 6, 2, 1, 1, 9, 9, 9, 9, 9,
                9, 9, 1, 9, 0, 9, 0, 9, 9, 9, 2, 6, 2, 9, 1, 1, 1, 1, 1, 1,
                9, 9, 1, 0, 9, 0, 9, 0, 9, 9, 2, 6, 2, 9, 9, 9, 0, 9, 8, 1,
                9, 9, 1, 9, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 9, 9, 9, 9, 1,
                9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      mapData = [],
      spriteToMap = [],
      WIDTH = 20,
      HEIGHT = 12,
      mapSprite = [],
      keyCount,
      keyBounceDir = 0,
      keyScale = 0.8,
      AllLevelsCompleteText,
      LevelCompleteText;


    LevelCompleteText = new PIXI.Text("Level Complete!", {
      font: "bold " + Math.floor(renderer.width / 20) + "px Verdana",
      fill: "#ff2700",
      align: "center",
      stroke: "#f7ae0b",
      strokeThickness: 6
    });
    LevelCompleteText.anchor.x = 0.5;
    LevelCompleteText.anchor.y = 0.5;
    LevelCompleteText.position.x = renderer.width / 2;
    LevelCompleteText.position.y = renderer.height / 2;

    AllLevelsCompleteText = new PIXI.Text("Congratulations!\nYou've Completed\nAll of the Levels", {
      font: "bold " + Math.floor(renderer.width / 30) + "px Verdana",
      fill: "#f8ea79",
      align: "center",
      stroke: "#f7ae0b",
      strokeThickness: 6
    });
    AllLevelsCompleteText.anchor.x = 0.5;
    AllLevelsCompleteText.anchor.y = 0.5;
    AllLevelsCompleteText.position.x = renderer.width / 2;
    AllLevelsCompleteText.position.y = renderer.height / 2;

    Map.prototype.init = function (level) {
      var ix = 0,
        iy = 0,
        px,
        py;

      //First remove any existing objects from stage
      while (stage.children[0]) {
        stage.removeChild(stage.children[0]);
      }

      //Load the appropriate level into mapData;
      switch (level) {
      case 1:
        mapData = level1.slice();
        px = 8; //Player x start pos
        py = 6; //Player y start pos
        break;
      case 2:
        mapData = level2.slice();
        px = 8;
        py = 6;
        break;
      default:
        //No more levels, so tell player they've completed all of the levels!
        gameState = 3;
        stage.addChild(AllLevelsCompleteText);
        return;
      }

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
          mapSprite[iy].tileType = mapData[ix]; //Store teh tile type in with the sprite object
          stage.addChild(mapSprite[iy]);
          spriteToMap[ix] = iy; //Store the mapSprite index number in a morror array for reference
          iy += 1;
          if (mapData[ix] === 8) {
            keyCount += 1;
          }
        }
      }
      player.initPlayer(px, py); //Reset the players position.
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

    //Animate keys...
    Map.prototype.animate = function (timeElapsed) {
      var ix = 0;
      if (keyBounceDir === 0) {
        keyScale -= 0.0003 * timeElapsed;
        if (keyScale < 0.7) {
          keyBounceDir = 1;
        }
      } else {
        keyScale += 0.0003 * timeElapsed;
        if (keyScale > 0.9) {
          keyBounceDir = 0;
        }
      }
      for (ix = 0; ix < mapSprite.length; ix += 1) {
        if (mapSprite[ix].tileType === 8) {
          mapSprite[ix].scale.x = keyScale;
          mapSprite[ix].scale.y = keyScale;
        }
      }
    };

    Map.prototype.gotKey = function (x, y) {
      var ix = ((x - 1) + ((y - 1) * WIDTH)),
        spriteIx = spriteToMap[ix];
      keyCount -= 1;
      mapData[ix] = 9;
      mapSprite[spriteIx].visible = false;
      if (keyCount === 0) {
        //All keys collected. Level Complete!
        gameState = 2;
        LevelCompleteText.scale.x = 1;
        LevelCompleteText.scale.x = 1;
        stage.addChild(LevelCompleteText);
      }
    };

    Map.prototype.complete = function (timeElapsed) {
      LevelCompleteText.scale.x += timeElapsed * 0.0004;
      LevelCompleteText.scale.y = LevelCompleteText.scale.x;
      if (LevelCompleteText.scale.x > 3) {
        level += 1;
        gameState = 1;
        map.init(level);
      }
    };

    Map.prototype.allComplete = function (timeElapsed) {
      AllLevelsCompleteText.scale.x += timeElapsed * 0.0001;
      AllLevelsCompleteText.scale.y = AllLevelsCompleteText.scale.x;
      if (AllLevelsCompleteText.scale.x > 3) {
        gameState = 0;
        startScreen.init();
      }
    };

  }

  //LevelCompleteText.visibility = true;

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

    Player.prototype.initPlayer = function (x, y) {
      isMoving = false;
      direction = 2;
      playerSprite.gridX = x;
      playerSprite.gridY = y;
      playerSprite.x = (playerSprite.gridX * 64) - 32;
      playerSprite.y = (playerSprite.gridY * 64) - 32;
      stage.addChild(playerSprite);
    };

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
            if (tile === 8) {
              //Collected a key!
              map.gotKey(playerSprite.gridX - 1, playerSprite.gridY);
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
            if (tile === 8) {
              //Collected a key!
              map.gotKey(playerSprite.gridX + 1, playerSprite.gridY);
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
            if (tile === 8) {
              //Collected a key!
              map.gotKey(playerSprite.gridX, playerSprite.gridY - 1);
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
            if (tile === 8) {
              //Collected a key!
              map.gotKey(playerSprite.gridX, playerSprite.gridY + 1);
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
    case 37:
      //Key: Z -  Left
      left = true;
      break;
    case 88:
    case 39:
      //Key: X - Right
      right = true;
      break;
    case 80:
    case 38:
      //Key: P - Up
      up = true;
      break;
    case 76:
    case 40:
      //Key: L - Down
      down = true;
      break;
    case 13:
      //Key: Enter/Return
      enterPressed = true;
      break;
    case 82:
    case 27:
      //Key: Escape/R
      if (gameState === 1) {
        map.init(level);
      }
      break;
    case 46:
      //Key: Delete - Down
      cheat = true;
      break;
    case 67:
      //Key: C - Down
      //This is a cheat mode / testing aid. Howd down delete and press C to skip to next level.
      if (cheat === true && gameState === 1) {
        level += 1;
        map.init(level);
      }
      break;
    }
  }, false);
  window.addEventListener("keyup", function (event) {
    switch (event.keyCode) {
    case 90:
    case 37:
      //Key: Z -  Left
      left = false;
      break;
    case 88:
    case 39:
      //Key: X - Right
      right = false;
      break;
    case 80:
    case 38:
      //Key: P - Up
      up = false;
      break;
    case 76:
    case 40:
      //Key: L - Down
      down = false;
      break;
    case 46:
      //Key:Delete - Up
      cheat = true;
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

    switch (gameState) {
    case 0: //Start Screen
      startScreen.animate(timeElapsed);
      break;

    case 1: //Game
      player.move(timeElapsed);
      map.animate(timeElapsed);
      break;

    case 2: //Level Complete
      player.move(timeElapsed);
      map.complete(timeElapsed);
      break;

    case 3: //All Levels Complete - Game Over
      map.allComplete(timeElapsed);
      break;
    }

    //sleep(100); //TESTING ONLY - Reduce to 10 TPS

    // render the stage  
    renderer.render(stage);

  }

  //MAIN - Program starting point!
  textures = new Textures(); //Load textures
  startScreen = new StartScreen(); //Set up start screen
  map = new Map(); //Create the map object
  player = new Player();

  startScreen.init();
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