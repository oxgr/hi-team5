/**
* p5.js function. Runs every time the mouse is clicked or a tap is made on a touchscreen.
*/
function mouseClicked() {
  
  localAgent.updateTarget( {x: mouseX, y: mouseY });
  
  socket.emit( 'update', localAgent.getData() );

  soundSetup();

  soundEnabled = true;
  
}

function keyPressed() {

  console.log( keyCode );

  // if spacebar
  if ( keyCode == 32 ) {
    soundEnabled = !soundEnabled;
  }

  if ( keyCode == 68 ) {
    dropSound( mouseX, mouseY );
  }
}