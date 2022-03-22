/**
* p5.js function. Runs every time the mouse is clicked or a tap is made on a touchscreen.
*/
function mouseClicked() {
  
  localAgent.updateTarget( {x: mouseX, y: mouseY });
  
  socket.emit( 'update', localAgent.getData() );

  dropSound( localAgent.pos.x, localAgent.pos.y );
  
}

function keyPressed() {

  console.log( keyCode );

  // if spacebar
  if ( keyCode == 32 ) {
    soundEnabled = !soundEnabled;
    toggleSound( soundEnabled );

    console.log({ soundEnabled: soundEnabled })
  }

  if (keyCode == BACKSPACE) {
    sounds = [];
  }

  if ( keyCode == 68 ) {
    dropSound( mouseX, mouseY );
  }
}