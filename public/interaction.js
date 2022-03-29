/**
* p5.js function. Runs every time the mouse is clicked or a tap is made on a touchscreen.
*/
function mouseClicked() {
  
  const mousePos = createVector( mouseX, mouseY );
  // mousePos.set( mouseX, mouseY );

  localAgent.updateTarget( mousePos );
  
  socket.emit( 'update', localAgent.getData() );

  const soundClicked = getSoundClicked( mousePos );

  if ( soundClicked ) {
    removeSound( soundClicked );
  } else {
    dropSound( localAgent.pos );
  }
  
  
}

function mouseDragged() {
  
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
    clearSounds();
  }

  if ( keyCode == 68 ) {
    dropSound( mouseX, mouseY );
  }
}