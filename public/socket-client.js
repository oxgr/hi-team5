/**
* Initialises the socket connection and returns it.
*/
function initSocket( url ) {

  return io.connect( url );

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
function setupSocketListeners( socket, world ) {

  socket.on( 'connect', () => {
    console.log( 'connected to server!' )
    socket.emit( 'getWorld' );
  } );

  socket.on( 'agentsInWorld', ( newWorld ) => world.addAgentsFromWorld( newWorld ) );
  socket.on( 'soundsInWorld', ( newSounds ) => addSoundsFromWorld( newSounds ) );

  socket.on( 'add', ( data ) => world.addAgent( data ) );
  socket.on( 'update', ( data ) => world.updateAgent( data ) );
  socket.on( 'remove', ( data ) => world.removeAgent( data ) );

  socket.on( 'addSound', ( sound ) => {
    console.log( 'added new sound!', sound );
    addSound( sound );
  } );

  socket.on( 'updateSound', ( sound ) => updateSound( sound ) )
  socket.on( 'removeSound', ( sound ) => removeSound( sound ) )

}