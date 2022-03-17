/**
*  Draws a single agent at the given <pos> position lerped (interpolated) to the <newPos> position. Filled with the color property.
*
* @param Object agent The agent to draw. It should have the following properties:
        - pos   : p5.Vector
        - newPos: p5.Vector
        - color : hexadecimal color code
*/
function drawAgent( agent ) {
  
  agent.pos.lerp( agent.newPos, 0.1 );
  
  fill( agent.color );
  ellipse( agent.pos.x, agent.pos.y, 50 );
  
}

/**
*  Fills the world with all the agents in the <newWorld> array. This is ideally retrieved from the server after a getWorld socket.emit.
*
* @param Array newWorld An array of objects containing all the agents in the world.
*/
function updateWorld( newWorld ) {
  
  for ( let data of newWorld ) {
    if ( data.color != thisAgent.color )
      pushAgent( data );
  }
  
}

/**
*  Adds an agent to the local world. A separate object gets the raw values and assigns them to properties. This method is preferred since it makes a deep copy isntead of a shallow copy.

This method creates two p5.Vector objects from the xy values. This is done to utilise the utility methods in the p5.Vector class.
*
* @param Object data A packet of data received from the server. Contains a color to id the agent and x, y properties.
*/
function pushAgent( data ) {
  
  const agent = {
    color  : data.color,
    pos    : createVector( data.x, data.y ),
    newPos : createVector( data.x, data.y )
  }
  
  world.push( agent );
  console.log( 'new agent in world!')
  
}

/**
* Updates the position of an agent in the world. Tracks down the spcific agent by matching the color code, then updates the new xy values to the newPos vector.

* @param Object data* @param Object data A packet of data received from the server. Contains a color to id the agent and x, y properties.
*/
function updateAgent( data ) {
  
  const exists = world.find( ( agent ) => agent.color == data.color )
  
  if ( exists ) {
    exists.newPos.x = data.x;
    exists.newPos.y = data.y;
  } else {
    pushAgent( data );
  }
  
}

/**
* Finds an agent in the world by matching the color code, then removes it from the world.

* @param Object data* @param Object data A packet of data received from the server. Contains a color to id the agent and x, y properties.
*/
function popAgent( data ) {
  
  const index = world.findIndex( ( agent ) => agent.color == data.color );
  
  if ( index > -1) {
    world.splice( index, 1 );
    console.log('someone disconnected! ')
  }
  
}

/**
* Creates a separate data object to send to server with just the minimum amount of information needed to reduce latency. Ideally only used to send local objects like thisAgent.

* @param Object thisAgent Well... this local agent?
*/
function sendAgent( thisAgent ) {
  
  const data = {
    
    color: thisAgent.color,
    x    : thisAgent.newPos.x,
    y    : thisAgent.newPos.y
    
  }
  
  socket.emit( 'update', data );
  
}
