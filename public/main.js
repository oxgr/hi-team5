/**

This file serves as the main file for hi5-online, a mobile-first online multiplayer rhythm experience made as part of DATT 3700. This file is to be accompanied by others that act as modules e.g. one for agents, one for sound...

One important distinction is between <agent> and <data>. An <agent> lives locally, with <pos> properties that are p5.Vector objects. A data is an object sent to and received from the server. It includes only the bare minimum information needed to send to reduce latency. 

agent = {
  color : <hexadecimal color code>,
  pos   : <p5.Vector>,
  newPos: <p5.Vector>
}

data = {
  color: <hexadecimal color code>,
  x    : <Number>,
  y    : <Number>
}

*/

//world definition and server variables

let socket;
let localAgent;
let world;

let mousePos;

let slowCirclePos, slowCircleRadius;
let localSoundAgent;

//sphere sprite and animation variables
var sprite;
var spinningAnimation;
var alternativeAnimation;
let sprites;
let bg;
var ringSprite;

//clouds
let localCloudsAgent;
var cloudAnimation;
var cloud;
let clouds;
let tempColor;

let rings;
let testers;
function preload() {


  //loading the images and animation for the sphere sprites
  spinningAnimation = loadAnimation( "./BallSprite/001.png", "./BallSprite/008.png" );
  cloudAnimation = loadAnimation( "./Clouds/1.png", "./Clouds/6.png" );
  bg = loadImage( "./assets/bg.png" );

}

/**
*  p5.js function. Called once at the start of the sketch.
*/
function setup() {

  // Sprite groups

  //Generally used for collision sake
  //new group added for the sphere sprites to be held. Works like an array
  clouds = new Group();
  sprites = new Group();
  rings = new Group();
  testers = new Group();

  mousePos = createVector();

  // Creates a <canvas> element in the HTML page. This is where our sketch will draw. windowWidth/Height are variables native to p5.js.
  createCanvas( windowWidth, windowHeight );

  // Create a new world that includes information on agents and environment.
  world = new World();

  // Establishes socket.io connection to server.
  socket = initSocket( 'https://hi5-online.glitch.me' );

  // Sets up event listeners. 
  setupSocketListeners( socket, world );

  // Generate a random hexadecimal color code. Example: '#0129af'
  const randomColor = '#' + Math.floor( Math.random() * Math.pow( 16, 6 ) ).toString( 16 );
  tempColor = randomColor;

  // Initialises thisAgent with a random position and color
  localCloudsAgent = new CloudsAgent( round( random( 10, 15 ) ) );

  localAgent = new Agent( random( width ), random( height ), randomColor );

  localSoundAgent = new SoundAgent( width / 2, height / 2, 'green' );





  // Adds thisAgent to the local world.
  world.addAgent( localAgent );

  // world.agents.push( localSoundAgent );

  // Retrieves current world from the server.
  socket.emit( 'getAgentsInWorld', 0 );

  // Packages thisAgent and adds it to server world.
  socket.emit( 'add', localAgent.getData() );

  // Packages thisAgent and sends it to other client worlds.
  socket.emit( 'update', localAgent.getData() );

  soundSetup();

  slowCirclePos = createVector( width / 2, height / 2 );

}


/**
*  p5.js function. Called continuously. Ideally runs 60 times per second i.e. 60 fps.
*/
function draw() {
  
//   fill(166,230,248,10); 
//  rect(0, 0, width, height); 
  //background(bg);

  background( bg );
  // background( 'beige' );

  cloudDraw();



  // Optionally draw background here.
  // world.drawBackground();

  localAgent.updateTarget( { x: mouseX, y: mouseY } );

  if ( frameCount % 60 == 0 )
    socket.emit( 'update', localAgent.getData() );

  // Disable the outline of the shape.
  noStroke();


  // Run these methods for every agent in the world
  for ( let agent of world.agents ) {
    //const speed = agent.checkSpace( slowCirclePos, slowCircleRadius );
    const speed = 0.1;
    agent.move( speed );
    agent.show();


    //sphere.attractionPoint(0.2, agent.pos.x, agent.pos.y);
  }
  //draw every sprite that exists into the world
  drawSprites( sprites );
  localSoundAgent.show();
  drawSprites( testers );

  soundDraw();


}
