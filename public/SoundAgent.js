class SoundAgent extends Agent {
    constructor(x, y, color) {

        super(x, y, color);
        this.state = false;
        this.radius = 100;


    }
    /** 
     * Pressed is a function to check how many times the SoundAgent were clicked
    */

        Pressed(){
            let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
        if (d < this.radius) {
            console.log("clicked on the recorder!");
            
            userStartAudio();
            
            // make sure user enabled the mic
            if (state === 0 && mic.enabled) {

                // record to our p5.SoundFile
                recorder.record(soundFile);
                
                localSoundAgent.color = '#ff0000';
                state++;
            }
            else if (state === 1) {
                localSoundAgent.color = '#ff00ff';
                // stop recorder and
                // send result to soundFile
                recorder.stop();


                state++;
            }

            else if (state === 2) {
                localSoundAgent.color = '#00ffff';
                soundFile.play(); // play the result!
                //save(soundFile, 'mySound.wav');
                state++;
            }else{
                localSoundAgent.color = '#00ff00';
                state=0;
            }
        
        
    }

}
    
    
    
    /**
  *  Draws the agent at the given <pos> position lerped (interpolated) to the <newPos> position. Filled with the color property.
  */
    show() {

        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.radius);
        fill('white');
        textAlign(CENTER, CENTER);
        if(state===0){
            text('Tap to record!', this.pos.x-25, this.pos.y,this.radius/2);
        }
        if(state===1){
            text('Recording! Tap to stop!', this.pos.x-25, this.pos.y,this.radius/2);

        }else if(state===2){
            text('Tap to play and Save', this.pos.x-25, this.pos.y,this.radius/2);
        }else if(state===3) {
            fill('black');
            text('Saving', this.pos.x-25, this.pos.y,this.radius/2);
        }
       
    }
}

