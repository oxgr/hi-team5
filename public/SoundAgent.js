
let upldStars = [];

let upldStar_initX, upldStar_initY;
let l;
let upldStar_dx, upldStar_dy;
let theta;
let maxTail;
let active = false;
class SoundAgent extends Agent {
  constructor ( x, y, color ) {

    super( x, y, color );
    this.state = 0;
    this.radius = 100;
    tempColor = '#007500';
    l = 60;

    upldStars.push( { x: 0, y: -l } );

    upldStar_initX = 0;
    upldStar_initY = -l;
    upldStar_dx = 0;
    upldStar_dy = 0;
    theta = 0;
    maxTail = 30;

    frameRate( 60 );
    angleMode( DEGREES );


  }
  /** 
   * Pressed is a function to check how many times the SoundAgent were clicked
  */

  pressed () {

    console.log( "clicked on the recorder!" );

    userStartAudio();


    //tester.setSpeed(3, direction);
    //testers.add(tester);
    // make sure user enabled the mic
    if ( this.state === 0 && mic.enabled ) {
      // record to our p5.SoundFile
      recorder.record( soundFile );

      localSoundAgent.color = '#ff0000';
      this.state++;
      active = true;

    } else if ( this.state === 1 ) {

      localSoundAgent.color = '#ff00ff';
      // stop recorder and
      // send result to soundFile
      recorder.stop();

      this.state++;
      // soundFile.play();

    } else if ( this.state === 2 ) {
      localSoundAgent.color = '#00ffff';
      soundFile.play(); // play the result!
      //save(soundFile, 'mySound.wav');
      this.state++;
      active = false;
    } else {

      localSoundAgent.color = '#00ff00';
      this.state = 0;
    }
    tempColor = localSoundAgent.color;

  }

  checkIfClicked () {

    let d = dist( mouseX, mouseY, this.pos.x, this.pos.y );
    return ( d < this.radius );

  }



  /**
*  Draws the agent at the given <pos> position lerped (interpolated) to the <newPos> position. Filled with the color property.
*/
  show () {
    this.sprite.remove();

    if ( active === true ) {
      let diag = 2 * l * sin( theta / 2 );
      let ang = ( 180 - theta ) / 2;

      upldStar_dx = diag * sin( ang );
      upldStar_dy = diag * cos( ang );

      if ( upldStars.length > 2 ) {
        for ( let i = upldStars.length - 2; i > 0; i-- ) {
          upldStars[ i ].x = upldStars[ i - 1 ].x;
          upldStars[ i ].y = upldStars[ i - 1 ].y;
        }
      }
      upldStars[ 0 ].x = upldStar_initX + upldStar_dx;
      upldStars[ 0 ].y = upldStar_initY + upldStar_dy;

      push();
      translate( width / 2, height / 2 );

      fill( 255 );
      ellipse( 0, 0, 10 );
      //textAlign(CENTER);
      //textSize(20);
      //text("Uploading...", 0, 0);

      noStroke();
      // fill(255,255,0,200);

      for ( let i = 0; i < upldStars.length; i++ ) {
        fill( 255, 255, 0, map( i, 0, maxTail - 1, 200, 10 ) );
        ellipse( upldStars[ i ].x, upldStars[ i ].y, map( i, 0, maxTail - 1, 20, 10 ) );
      }

      // ellipse(x+dx, y+dy, 20);
      pop();

      if ( upldStars.length < maxTail ) upldStars.push( { x: upldStars[ upldStars.length - 1 ].x, y: upldStars[ upldStars.length - 1 ].y } );

      theta += 3;

      //  console.log(stars[0].x + " " + stars[0].y);
    }

    fill( this.color );
    ellipse( this.pos.x, this.pos.y, this.radius );
    let sColor = color( tempColor );
    // draw slow circle
    slowCircleRadius = 100
    sColor.setAlpha( 100 );
    fill( sColor );
    circle( slowCirclePos.x, slowCirclePos.y, slowCircleRadius + 50 );

    fill( 'white' );
    textAlign( CENTER, CENTER );
    if ( this.state === 0 ) {
      text( 'Tap to record!', this.pos.x - 25, this.pos.y, this.radius / 2 );
    }
    if ( this.state === 1 ) {
      text( 'Recording! Tap to stop!', this.pos.x - 25, this.pos.y, this.radius / 2 );

    } else if ( this.state === 2 ) {
      text( 'Tap to play and Save', this.pos.x - 25, this.pos.y, this.radius / 2 );
    } else if ( this.state === 3 ) {
      fill( 'black' );
      text( 'Saving', this.pos.x - 25, this.pos.y, this.radius / 2 );
    }

  }
}

