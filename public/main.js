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


let socket;

let localAgent;

let world;

function preload() {

  // sprite = loadImage( './assets/sprite.png' );
  // json = loadJSON( '[...].json')

}

/**
*  p5.js function. Called once at the start of the sketch.
*/
function setup() {
  
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
  
  // Adds thisAgent to the local world.
  world.agents.push( localAgent );
  
  // Retrieves current world from the server.
  socket.emit( 'getAgentsInWorld', 0 );
  
  // Packages thisAgent and adds it to server world.
  socket.emit( 'add', localAgent.getData() );
  
  // Packages thisAgent and sends it to other client worlds.
  socket.emit( 'update', localAgent.getData() );

}

/**
*  p5.js function. Called continuously. Ideally runs 60 times per second i.e. 60 fps.
*/
function draw() {
  
  background('#d3e8f2');
  
  // Optionally draw background here.
  // world.drawBackground();
  
  // Disable the outline of the shape.
  noStroke();
  
  // Run these methods for every agent in the world
  for ( let agent of world.agents ) {
    agent.move( 0.1 );
    agent.show();
  }
  
}