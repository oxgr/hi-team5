let r;
class Agent {

  constructor( x, y, color, r ) {
    this.color  = color;
    this.pos    = createVector( x, y );
    this.target = createVector( x, y );
    this.r      = round(random(1,5));
    this.sphere = createSprite(0, 0, 32, 32);
    sequenceAnimation = loadAnimation("http://localhost:3000/BallSprite/001.png", "http://localhost:3000/BallSprite/008.png");
    sequenceAnimation.frameDelay=20;
    this.sphere.addAnimation("fun", sequenceAnimation);
    this.sphere.maxSpeed = this.r;
    console.log(round(this.r));
    
    
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

    fill( this.color );
    ellipse( this.sphere.position.x, this.sphere.position.y, 40 );
    this.sphere.attractionPoint(this.r/25, this.pos.x, this.pos.y);
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

      color: this.color,
      x    : this.target.x,
      y    : this.target.y
    }

    return data;

  }
}