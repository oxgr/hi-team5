//cloud Animations
//var cloudAnimations;
var cloudNum;
var t;
//var direction;

/**
 * Called in main setup() once on load.
 */
class CloudsAgent{
  constructor(cloudNum){
this.cloudNum=cloudNum;
cloudAnimation.frameDelay=150;
for(let i=0;i<this.cloudNum;i++){

this.cloud=createSprite(random(width), random(height), 32, 32);
this.cloud.setCollider("rectangle", 0, 0, 350, 200)
//this.cloud.debug=true;
this.cloud.scale=0.2;
this.cloud.setSpeed(random(0.05,0.1));
this.cloud.addAnimation("moving", cloudAnimation);
//clouds.depth=-1;
clouds.add(this.cloud);
}


console.log(cloudNum);
  }
}
function cloudDraw(){
  t += 0.1;
  drawSprites(clouds);
  //direction+=2;
  for(var i = 0; i<clouds.length; i++) {
    var c = clouds[i];
    c.y += Math.sin(t)*10.;
    //moving all the ghosts y following a sin function (sinusoid)
      if(c.position.x > width+50)
       c.position.x = -150;
  }
  clouds.depth=1;
}
