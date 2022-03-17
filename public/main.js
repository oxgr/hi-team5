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


// import 'https://cdn.jsdelivr.net/npm/p5';
// import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

let socket;

let thisAgent = {};

let world = [];

/**
*  p5.js function. Called once at the start of the sketch.
*/
function setup() {
  
  // Establishes socket.io connection to server.
  socket = io.connect('https://hi5-online.glitch.me/');
  
  // Sets up event listeners. Declared further below.
  setupSocketListeners( socket );
  
  // Creates a <canvas> element in the HTML page. This is where our sketch will draw. windowWidth/Height are variables native to p5.js.
  createCanvas( windowWidth, windowHeight );
  
  // Initialises thisAgent with a random hexadecimal color code string ( '#0129af' ) and a random position.
  thisAgent = {
    color  : thisAgent.id = '#' + Math.floor( Math.random() * Math.pow( 16, 6 ) ).toString( 16 ),
    pos    : createVector( random( width ), random( height ) ),
    newPos : createVector( random( width ), random( height ) )
  }
  
  // Adds thisAgent to the local world.
  world.push( thisAgent );
  
  // Packages thisAgent and sends it to other client worlds.
  sendAgent( thisAgent );

}

/**
*  p5.js function. Called continuously. Ideally runs 60 times per second i.e. 60 fps.
*/
function draw() {
  
  background('#d3e8f2');
  
  stroke( '#444444' );
  
  const spacing = 50;
  drawMap( width, height, spacing );
  
  noStroke();
  for ( let agent of world ) {
    drawAgent( agent );
  }
  
}

function drawMap( width, height, spacing ) {
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if(x % spacing == 0 && y % spacing == 0 )
        point(x, y);
    } 
  }
  
}

/**
* p5.js function. Runs every time the mouse is clicked or a tap is made on a touchscreen.
*/
function mouseClicked() {
  
  thisAgent.newPos.x = mouseX;
  thisAgent.newPos.y = mouseY;
  
  sendAgent( thisAgent );
  
}

/**
* Initialises the listeners for socket events. These listeners decide what to do when an event/message is received from the server.

The event pipeline is:
  1. Client (this sketch) sends events with socket.emit( topic, payload )
  2. Server receives event and handles in server.js.
  3. Server possibly sends the event to other clients with socket.broadcast.emit() or io.emit()
  4. Client receives events and handles it in this method.
  
Some names of events are determined by socket.io and are found in the socket.io API (https://socket.io/docs/v4/client-api/) e.g. the 'connect' event is emitted when a connection attempt to the server is successful.

Other names (world, update, etc...) are made up, so feel free to add new events as necessary! Just be sure to make the appropriate changes for steps 2 and 3 in server.js. If you're confused, ask Faadhi!

* @param <Socket.io> socket The instance of a socket.io connection.
*/
function setupSocketListeners( socket ) {
  
  socket.on( 'connect', () => {
    console.log( 'connected to server!')
    socket.emit( 'getWorld' );
  });
  
  socket.on( 'world',   ( world ) => updateWorld( world ) );
  socket.on( 'update',  ( data ) => updateAgent( data ) );
  socket.on( 'push',    ( data ) => pushAgent( data ));
  socket.on( 'pop',     ( data ) => popAgent( data ));
  
}