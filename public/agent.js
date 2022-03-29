var circles;
let speed;
let frameSpeed;

    function sphereLight(collider,sp){
      let sHold;
    fill( 'rgba(100%,100%,100%,0.5)');
    if(collider.scale>sp.scale){
      sHold=collider.scale*30;
    }
    else{sHold=sp.scale*30;}
    ellipse( sp.position.x,sp.position.y,sHold+20);
    //collider.remove();
  }

class Agent {

  constructor( x, y, color, size, sColor) {
    //initial Variable setup from main
    this.color  = color;
    this.pos    = createVector( x, y );
    this.target = createVector( x, y );
    this.size   = size;
    this.sColor = sColor;
    this.choseColor();

console.log(size);
    //map functions
    //takes the size of the sphere and makes smaller spheres faster and bigger spheres slower
    this.speed =map(this.size, 20, 50, 5, 1);

    // uses the size of the sphere to set an animation speed for each sphere
    this.frameSpeed =map(this.size, 20,50,4,20);

    // Sprite creation
    //created a sprite with and x,y position and an x,y size position
    this.sphere = createSprite(this.pos.x+20,this.pos.y+20,this.size, this.size);
    
    // how big is this sphere going to look?
    this.sphere.scale=this.size/30;

    // how heavy is the sphere? Good for collisions
    this.sphere.mass=this.size/20;

    //set the animation speed (default is 4)
    sequenceAnimation.frameDelay=round(this.frameSpeed);

    //add the animation to the sphere
    this.sphere.addAnimation("fun", sequenceAnimation);

    // how fast the sphere allowed to travel
    this.sphere.maxSpeed = this.speed;

    //add the shpere to a group for collision purposes
    spheres.add(this.sphere);

  }
  choseColor(){
    console.log("Switcher Started");
        switch(this.sColor){
      case 0:
        sequenceAnimation=sphereBlue;
        break;
      case 1:
        sequenceAnimation=sphereBrown;
        break;
      case 2:
        sequenceAnimation=sphereGreen;
        break;
      case 3:
        sequenceAnimation=sphereOrange;
        break;
      case 4:
        sequenceAnimation=spherePink;
        break;
      case 5:
        sequenceAnimation=spherePurple;
        break;
      case 6:
        sequenceAnimation=sphereRed;
        break;
      case 7:
        sequenceAnimation=sphereYellow;
        break;
      case 8:
        if(random(0,10)>7){
        sequenceAnimation=sphereRainbow;
      }
      else{sequenceAnimation=sphereBlue;}
        break;
    }
    console.log("Switcher Stoped");
  }


  
  /**
  * Moves position one step towards the target. Right now, this is done by lerp()[https://p5js.org/reference/#/p5.Vector/lerp]
  */
  move( speed ) {
    
    this.pos.lerp( this.target, speed );
    
  }

  /**
  *  Draws the agent at the given <pos> position lerped (interpolated) to the <newPos> position. Filled with the color property.
  */
  show() {

    //creates am ellipse that will follow the sphere sprite's x,y position
    
    //fill( this.color );
    //ellipse( this.sphere.position.x, this.sphere.position.y,this.size);

    //the type of collision we ant to use
    this.sphere.overlap(spheres,sphereLight);

    //make the sphere move towards a specific point
    this.sphere.attractionPoint(this.speed/25, this.pos.x, this.pos.y);
  }



  /**
  * Updates the position of an agent in the world. Tracks down the spcific agent by matching the color code, then updates the new xy values to the newPos vector.

  * @param Object data* @param Object data A packet of data received from the server. Contains a color to id the agent and x, y properties.
  */
  updateTarget( data ) {
   
    this.target.x = data.x;
    this.target.y = data.y;
    
  }

  /**
  * Creates a separate data object to send to server with just the minimum amount of information. Used to send local objects like thisAgent.

  */
  getData() {

    const data = {

      color : this.color,
      x     : this.target.x,
      y     : this.target.y,
      size  : this.size,
      sColor: this.sColor
    }

    return data;

  }
}
