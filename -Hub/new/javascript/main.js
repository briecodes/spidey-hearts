/*
 * <<<<===================================================================>>>>>
 * 	Title: Heart Catcher
 *	Dev: B
 *  Notes: The purpose of this blipp was to develop a full-screen device-responsive game
    that automatically scaled to any screen.
    Key to this idea is a formula for setting proper scales to sprites. this
    ended up being the following line:
    .setScale((imgHeight/canvasHeight)*(sH*(imgWidth/imgHeight)), (imgHeight/canvasHeight)*sH, 0);
 *
 * <<<<===================================================================>>>>>
 */

var Blippar = require('blippar');
blipp = Blippar.blipp;

// ======================================================
// =                        BLIPP                       =
// ======================================================

blipp.getPeel()
  .setOrientation('portrait')
  .setType('fit')
  .setScale(100);

var sW = blipp.getScreenWidth();
var sH = blipp.getScreenHeight();
var mayiPivot = false;
var gameHasStarted = false;
var selectedModel = null;
var hearts = [];
var scoreNumber = 0;
var datTime = 30;

// ======================================================
// =                        SCENE                       =
// ======================================================

var scene = blipp.addScene('default');
var worldBounds  = [-sH/2, -sW/2, sH/2, sW/2];
scene.enemyCollisionRadius = (62/1024)*sH;
scene.playerCollisionRadius = (151/1024)*sH;
scene.enemyCounter = 0;

scene.onCreate = function() {
  blipp.uiVisible('navBar', false);
  scene.setRequiredAssets(['black.png', 'EUROSTIL.ttf', 'spidermangame_deadpool.png', 'spidermangame_gamebg.jpg', 'spidermangame_header.png', 'spidermangame_heart1.png', 'spidermangame_heart2.png', 'spidermangame_heart3.png', 'spidermangame_S1_bg.jpg', 'spidermangame_spider1.png', 'spidermangame_spideybody.png', 'spidermangame_spideyhead.png', 'spidermangame_spideyheadb.png', 'spidermangame_startgame.png', 'spidermangame-startgame.png']);
};

scene.onShow = function() {
  mainOverlayBG.animate().alpha(1).duration(1000).onEnd = function() {
    blipp.setCameraMode('off');
    dropSpider.setHidden(false);
    dropSpider.animate().translationY( (-(623/1024)*(sH/2)) ).duration(1000).onEnd = function() {
      blipp.vibrate();
      scene.initialGyroZ = blipp.getSensor().getGyro()[2];
      pivot.initialRotZ = pivot.getRotationZ();
      startButton.setHidden(false);
      startButton.setClickable(true);
      startButton.animate().alpha(1).duration(1000).onEnd = function(){
      mayiPivot = true;
      };
    };
  };
};

scene.onUpdate = function() {
  if (mayiPivot === true ) {
    swingSpider(pivot);
  }
  if (gameHasStarted === true) {
    checkCollision();
  }
};

scene.onTouchStart = function(id,x) {
  if(gameHasStarted === true) {
    if(selectedModel) {
      wholeSpidey.startX = x;
    }
  }
};

scene.onTouchMove = function(id,x) {
  if(gameHasStarted === true) {
    if(selectedModel) {
      dragModel(wholeSpidey, x);
    }
  }
};

// ======================================================
// =                        MODELS                      =
// ======================================================

var entireScene = scene.getScreen().addSprite('');

var pivot = scene.getScreen().addSprite('')
  .setTranslation(0, sH/2, 0)
  .setParent(entireScene);

var wholeSpidey = scene.getScreen().addSprite('')
  .setTranslation(0, -sH/3, 2)
  .setParent(entireScene);

var mainOverlayBG = scene.getScreen().addSprite('spidermangame_S1_bg.jpg')
  .setName('Main Overlay Background')
  .setScale(sH*(768/1024), sH, 0)
  .setTranslation(0, 0, 0)
  .setAlpha(0)
  .setHidden(false)
  .setParent(entireScene);

var gameBG = scene.getScreen().addSprite('spidermangame_gamebg.jpg')
  .setName('Game Background')
  .setScale(sH*(768/1024), sH, 0)
  .setTranslation(0, 0, 0)
  .setAlpha(0)
  .setHidden(true)
  .setParent(entireScene);

var dropSpider = scene.getScreen().addSprite('spidermangame_spider1.png')
  .setName('Swinging Chibi Spider-Man')
  .setScale((623/1024)*(sH*(212/623)), (623/1024)*sH, 0)
  .setTranslation(0, sH, 1)
  .setAlpha(1)
  .setHidden(false)
  .setType('solid')
  .setParent(pivot);

var startButton = scene.getScreen().addSprite('spidermangame_startgame.png')
  .setName('Start Button')
  .setScale((63/1024)*(sH*(322/63)), (63/1024)*sH, 0)
  .setTranslation(0, -sH/3, 1)
  .setAlpha(0)
  .setHidden(true)
  .setClickable(false)
  .setParent(entireScene);

var deadpool = scene.getScreen().addSprite('spidermangame_deadpool.png')
  .setName('Chibi Deadpool')
  .setScale((234/1024)*(sH*(258/234)), (234/1024)*sH, 0)
  .setTranslation(0, (sH/2)-(((234/1024)*(sH*(258/234)))/2), 1)
  .setAlpha(0)
  .setHidden(true)
  .setParent(entireScene);

var spideyBody = scene.getScreen().addSprite('spidermangame_spideybody.png')
  .setName('Chibi Spider-Man Body')
  .setScale((151/1024)*(sH*(200/151)), (151/1024)*sH, 0)
  // .setTranslation(0, -sH/3, 2)
  .setTranslation(0, 0, 2)
  .setAlpha(0)
  .setHidden(true)
  .setType('solid')
  .setParent(wholeSpidey);

var spideyHead = scene.getScreen().addSprite('spidermangame_spideyhead.png')
  .setName('Chibi Spider-Man Head')
  .setScale((144/1024)*(sH*(154/144)), (144/1024)*sH, 0)
  // .setTranslation(0, (-sH/3)+((144/1024)*(sH*(154/144))/1.25), 3)
  .setTranslation(0, ((144/1024)*(sH*(154/144))/1.25), 3)
  .setAlpha(0)
  .setHidden(true)
  .setType('solid')
  .setParent(wholeSpidey);

spideyHead.setTextures(['spidermangame_spideyhead.png','spidermangame_spideyheadb.png']);

var gameHeart1 = scene.getScreen().addSprite('spidermangame_heart1.png')
  .setName('Game Heart A')
  .setScale((62/1024)*(sH*(64/62)), (62/1024)*sH, 0)
  .setTranslation(0, 0, 4)
  .setAlpha(0)
  .setHidden(true)
  .setParent(entireScene);

var gameHeart2 = scene.getScreen().addSprite('spidermangame_heart2.png')
  .setName('Game Heart B')
  .setScale((62/1024)*(sH*(64/62)), (62/1024)*sH, 0)
  .setTranslation(0, 0, 4)
  .setAlpha(0)
  .setHidden(true)
  .setParent(entireScene);

var gameHeart3 = scene.getScreen().addSprite('spidermangame_heart3.png')
  .setName('Heart Counter Graphic')
  .setScale((40/1024)*(sH*(43/40)), (40/1024)*sH, 0)
  .setTranslation(sW/4, (sH/2)-(((70/1024)*sH)/2), 6)
  .setAlpha(0)
  .setHidden(true)
  .setType('solid')
  .setParent(entireScene);

var gameHeader = scene.getScreen().addSprite('spidermangame_header.png')
  .setName('Game Header')
  .setScale((70/1024)*(sH*(768/70)), (70/1024)*sH, 0)
  .setTranslation(0, (sH/2)-(((70/1024)*sH)/2), 5)
  .setAlpha(0)
  .setHidden(true)
  .setParent(entireScene);

var gameScore = scene.getScreen().addChild("Text")
  .setFontName("EUROSTIL.ttf")
  .setText('00')
  .setTranslation(sW/3, (sH/2)-(((70/1024)*sH)/2), 5)
  .setAlpha(1)
  .setHidden(true)
  .setScale([1.5, 1.5, 1])
  .setColor(0.75, 0.75, 0.75);

var gameTimer = scene.getScreen().addChild("Text")
  .setFontName("EUROSTIL.ttf")
  .setText("30")
  .setTranslation((sW/3)*-1, (sH/2)-(((70/1024)*sH)/2), 5)
  .setAlpha(1)
  .setHidden(true)
  .setScale([1.5, 1.5, 1])
  .setColor(0.75, 0.75, 0.75);

var endScore = scene.getScreen().addChild("Text")
  .setName("End Score CTA")
  .setFontName("EUROSTIL.ttf")
  .setTranslation(0, 0, 8)
  .setAlpha(1)
  .setHidden(true)
  .setScale(3)
  .setColor(0.75, 0.75, 0.75)
  .setClickable(false);

var blackScreen = scene.getScreen().addSprite('black.png')
  .setName('Black Screen')
  .setScale(sH*(768/1024), sH, 0)
  .setTranslation(0, 0, 6)
  .setAlpha(0)
  .setHidden(true)
  .setParent(entireScene);

var gameInstructions = scene.getScreen().addSprite('spidermangame-startgame.png')
  .setName('Instructions')
  .setScale((145/1024)*(sH*(322/145)), (145/1024)*sH, 0)
  .setTranslation(0, 0, 7)
  .setAlpha(0)
  .setHidden(true)
  .setClickable(false)
  .setParent(entireScene);

var enemyOptions = {
  texture: "spidermangame_heart1.png",
  scale: [(62/1024)*(sH*(64/62)), (62/1024)*sH, 0],
};


// ======================================================
// =             SEGMENT 1: Pre-Game                    =
// ======================================================

startButton.onTouchEnd = function() {
  loadGame();
}

function swingSpider(model){
  var gravity = [-blipp.getSensor().getGravity()[1], blipp.getSensor().getGravity()[0]];

  // Calculate the rotation based on gyro
  var offsetRotZ = (blipp.getSensor().getGyro()[2] - scene.initialGyroZ) * 180;
  model.setRotationZ(pivot.initialRotZ - offsetRotZ);
  model.animate().rotationZ(offsetRotZ*-1).duration(5).onEnd = function(){
    swingSpider(model);
  };
}

// ======================================================
// =               SEGMENT 2: Da Game                   =
// ======================================================

function loadGame() {
  mayiPivot = false;
  startButton.animate().alpha(0).duration(500).onEnd = function() {
    startButton.setHidden(true);
    startButton.setClickable(false);
  };
  dropSpider.animate().alpha(0).duration(500).onEnd = function() {
    dropSpider.setHidden(true);
  }
  mainOverlayBG.setHidden(false);
  mainOverlayBG.animate().alpha(1).duration(1100);
  gameBG.setHidden(false);
  gameBG.animate().alpha(1).duration(1100);
  deadpool.setHidden(false);
  deadpool.animate().alpha(1).duration(1200);
  gameHeader.setHidden(false);
  gameHeader.animate().alpha(1).duration(1200);
  gameHeart3.setHidden(false);
  gameHeart3.animate().alpha(1).duration(1200);
  spideyBody.setHidden(false);
  spideyBody.animate().alpha(1).duration(1200);
  spideyHead.setHidden(false);
  spideyHead.animate().alpha(1).duration(1200);
  gameScore.setHidden(false);
  gameTimer.setHidden(false);
  blackScreen.setHidden(false);
  blackScreen.animate().alpha(0.75).duration(1200);
  gameInstructions.animate().alpha(1).duration(1300).onEnd = function() {
    gameInstructions.setHidden(false);
  }
  gameInstructions.setClickable(true);
}

gameInstructions.onTouchEnd = function() {
  blackScreen.animate().alpha(0).duration(500).onEnd = function() {
    blackScreen.setHidden(true);
  };
  this.animate().alpha(0).duration(500);
  this.setClickable(false);
  this.setHidden(true);
  daSlide(deadpool);
  spideyBody.setClickable(true);
  spideyHead.setClickable(true);
  gameHasStarted = true;

  scene.timerInterval = setInterval(function() {
      startTime();
    }, 1000)
}

function startTime() {
  if (datTime === 0) {
    clearInterval(scene.timerInterval);
    gameHasStarted = false;
    gameTimer.setHidden(true);
    gameScore.setHidden(true);
    gameTimer.setText('00');
    endGame();
  }
  if (datTime > 0){
    datTime--;
    gameTimer.setText(datTime.toString());
  }
}

function daSlide(model) {
  var randomSpot = (Math.random()-0.5)*(sW-(((234/1024)*(sH*(258/234)))/2));
  model.animate().translationX(randomSpot).duration(1000).onEnd = function() {
    spawnEnemy();
    if (gameHasStarted){
        daSlide(model);
    }
  }
}

spideyBody.onTouchStart = function(id,x){
  selectedModel = spideyBody;
	wholeSpidey.startX = x;
};

spideyBody.onTouchMove = function(id,x){
	wholeSpidey.dragDelta = x - wholeSpidey.startX;
};

spideyBody.onTouchEnd = function(){
  selectedModel = null;
	if(wholeSpidey.dragDelta > 5 || wholeSpidey.dragDelta < -5){
		wholeSpidey.dragDelta = 0;
	}
};

spideyHead.onTouchStart = function(id,x){
  selectedModel = spideyHead;
	wholeSpidey.startX = x;
};

spideyHead.onTouchMove = function(id,x){
	wholeSpidey.dragDelta = x - wholeSpidey.startX;
};

spideyHead.onTouchEnd = function(){
  selectedModel = null;
	if(wholeSpidey.dragDelta > 5 || wholeSpidey.dragDelta < -5){
		wholeSpidey.dragDelta = 0;
	}
};

function dragModel(model, x) {
  var deltaX = (x - wholeSpidey.startX);
  var lastLoc = wholeSpidey.getTranslationX();
  lastLoc = lastLoc + (deltaX*3);
  wholeSpidey.animate().translationX(lastLoc).duration(500).onEnd = function(){};
  wholeSpidey.startX = x;
}

// ======================================================
// =               SEGMENT 3: Post Game                 =
// ======================================================

function endGame() {
  datTime = 30;
  gameTimer.setText(datTime.toString());
  blackScreen.setHidden(false);
  blackScreen.animate().alpha(0.75).duration(500);
  wholeSpidey.animate().alpha(0).duration(500);
  deadpool.animate().alpha(0).duration(500).onEnd = function() {
    deadpool.setHidden(true);
  }
  endScore.setHidden(false);
  endScore.setClickable(true);
  endScore.setAlpha(1);
  endScore.setText('Nice!<br />Your Score is: ' + scoreNumber + '<br />Tap to Play Again');
}

endScore.onTouchEnd = function() {
  unloadGame();
}

function unloadGame() {
  hearts.forEach(function(singleHeart, index) {
    if (singleHeart) {
      singleHeart.destroy();
    }
  });
  scoreNumber = 0;
  datTime = 30;
  endScore.animate().alpha(0).duration(500).onEnd = function() {
    endScore.setClickable(false);
  }
  gameTimer.setHidden(true);
  gameTimer.setText(datTime.toString());
  gameScore.setHidden(true);
  gameScore.setText(00);
  blackScreen.animate().alpha(0).duration(500).onEnd = function() {
    blackScreen.setHidden(true);
  }
  gameBG.animate().alpha(0).duration(500).onEnd = function() {
    gameBG.setHidden(true);
  }
  deadpool.setTranslation(0, (sH/2)-(((234/1024)*(sH*(258/234)))/2), 1);
  deadpool.animate().alpha(0).duration(500).onEnd = function() {
    deadpool.setHidden(true);
  }
  gameHeader.animate().alpha(0).duration(500).onEnd = function() {
    gameHeader.setHidden(true);
  }
  gameHeart3.animate().alpha(0).duration(500).onEnd = function() {
    gameHeart3.setHidden(true);
  }
  wholeSpidey.setTranslation(0, -sH/3, 2);
  spideyBody.animate().alpha(0).duration(500).onEnd = function() {
    spideyBody.setHidden(true);
  }
  spideyHead.animate().alpha(0).duration(500).onEnd = function() {
    spideyHead.setHidden(true);
  }
  mainOverlayBG.setHidden(false);
  mainOverlayBG.animate().alpha(1).duration(1000).onEnd = function() {
    blackScreen.setAlpha(0);
    blackScreen.setHidden(true);
    dropSpider.setTranslationY(sH);
    dropSpider.setHidden(false);
    dropSpider.setAlpha(1);
    dropSpider.animate().translationY( (-(623/1024)*(sH/2)) ).duration(1000).onEnd = function() {
      blipp.vibrate();
      startButton.setHidden(false);
      startButton.setClickable(true);
      startButton.animate().alpha(1).duration(1000).onEnd = function() {
        mayiPivot = true;
        var hearts = [];
      };
    };
  };
}

// ======================================================
// =          SEGMENT 4: Collision & Generation         =
// ======================================================

function Enemy(options) {
  var enemy = scene.getScreen().addSprite(options.texture);
  enemy.setScale(options.scale);
  enemy.setParent(entireScene);
  enemy.setName('enemy' + scene.enemyCounter);
  hearts.push(enemy);
  return enemy;
}

function spawnEnemy() {
  var deadCurrentX = deadpool.getTranslationX();
  var deadCurrentY = deadpool.getTranslationY();
  scene.enemyCounter++;
  var enemy = new Enemy(enemyOptions);
  enemy.setTranslation(deadCurrentX,deadCurrentY,4);
  enemy.animate().translationY((sH/2.4)*-1).rotationZ(200).duration((Math.random() * 5000) +700);
}

function checkCollision() {
  hearts.forEach(function(singleHeart,index) {
    if (singleHeart) {
      var enemyPos  = singleHeart.getTranslation();
      var laserPos = wholeSpidey.getTranslation();
      var floor = (sH/2.5)*-1;

      var dx = enemyPos[0] - laserPos[0];
      var dy = enemyPos[1] - laserPos[1];
      var dz = enemyPos[2] - laserPos[2];
      var dist = Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
      var distanceBetween = Math.sqrt(Math.pow((enemyPos[0] - laserPos[0]), 2) + Math.pow((enemyPos[1] - laserPos[1]), 2));

      if ( distanceBetween <= scene.playerCollisionRadius ) {
        spideyHead.setActiveTexture(1);
        spideyHead.animate().rotationZ(-5).duration(50);
        singleHeart.animate().scale(200, 200, 200).alpha(0).duration(250).onEnd = function(){
          scoreNumber++;
          var scoreNumberTxt = scoreNumber.toString();
          if(scoreNumber < 10){
            scoreNumberTxt = '0' + scoreNumber.toString();
          }
          gameScore.setText(scoreNumberTxt);
          singleHeart.destroy();
          hearts[index] = null;
          spideyHead.setActiveTexture(0);
          spideyHead.animate().rotationZ(0).duration(50);
        }
      }

      if (enemyPos[1] < floor) {
        singleHeart.animate().alpha(0).duration(50).onEnd = function() {
          singleHeart.destroy();
          hearts[index] = null;
        }
      }
    }
  });
}
