
let soundEnabled = false;

let osc, envelope, fft;

let scaleArray = [60, 62, 64, 65, 67, 69, 71, 72];
let note = 0;

let sounds;

function soundSetup() {
   
  osc = new p5.SinOsc();

  // Instantiate the envelope
  envelope = new p5.Env();

  // set attackTime, decayTime, sustainRatio, releaseTime
  envelope.setADSR(0.001, 0.5, 0.1, 0.5);

  // set attackLevel, releaseLevel
  envelope.setRange(1, 0);

  

  sounds = [];

}

function toggleSound( toggle ) {

  if ( toggle ) {
    
    osc.start();

  } else {

    osc.stop();

  }

  

}

function soundStart() {

  osc.amp( 0 );
  osc.start();

}

function soundStop() {

  osc.stop();

}

function soundDraw() {

  for (let sound of sounds ) {
    if ( sounds.indexOf( sound ) == note) {
      fill( 'red' );
      rect( sound.pos.x, sound.pos.y, 20 );
    } else {
      fill('pink')
      rect( sound.pos.x, sound.pos.y, 20 );
    }
  }


  if (frameCount % 60 === 0 || frameCount === 1) {
    let midiValue = scaleArray[note];
    let freqValue = midiToFreq(midiValue);
    osc.freq(freqValue);
    let amp = 0;
    if ( sounds.length > 0 ) {
      amp = norm(sounds[note].pos.dist( localAgent.pos ), 200, 0);
    }

    console.log( {amp:amp} );
    osc.amp( amp );

    envelope.play(osc, 0, 0.1);

    if (sounds.length > 1)
      note = (note + 1) % (sounds.length);
    console.log( {
      note: note,
      soundsLength: sounds.length
    })
  }

 

}

function dropSound( x, y ) {

    sounds.push({
        pos: createVector( x, y )
    })

    console.log( { sounds: sounds } );

}