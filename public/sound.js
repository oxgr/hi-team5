let startTime;
let soundEnabled;

let osc, envelope, filter;
let scaleArray;
let noteCounter;

let sounds, soundSize;

let notePeriodInMs;
let cursorSpeed;

let collideSound;

let mic,recorder,soundFile;

/**
 * Called in main setup() once on load.
 */
function soundSetup() {

  // Global sound toggle state.
  soundEnabled = false;

  startTimer();

  //

  mic = new p5.AudioIn();

  // prompts user to enable their browser mic
  mic.start();

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);

  // this sound file will be used to
  // playback & save the recording
  soundFile = new p5.SoundFile();
  soundFile.disconnect();

  //

  filter = new p5.LowPass();

  soundFormats('mp3', 'ogg');
  collideSound = loadSound('assets/CollideSound.mp3');
  collideSound.disconnect();
   
  osc = new p5.SinOsc();

  // Disconnect oscillator output, so we only hear the filter output.
  osc.disconnect();
  osc.connect( filter );

  //

  reverb = new p5.Reverb();
  filter.disconnect();
  reverb.process( filter, 1, 1);
  reverb.process( collideSound, 3, 1);
  reverb.process( soundFile, 3, 2);

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


ringSprite = createSprite(soundCursorPos.x, soundCursorPos.y, soundSize, soundSize);
rings.add(ringSprite);
}

/**
 * Called in draw() loop 60 fps.
 */
 function ringBounced(ring,otherObject){
  ring.maxSpeed=30;
 }

function soundDraw() {

  // Run this every after the timer goes past the note period
  if ( getElapsedTime() > notePeriodInMs ) {

    startTimer();

    const { currentNote, nextNote } = getNewNotes( noteCounter, sounds );

    updateSoundTargets( currentNote, nextNote ); 

    // update the interactive note period and cursor speed based on distance between cursor and next note.
    if ( sounds.length > 1 ) {
      const dist = sounds[ nextNote ].pos.dist( soundCursorPos );
      notePeriodInMs = Math.floor( map( dist, 0, 1000, 0, 6000 ) );
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
  //soundCursorPos get controller by the ringSprite so I commented this out

  //soundCursorPos.lerp( soundTargetPos, cursorSpeed );

  // Draw cursor with just a red stroke.
  noFill();
  stroke( 'red' );
  strokeWeight( 2 );
  ellipse( soundCursorPos.x, soundCursorPos.y, soundSize );
  
  //draw the ringSprite
  drawSprites(rings);


  //ringSprite properties

  // make the ringSprite follow the soundTargetPos implementation:(attraction force(bigger number means sprite is more attracted to the point specified), x, y)
  ringSprite.attractionPoint(1,soundTargetPos.x,soundTargetPos.y);

  // makes the ring follow the ringSprite
  ringSprite.position=soundCursorPos;

  if(ringSprite.bounce(sprites)){
    collideSound.play();
    console.log("bounced!")
  }


  // type of collision used. Callback function goes in here as well implementation sprite.collisiontype(sprite to collide with, callback function)
  // both of the objects that are supposed to collide must be sprites
  ringSprite.bounce(sprites);

  // defines how heavy the ring is. Lower value means it get bounced around easier
  ringSprite.mass=0.05;

  //make the ringSprite invisible so you don't see it
  ringSprite.visible=false;

/*
* end of ringSprite Properties
*/

//if the ring controlled by ringSprtite is withing 10 pixels of soundTargetPos then stop the ring from moving and telaport it to the soundTargetPos
let distanceFromPoint=dist(soundCursorPos.x,soundCursorPos.y,soundTargetPos.x,soundTargetPos.y);  

  if(distanceFromPoint>10)
  
  //this determines how fast the ring sprite is allowed to travel
 //when the ringSprite is more than 10 of soundTargetPos
  {ringSprite.maxSpeed=distanceFromPoint/30;}

  //when the ringSprite is within 10px of soundTargetPos
  else{
ringSprite.maxSpeed=0;
//makes the ringSprite snap to the soundTargetPos
soundCursorPos.y=soundTargetPos.y;
soundCursorPos.x=soundTargetPos.x;
  }
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

  if ( sounds[ currentNote ].soundFile && sounds[ currentNote ].soundFile.buffer != null )
    sounds[ currentNote ].soundFile.play();

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
    outputVolume( 1, 1 );

  } else {

    osc.stop();
    outputVolume( 0, 1 );

  }

}

function createSound( pos ) {

  if ( soundFile.buffer != null ) {

    const newSound = {
  
      pos: {
        x: pos.x,
        y: pos.y
      },
      buffer: soundFile.buffer.getChannelData(0),
      note: random( 50, 80 )

    }

    console.log( '[SOUND]: New sound created.' );

    return newSound;

  } else {

    console.log( '[SOUND]: Tried to create new sound, but no buffer found in soundFile.' );

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
 * @param {object} sound 
 */
function dropSound( sound ) {

  if ( sound.buffer != null ) {

    const newSoundFile = new p5.SoundFile();
    newSoundFile.setBuffer( [sound.buffer] );
    newSoundFile.disconnect();
    reverb.process( newSoundFile, 1, 1 );
    const newSound = {
      pos: createVector( sound.pos.x, sound.pos.y ),
      soundFile:  newSoundFile,
      note: sound.note
    }

    sounds.push( newSound );

    console.log( '[SOUND]: New sound dropped at [%i, %i]', newSound.pos.x, newSound.pos.y, newSound );

  }


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