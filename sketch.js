
//creating variables
//gamestate
var PLAY = 1;
var END = 0;
var gameState = PLAY;
//trex
var trex, trex_running, trex_collided;
//ground
var ground, invisibleGround, groundImage;
//cloud
var cloudsGroup, cloudImage;
//obstacles
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
//score is intilized to 0
var score=0;
//gameover and restart
var gameOver, restart;
// some stuff
localStorage["HighestScore"] = 0;

function preload(){
  //loading animations
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  //canvas
  createCanvas(600, 200);
  //trex sprite
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  //size
  trex.scale = 0.5;
  //ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  //gameover
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  //restart
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  //sizes
  gameOver.scale = 0.5;
  restart.scale = 0.5;
//making it invisible
  gameOver.visible = false;
  restart.visible = false;
  //invisible wall to make trex stand on it
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  //cloud and obstacles group
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  //score
  score = 0;
  trex.debug=false;
  trex.setCollider("circle",0,0,40)
}

function draw() {
  //trex.debug = true;
  background("white");
  //concatination
  text("Score: "+ score, 500,50);
  // if else if statement
  if (gameState===PLAY){
    //score random to a whole number
    score = score + Math.round(getFrameRate()/60);
    //making score go up
    ground.velocityX = -(6 + 3*score/100);
  //trex jump
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  //gravity
    trex.velocityY = trex.velocityY + 0.8
  //endless ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  // making trex stand on the invisible wall
    trex.collide(invisibleGround);
    //calling functions
    spawnClouds();
    spawnObstacles();
  //making the game to end
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    //making gameover and restart to be seen
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    //if mouse if touched over the restart sprite make the game restart
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  //drawing sprite
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
//making it play again
  gameState = PLAY;
  //invisible gameover and restart
  gameOver.visible = false;
  restart.visible = false;
  //to make the obstacles and cloud destroy before restarting
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  //change animation to running
  trex.changeAnimation("running",trex_running);
  //some stuff again
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  //score
  score = 0;
  
}