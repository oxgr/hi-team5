/**
* p5.js function. Runs every time the mouse is clicked or a tap is made on a touchscreen.
*/
function mouseClicked() {
  
  localAgent.updateTarget( {x: mouseX, y: mouseY });
  
  socket.emit( 'update', localAgent.getData() );
  
}
function mousePressed(){	
  localAgent.clicked();
  localSoundAgent.Pressed();
 
}
