const express = require('express');

const app = express();

const server = app.listen( process.env.PORT || 3000, () => {
console.log('Server running! Listening on ' + process.env.PORT )
});

app.use( express.static( 'public' ) );

const socket = require( 'socket.io' );
const io = socket( server );

let world = [];

io.on( 'connection', newConnection );

function newConnection( socket ) {
  
  console.log('new connection @ ', socket.id);
  
  // Server-side listeners go here!
  
  socket.on( 'getWorld', () => {
    io.to( socket.id ).emit( 'world', world );
  } )
  
  socket.on( 'update', ( data ) => {
    socket.broadcast.emit( 'update', data );
    const exists = world.find( ( agent ) => agent.color == data.color )
  
    if ( exists ) {
      exists.x = data.x;
      exists.y = data.y;
    }
  })
  
  socket.on( 'push', ( data ) => {
    socket.broadcast.emit( 'push', data );
    socket.data.color = data.color;
    world.push(data);
  })
  
  socket.on( 'disconnect', () => {
    io.emit( 'pop', socket.data );
    const index = world.findIndex( ( agent ) => agent.color == socket.data.color );
  
    if ( index > -1) {
      world.splice( index, 1 );
      console.log('someone disconnected! ');
    }
  });
  
  //
  
}