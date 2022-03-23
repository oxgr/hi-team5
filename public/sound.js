
let soundEnabled = false;

let osc, envelope, fft;
let scaleArray;
let noteCounter = 0;

let sounds;

function soundSetup() {
   
  osc = new p5.SinOsc();

  // Instantiate the envelope
  envelope = new p5.Env();

  // set attackTime, decayTime, sustainRatio, releaseTime
  envelope.setADSR(0.001, 0.5, 0.1, 0.5);

  // set attackLevel, releaseLevel
  envelope.setRange(1, 0);

  scaleArray = [60, 62, 64, 65, 67, 69, 71, 72];

  sounds = [];

  soundTargetPos = createVector();
  soundCurrentPos = createVector();
  soundHighlightPos = createVector();

}

function soundDraw() {

  // soundCurrentPos.copy( sounds[currentNote].pos );

  for (let sound of sounds ) {
    fill('pink')
    rect( sound.pos.x, sound.pos.y, 20 );
  }

  soundCurrentPos.lerp( soundTargetPos, 0.05 );

  fill( 'red' );
  rect( soundCurrentPos.x, soundCurrentPos.y, 20 );


  if (frameCount % 60 === 0 || frameCount === 1) {

    const currentNote = noteCounter;
    const nextNote = (currentNote + 1) % (sounds.length);

    updateSoundTargets( currentNote, nextNote );  

    playNotes( currentNote, nextNote );

    if (sounds.length > 1) {
      noteCounter = nextNote;
    }
    
  }

}

function updateSoundTargets( currentNote, nextNote ) {

  if ( sounds.length > 0) {
    
    soundCurrentPos.copy( sounds[ currentNote ].pos );

    if ( sounds.length < 2 ) {
      soundTargetPos.copy( soundCurrentPos );
    } else {
      soundTargetPos = sounds[ nextNote ].pos;
    }

  }

}

function playNotes( currentNote, nextNote ) {

  let midiValue = scaleArray[ currentNote ];
  let freqValue = midiToFreq( midiValue );
  osc.freq( freqValue );

  let amp = 0;
  if ( sounds.length > 0 ) {
    amp = constrain( norm(sounds[ currentNote ].pos.dist( localAgent.pos ), 1000, 0), 0.0001, 1);
  }

  envelope.setRange( amp, 0 );
  
  envelope.play(osc, 0, 0.1);

  console.log( {
    amp: amp,
    currentNote: currentNote,
    soundsLength: sounds.length
  } );

}

function toggleSound( toggle ) {

  if ( toggle ) {
    
    osc.start();

  } else {

    osc.stop();

  }

}

function dropSound( x, y ) {

    sounds.push({
        pos: createVector( x, y )
    })

    console.log( { sounds: sounds } );

}

function clearSounds() {

  sounds = [];
  currentNote = 0;

}