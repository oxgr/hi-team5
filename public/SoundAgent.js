class SoundAgent extends Agent {
    constructor(x, y, color) {

        super(x, y, color);
        this.state = 0;
        this.radius = 100;


    }
    /** 
     * Pressed is a function to check how many times the SoundAgent were clicked
    */

    pressed() {

            console.log("clicked on the recorder!");

            userStartAudio();

            // make sure user enabled the mic
            if (this.state === 0 && mic.enabled) {

                // record to our p5.SoundFile
                recorder.record(soundFile);

                localSoundAgent.color = '#ff0000';
                this.state++;

            } else if (this.state === 1) {

                localSoundAgent.color = '#ff00ff';
                // stop recorder and
                // send result to soundFile
                recorder.stop();

                this.state++;
                // soundFile.play();

            } else if (this.state === 2) {

                localSoundAgent.color = '#00ffff';
                soundFile.play(); // play the result!
                //save(soundFile, 'mySound.wav');
                this.state++;

            } else {

                localSoundAgent.color = '#00ff00';
                this.state = 0;
            }


    }

    checkIfClicked() {

        let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
        return (d < this.radius);

    }



    /**
  *  Draws the agent at the given <pos> position lerped (interpolated) to the <newPos> position. Filled with the color property.
  */
    show() {

        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.radius);
        fill('white');
        textAlign(CENTER, CENTER);
        if (this.state === 0) {
            text('Tap to record!', this.pos.x - 25, this.pos.y, this.radius / 2);
        }
        if (this.state === 1) {
            text('Recording! Tap to stop!', this.pos.x - 25, this.pos.y, this.radius / 2);

        } else if (this.state === 2) {
            text('Tap to play and Save', this.pos.x - 25, this.pos.y, this.radius / 2);
        } else if (this.state === 3) {
            fill('black');
            text('Saving', this.pos.x - 25, this.pos.y, this.radius / 2);
        }

    }
}

