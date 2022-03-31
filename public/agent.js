let spriteSize;
var circles;
let speed;
let frameSpeed;
let colorPicker;

function spriteCollided(collider, sp) {
  let sHold;
  fill('rgba(100%,100%,100%,0.5)');
  if (collider.scale > sp.scale) {
    sHold = collider.scale * 30;
  }
  else { sHold = sp.scale * 30; }
  ellipse(sp.position.x, sp.position.y, sHold + 20);
  //collider.remove();
}

class Agent {

  constructor(x, y, color) {

    //initial Variable setup from main
    this.color = color;
    this.pos = createVector(x, y);
    this.target = createVector(x, y);
    this.radius = 50;


    //set the spriteSize of the sprite
    this.spriteSize = random(20, 50);
    this.colorPicker = round(random(0, 8));


    //map functions
    //takes the spriteSize of the sphere and makes smaller spheres faster and bigger spheres slower
    //this.speed = map(this.spriteSize, 20, 50, 3, 1);
    this.speed=3;

    // uses the spriteSize of the sphere to set an animation speed for each sphere
    this.frameSpeed = map(this.spriteSize, 20, 50, 4, 20);

    // Sprite creation
    //created a sprite with and (x, y) position and a (width, height) spriteSize position
    this.sprite = createSprite(this.pos.x+10, this.pos.y+10, this.spriteSize, this.spriteSize);

    // how big is this sphere going to be?
    this.sprite.scale = this.spriteSize / 30;

    // how heavy is the sprite higher means it doesn't get bounced hard
    this.sprite.mass = this.spriteSize / 20;

    //set the animation speed of the sprite (default is 4)
    spinningAnimation.frameDelay = round(this.frameSpeed);

    //add the animation to the sprite
    this.sprite.addAnimation("fun", spinningAnimation);

    // how fast the sphere allowed to travel
    this.sprite.maxSpeed = this.speed;

    //add the sprite to a group for use with collision this is an array or sprites
    sprites.add(this.sprite);

  }
  
  /**
  * Moves position one step towards the target. Right now, this is done by lerp()[https://p5js.org/reference/#/p5.Vector/lerp]
  */
  move(speed) {

    this.pos.lerp(this.target, speed);

  }

  /**
  *  Draws the agent at the given <pos> position lerped (interpolated) to the <newPos> position. Filled with the color property.
  */
  show() {
cloudDraw();
  
    fill(this.color);
    
    //creates an ellipse that will follow the sphere sprite's x,y position 
     
    ellipse( this.sprite.position.x, this.sprite.position.y,this.spriteSize);
    drawSprites(sprites);
    sprites.depth=2;
    //the type of collision we want to use with the callback function
    this.sprite.collide(sprites,spriteCollided);

    //make the sphere move towards a specific point with as cetrain attraction to that point
    this.sprite.attractionPoint(this.speed / 20, this.pos.x, this.pos.y);
  }

  /**
   * 
   * @param {*} data 
   */
  checkSpace(vec, radius) {
    if (this.pos.dist(vec) < radius) {
      return 0.01;
    } else {
      return 0.1;
    }
  }

  /**
  * Updates the position of an agent in the world. Tracks down the spcific agent by matching the color code, then updates the new xy values to the newPos vector.

  * @param Object data* @param Object data A packet of data received from the server. Contains a color to id the agent and x, y properties.
  */
  updateTarget(data) {

    this.target.x = data.x;
    this.target.y = data.y;

  }

  /**
  * Creates a separate data object to send to server with just the minimum amount of information. Used to send local objects like thisAgent.

  */
  getData() {

    const data = {

      color: this.color,
      x: this.target.x,
      y: this.target.y
    }

    return data;

  }
}