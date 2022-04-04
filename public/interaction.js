/**
* p5.js function. Runs every time the mouse is clicked or a tap is made on a touchscreen.
*/
function mouseClicked() {

  const mousePos = createVector( mouseX, mouseY );
  // mousePos.set( mouseX, mouseY );

  localAgent.updateTarget( mousePos );

  socket.emit( 'update', localAgent.getData() );

  const soundClicked = getSoundClicked( mousePos );



  if ( localSoundAgent.checkIfClicked() ) {

    localSoundAgent.pressed();

  } else {

    if ( soundClicked ) {
      removeSound( soundClicked );
    } else {
      const newSound = createSound( localAgent.pos );
      if ( newSound ) {
        dropSound( newSound );
        socket.emit( 'newSound', newSound );
        console.log( ' new sound emitted', newSound );
      }
    }

  }


}

function mousePressed() {



}


function mouseDragged() {

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
