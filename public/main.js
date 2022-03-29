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
let mic,recorder,soundFile;

let mySound;

let socket;

let localAgent;

let world;

let slowCirclePos, slowCircleRadius;
let localSoundAgent;

function preload() {

  // sprite = loadImage( './assets/sprite.png' );
  // json = loadJSON( '[...].json')

  soundFormats('mp3', 'ogg');
  mySound = loadSound('assets/doorbell.mp3');
}

/**
*  p5.js function. Called once at the start of the sketch.
*/
function setup() {
  
  
  mic = new p5.AudioIn();

  // prompts user to enable their browser mic
  mic.start();

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);

  // this sound file will be used to
  // playback & save the recording
  soundFile = new p5.SoundFile();

  
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

  // Initialises thisAgent with a random position and color
  localAgent = new Agent( random( width), random( height ), randomColor );
  
  localSoundAgent = new SoundAgent( 100, 100, 'green' );
 

  
  // Adds thisAgent to the local world.
  world.addAgent( localAgent );
  
  world.agents.push( localSoundAgent );
  
  // Retrieves current world from the server.
  socket.emit( 'getAgentsInWorld', 0 );
  
  // Packages thisAgent and adds it to server world.
  socket.emit( 'add', localAgent.getData() );
  
  // Packages thisAgent and sends it to other client worlds.
  socket.emit( 'update', localAgent.getData() );

  soundSetup();

  slowCirclePos = createVector( width/2, height/2 );

}


/**
*  p5.js function. Called continuously. Ideally runs 60 times per second i.e. 60 fps.
*/
function draw() {
  
  background('#d3e8f2');
  
  localSoundAgent.show();
  // Optionally draw background here.
  // world.drawBackground();

  localAgent.updateTarget( {x: mouseX, y: mouseY });
  
  // Disable the outline of the shape.
  noStroke();

  // draw slow circle
  slowCircleRadius = 100
  fill( 255, 100 );
  circle( slowCirclePos.x, slowCirclePos.y, slowCircleRadius * 2 );
  
  // Run these methods for every agent in the world
  for ( let agent of world.agents ) {
    const speed = agent.checkSpace( slowCirclePos, slowCircleRadius )
    agent.move( speed );
    agent.show();

  
  }

  soundDraw();
  
}