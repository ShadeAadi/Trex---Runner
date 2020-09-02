var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var score, hiScore;
var cloudAnimation;
var cactus1, cactus2, cactus3, cactus4, cactus5, cactus6,                   obstacleFrameCount;
var game_state;
var watchOut, clouds, ending;
var resetButtonImage, gameOverImage;
var checkPoint, die, jump;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudAnimation = loadImage("cloud.png");
  
  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");
  
  resetButtonImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");
  
  checkPoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  
}

function setup() {
  createCanvas(600, 200);
  
  score = 0
  
  if (localStorage["hiScore"] === undefined) {
    localStorage["hiScore"] = 0
  }
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -3;
  
  invisibleGround = createSprite(200,195,400,10);
  invisibleGround.visible = false;
  
  obstacleFrameCount = 0;
  
  textSize (15);
  
  game_state = "play";
  
  watchOut = new Group ()
  clouds = new Group ()
  ending = new Group ()
}

function draw() {
  background("white");
  
  if (game_state === "play") {
  if (frameCount % 10 === 0) {
    score = score + 1
  }
    
  if (trex.isTouching(watchOut)){
    game_state = "end"
    die.play()
  }
  
  if(keyDown("space") && trex.y > 163) {
    trex.velocityY = -11;
     jump.play()
  }
  
  trex.velocityY = trex.velocityY + 0.5
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
    
  ground.velocityX = -5 - score / 100;
    
    if (score % 100 === 0 && score > 0) {
      checkPoint.play()
    }
    
    createClouds()
  
    createObstacles()
  } else {
    trex.velocityX = 0;
    trex.velocityY = 0;
    
    ground.velocityX = 0;
    
    watchOut.setLifetimeEach(-1)
    clouds.setLifetimeEach(-1)
    
    watchOut.setVelocityXEach(0)
    
    clouds.setVelocityXEach (0)
    
    trex.changeAnimation("collided")
    trex.velocityY = 0
    
    reset()    
  }
  
  trex.collide(invisibleGround);
  
  text (score, 530, 20)
  
  text ("Hi: " + localStorage["hiScore"], 430, 20)
  
  drawSprites();
}
function createClouds() {  
  
  //create clouds
  if (frameCount % 95 === 0) {
    
    //random cloud alttitude and movment
     var cloud = createSprite(650, random(50, 150), 3, 3)
     cloud.velocityX = -1.5 - score / 100;
     clouds.add(cloud)
     
     //relistic clouds
     cloud.addImage("cloud", cloudAnimation)
     
    //reduse lag
     cloud.lifetime = 475
     
     //making sure trex appers in front of clouds
     trex.depth = cloud.depth + 1

  }
  
}

function createObstacles() {
 if (frameCount % Math.round(random(90, 95)) === 0) {
    if (frameCount - obstacleFrameCount >45) {
      var species = Math.round(random(1, 6));
      obstacleFrameCount = frameCount;
      var cactus = createSprite(650, 165, 10, 20);
      if (species === 1) {
        cactus.addImage("cactus", cactus1);
      } else if (species === 2) {
        cactus.addImage("cactus", cactus2);
      } else if (species === 3) {
        cactus.addImage("cactus", cactus3);
      } else if (species === 4) {
        cactus.addImage("cactus", cactus4);
      } else if (species === 5) {
        cactus.addImage("cactus", cactus5);
      } else {
        cactus.addImage("cactus", cactus6);
      }
      cactus.scale = 0.75;
      cactus.velocityX = -5 - score / 100;
      cactus.lifetime = 150;
      watchOut.add(cactus);
    }
 }
}

function reset(){
  var resetButton = createSprite(300,100);
  resetButton.addAnimation("restartButton", resetButtonImage);
  var resetTyping = createSprite(300, 150);
  resetTyping.addAnimation("gameOver", gameOverImage);
  resetTyping.scale = 0.75;
  ending.add(resetButton);
  ending.add(resetTyping);
  
  if (mousePressedOver(resetButton)) {
    if (score > localStorage["hiScore"]) {
     localStorage["hiScore"] = score
    }
    watchOut.destroyEach()
    clouds.destroyEach()
    game_state = "play";
    score = 0;
    trex.changeAnimation("running");
    ending.destroyEach()
  }
}