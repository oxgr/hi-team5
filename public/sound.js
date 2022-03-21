
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

  osc.start();

  sounds = [];

}

function soundDraw() {

  if (frameCount % 60 === 0 || frameCount === 1) {
    let midiValue = scaleArray[note];
    let freqValue = midiToFreq(midiValue);
    osc.freq(freqValue);

    envelope.play(osc, 0, 0.1);
    note = (note + 1) % scaleArray.length;
  }

  for (let sound of sounds ) {
      fill( 'pink' );
      rect( sound.pos.x, sound.pos.y, 20 );
  }

}

function dropSound( x, y ) {

    sounds.push({
        pos: createVector( x, y )
    })

}