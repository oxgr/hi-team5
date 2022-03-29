const express = require('express');

const app = express();

const server = app.listen( process.env.PORT || 3000, () => {
console.log('Server running! Listening on localhost:' + ( process.env.PORT || 3000 ) )
});

app.use( express.static( 'public' ) );

const socket = require( 'socket.io' );
const io = socket( server, {
  cors: {
    origin: '*'
  }
} );

let world = {

  agents: [],
  environment: []

};

io.on( 'connection', newConnection );

function newConnection( socket ) {
  
  console.log('new connection @ ', socket.id);
  
  // Server-side listeners go here!
  
  socket.on( 'getAgentsInWorld', () => {
    
    io.to( socket.id ).emit( 'agentsInWorld', world.agents );
    
  } )
  
  socket.on( 'update', ( data ) => {
    
    socket.broadcast.emit( 'update', data );
    
    const exists = world.agents.find( ( agent ) => agent.color == data.color )
  
    if ( exists ) {
      exists.x = data.x;
      exists.y = data.y;
    } else {
      world.agents.push(data);
    }
    
  })
  
  socket.on( 'add', ( data ) => {
    
    socket.broadcast.emit( 'add', data );
    socket.data.color = data.color;
    socket.data.size = data.size;
    socket.data.sColor = data.sColor;
    world.agents.push(data);
    
  });
  
  socket.on( 'disconnect', () => {
    
    io.emit( 'remove', socket.data );
    
    const index = world.agents.findIndex( ( agent ) => agent.color == socket.data.color );
  
    if ( index > -1) {
      world.agents.splice( index, 1 );
      console.log('someone disconnected! ');
    }
    
  });
  
  //
  
}