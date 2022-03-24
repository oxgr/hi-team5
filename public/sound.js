let startTime;
let soundEnabled = false;

let osc, envelope, filter;
let scaleArray;
let noteCounter = 0;

let sounds, soundSize;

let distToNextNoteInMs;
let distToNextNoteInSpeed;

function soundSetup() {

  startTimer();

  filter = new p5.LowPass();
   
  osc = new p5.SinOsc();

  osc.disconnect();
  osc.connect( filter );

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

  soundSize = 30;

  distToNextNoteInMs = 1000;
  distToNextNoteInSpeed = 0.05;

}

function soundDraw() {

  // soundCurrentPos.copy( sounds[currentNote].pos );

  if ( getElapsedTime() > distToNextNoteInMs || frameCount === 1 ) {

    startTimer();

    const { currentNote, nextNote } = getNewNotes( noteCounter, sounds );

    updateSoundTargets( currentNote, nextNote ); 

    if ( sounds.length > 1 ) {
      const dist = sounds[ nextNote ].pos.dist( soundCurrentPos );
      distToNextNoteInMs = Math.floor( map( dist, 0, 1000, 0, 4000 ) );
      distToNextNoteInSpeed = map( dist, 0, 1000, 0.1, 0.02);
    } else {
      distToNextNoteInMs = 1000;
      distToNextNoteInSpeed = 0.05;
    }

    playNotes( currentNote, nextNote );

    if (sounds.length > 1) {
      noteCounter = nextNote;
    }

    
    
  }

  let redVal = 250;
  let greenVal = 180;

  for (let sound of sounds ) {
    noStroke();
    fill( redVal, greenVal, 180 );
    ellipse( sound.pos.x, sound.pos.y, soundSize );

    redVal -= 10;
    greenVal += 10;
  }

  soundCurrentPos.lerp( soundTargetPos, distToNextNoteInSpeed );

  noFill();
  stroke( 'red' );
  strokeWeight( 2 );
  ellipse( soundCurrentPos.x, soundCurrentPos.y, soundSize );

}

function updateSoundTargets( currentNote, nextNote ) {

  if ( sounds.length > 0) {
    
    soundCurrentPos.copy( sounds[ currentNote ].pos );

    if ( sounds.length < 2 ) {
      soundTargetPos.copy( soundCurrentPos );
    } else {
      soundTargetPos = sounds[ nextNote ].pos;
      distToNextNoteInMs = 1000;    }

  }

}

function playNotes( currentNote, nextNote ) {

  // Pick a MIDI value from array of notes in scale
  let midiValue = scaleArray[ currentNote ];

  // Get the frequency of that note
  let freqValue = midiToFreq( midiValue );

  // Set the frequency to the oscillator
  osc.freq( freqValue );

  // Map mouseX to a the cutoff frequency from the lowest
  // frequency (10Hz) to the highest (22050Hz) that humans can hear
  if ( soundCurrentPos.dist( slowCirclePos ) < slowCircleRadius ) {
    filterFreq = 100;
  } else {
    filterFreq = 20000;
  }

  // Map mouseY to resonance (volume boost) at the cutoff frequency
  filterRes = 5;

  // set filter parameters
  filter.set(filterFreq, filterRes);
  
  let amp = 0;
  if ( sounds.length > 0 ) {
    amp = constrain( norm(sounds[ currentNote ].pos.dist( localAgent.pos ), 1000, 0), 0.0001, 1);
  }

  envelope.setRange( amp, 0 );
  
  envelope.play(osc, 0, 0.1);

  // console.log( {
  //   amp: amp,
  //   currentNote: currentNote,
  //   soundsLength: sounds.length,
  //   filterFreq: filterFreq
  // } );

}

function toggleSound( toggle ) {

  if ( toggle ) {
    
    osc.start();

  } else {

    osc.stop();

  }

}

function getSourceClicked( mousePos ) {

  for ( let sound of sounds ) {
    console.log( 'mousepos from sounds = ', mousePos.dist( sound.pos ))
    if ( mousePos.dist( sound.pos ) < soundSize )
      return sound;
  }

  return undefined;

}

function dropSound( pos ) {

    sounds.push({
        pos: createVector( pos.x, pos.y )
    })

    console.log( { sounds: sounds } );

}

function removeSound( sound ) {

  const index = sounds.indexOf( sound );

  // if ( index == currentNote ) {
  //   currentNote--;
  // } else if ( index == nextNote ) {
  //   nextNote++;
  // }

  sounds.splice( index, 1 );

}

function clearSounds() {

  sounds = [];
  noteCounter = 0;
  distToNextNoteInMs = 1000;
}

function getNewNotes( count, sounds ) {

  const nextNote = ( count + 1 ) % sounds.length;

  return {
    currentNote: sounds[ count ] ? count : count - 1,
    nextNote   : sounds[ nextNote ] ? nextNote : nextNote + 1
  }

}

function startTimer() {
  startTime = Date.now();
  oldTime = Date.now();
}

function getElapsedTime() {
  return Date.now() - startTime;
}

function getDelta() {
  const delta = Date.now() - oldTime;
  oldTime = Date.now();
  return delta;
}