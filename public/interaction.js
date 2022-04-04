/**
* p5.js function. Runs every time the mouse is clicked or a tap is made on a touchscreen.
*/
function mouseClicked() {

  mousePos.set( mouseX, mouseY );
  // mousePos.set( mouseX, mouseY );

  // localAgent.updateTarget( mousePos );

  // socket.emit( 'update', localAgent.getData() )


  if ( localSoundAgent.checkIfClicked() ) {

    localSoundAgent.pressed();

  }


}

let soundClicked;

function mousePressed() {

  mousePos.set( mouseX, mouseY );

  soundClicked = getSoundClicked( mousePos );

}


function mouseDragged() {

  if ( soundClicked ) {

    soundClicked.pos.x = mouseX;
    soundClicked.pos.y = mouseY;

    socket.emit( 'updateSound', soundClicked );
    
  }

}

function mouseReleased() {

  const distance = dist( mouseX, mouseY, mousePos.x, mousePos.y );

  // Checking if soundClicked exists and mimicking a click i.e. mouse didn't drag far.
  if ( soundClicked && distance < 5 ) {

    removeSound( soundClicked );
    socket.emit( 'removeSound', soundClicked);

  } else if ( !soundClicked ) {

    const newSound = createSound( { x: mouseX, y: mouseY } );
    if ( newSound ) {
      addSound( newSound );
      socket.emit( 'addSound', newSound );
      console.log( 'new sound emitted' );
    }

  }

    

  soundClicked = undefined;

}

function keyPressed() {

  console.log( keyCode );
  console.log( String.fromCharCode( keyCode ) );

  // if spacebar
  if ( keyCode == 32 ) {
    soundEnabled = !soundEnabled;
    toggleSound( soundEnabled );

    console.log( { soundEnabled: soundEnabled } )
  }

  if ( keyCode == BACKSPACE ) {
    clearSounds();
  }

  if ( keyCode == 68 ) {
    dropSound( mouseX, mouseY );
  }
}
