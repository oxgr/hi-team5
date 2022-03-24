let startTime;
let soundEnabled;

let osc, envelope, filter;
let scaleArray;
let noteCounter;

let sounds, soundSize;

let notePeriodInMs;
let cursorSpeed;

/**
 * Called in main setup() once on load.
 */
function soundSetup() {

  // Global sound toggle state.
  soundEnabled = false;

  startTimer();

  filter = new p5.LowPass();
   
  osc = new p5.SinOsc();

  // Disconnect oscillator output, so we only hear the filter output.
  osc.disconnect();
  osc.connect( filter );

  // Instantiate the envelope
  envelope = new p5.Env();

  // set attackTime, decayTime, sustainRatio, releaseTime
  envelope.setADSR(0.001, 0.5, 0.1, 0.5);

  // set attackLevel, releaseLevel
  envelope.setRange(1, 0);

  // array of MIDI notes in C Major scale
  scaleArray = [60, 62, 64, 65, 67, 69, 71, 72];

  // global counter
  noteCounter = 0;

  // array of placed sounds
  sounds = [];

  // vectors for drawing moving cursor
  soundTargetPos = createVector();
  soundCursorPos = createVector();

  // Size of placed sound.
  soundSize = 30;

  // the distance between the cursor and the nextnote, converted to milliseconds and speed of cursor movement.
  notePeriodInMs = 1000;
  cursorSpeed = 0.05;

}

/**
 * Called in draw() loop 60 fps.
 */
function soundDraw() {

  // Run this every after the timer goes past the note period
  if ( getElapsedTime() > notePeriodInMs ) {

    startTimer();

    const { currentNote, nextNote } = getNewNotes( noteCounter, sounds );

    updateSoundTargets( currentNote, nextNote ); 

    // update the interactive note period and cursor speed based on distance between cursor and next note.
    if ( sounds.length > 1 ) {
      const dist = sounds[ nextNote ].pos.dist( soundCursorPos );
      notePeriodInMs = Math.floor( map( dist, 0, 1000, 0, 4000 ) );
      cursorSpeed = map( dist, 0, 1000, 0.1, 0.02);
    } else {
      notePeriodInMs = 1000;
      cursorSpeed = 0.05;
    }

    if ( sounds.length > 0 ) {
      playNote( currentNote );
    }

    // Only cycle through notes if there's more than one placed.
    if (sounds.length > 1) {
      noteCounter = nextNote;
    }
    
  }

  // Move from red to green across the array of sounds
  let redVal = 250;
  let greenVal = 180;

  // for every sound object in the sounds array...
  for (let sound of sounds ) {

    // Remove the stroke
    noStroke();

    // Fill with dynamic red & green values
    fill( redVal, greenVal, 180 );

    // Draw an ellipse at the sound's position.
    ellipse( sound.pos.x, sound.pos.y, soundSize );

    // Update red/green values.
    redVal -= 10;
    greenVal += 10;
  }

  // Move cursor slightly towards next note.
  soundCursorPos.lerp( soundTargetPos, cursorSpeed );

  // Draw cursor with just a red stroke.
  noFill();
  stroke( 'red' );
  strokeWeight( 2 );
  ellipse( soundCursorPos.x, soundCursorPos.y, soundSize );

}

/**
 * Updates the global positions of the soundCursor and soundTarget (the next note).
 * Also makes some checks to ensure that if a sound is removed mid-way, the note will shift to a neighbour instead.
 * 
 * @param {number} currentNote 
 * @param {number} nextNote 
 */
function updateSoundTargets( currentNote, nextNote ) {

  if ( sounds.length > 0) {
    
    soundCursorPos.copy( sounds[ currentNote ].pos );

    if ( sounds.length < 2 ) {
      soundTargetPos.copy( soundCursorPos );
    } else {
      soundTargetPos = sounds[ nextNote ].pos;
    }

  }

}

/**
 * Does exactly what it says lol.
 * 
 * @param {number} currentNote 
 * @param {number} nextNote 
 */
function playNote( currentNote ) {

  // Pick a MIDI value from array of notes in scale
  // let midiValue = scaleArray[ currentNote ];
  let midiValue = sounds[ currentNote ].note;

  // Get the frequency of that note
  let freqValue = midiToFreq( midiValue );

  // Set the frequency to the oscillator
  osc.freq( freqValue );

  // Map mouseX to a the cutoff frequency from the lowest
  // frequency (10Hz) to the highest (22050Hz) that humans can hear
  if ( soundCursorPos.dist( slowCirclePos ) < slowCircleRadius ) {
    filterFreq = 100;
  } else {
    filterFreq = 20000;
  }

  // Map mouseY to resonance (volume boost) at the cutoff frequency
  filterRes = 5;

  // Set filter parameters
  filter.set(filterFreq, filterRes);
  
  // Adjust amplitude of envelope based on distance of sound to the mousePos.
  let amp = 0;
  if ( sounds.length > 0 ) {
    amp = constrain( norm(sounds[ currentNote ].pos.dist( localAgent.pos ), 1000, 0), 0.0001, 1);
  }

  envelope.setRange( amp, 0 );
  
  // Play the note
  envelope.play(osc, 0, 0.1);

  // console.log( {
  //   amp: amp,
  //   currentNote: currentNote,
  //   soundsLength: sounds.length,
  //   filterFreq: filterFreq
  // } );

}

/**
 * Toggles the oscillator to start and stop.
 * 
 * @param {boolean} toggle 
 */
function toggleSound( toggle ) {

  if ( toggle ) {
    
    osc.start();

  } else {

    osc.stop();

  }

}

/**
 * Gets the sound from sound array that was clicked, if any.
 * 
 * @param {p5.Vector} mousePos 
 * @returns The sound object from the sound array if it was clicked; undefined if nothing was clicked.
 */
function getSoundClicked( mousePos ) {

  for ( let sound of sounds ) {
    if ( mousePos.dist( sound.pos ) < soundSize )
      return sound;
  }

  return undefined;

}

/**
 * Adds a new sound into the sounds array at the position given.
 * @param {p5.Vector} pos 
 */
function dropSound( pos ) {

    sounds.push({
        pos: createVector( pos.x, pos.y ),
        note: random( 50, 80 )
    })
}

/**
 * Removes a sound from the sound array. Needs to be passed a reference to an object inside the sounds array.
 * @param {object} sound 
 */
function removeSound( sound ) {

  const index = sounds.indexOf( sound );

  if ( index > -1 )
    sounds.splice( index, 1 );

}

/**
 * Clear all sounds and reset global values.
 */
function clearSounds() {

  sounds = [];
  noteCounter = 0;
  notePeriodInMs = 1000;

}

/**
 * Returns notes based on current count.
 * @param {number} count 
 * @param {array} sounds 
 * @returns An object with the currentNote and newNote as properties.
 */
function getNewNotes( count, sounds ) {

  const nextNote = ( count + 1 ) % sounds.length;

  return {
    currentNote: sounds[ count ] ? count : count - 1,
    nextNote   : sounds[ nextNote ] ? nextNote : nextNote + 1
  }

}

/************** Helper functions for using timers ***************/

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