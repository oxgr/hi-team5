/**
* p5.js function. Runs every time the mouse is clicked or a tap is made on a touchscreen.
*/
function mouseClicked() {

  const mousePos = createVector( mouseX, mouseY );
  // mousePos.set( mouseX, mouseY );

  localAgent.updateTarget( mousePos );

  socket.emit( 'update', localAgent.getData() )


  if ( localSoundAgent.checkIfClicked() ) {

    localSoundAgent.pressed();

  } else {

  const soundClicked = getSoundClicked( mousePos );

    if ( soundClicked ) {
      removeSound( soundClicked );
      socket.emit( 'removeSound', soundClicked);
    } else {
      const newSound = createSound( { x: mouseX, y: mouseY } );
      if ( newSound ) {
        addSound( newSound );
        socket.emit( 'addSound', newSound );
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
