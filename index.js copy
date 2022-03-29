window.addEventListener("load", function () {
  
  const canvas = this.document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");

 
  function setSize() {
    window.onresize = arguments.callee;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  setSize();

  
  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  const colors = [
    "#33B5E5",
    "#0099CC",
    "#AA66CC",
    "#9933CC",
    "#99CC00",
    "#669900",
    "#FFBB33",
    "#FF8800",
    "#FF4444",
    "#CC0000",
  ];
  
  

  
  

  
  function Ball() {
    this.x = getRandom(0, canvas.width);
    this.y = getRandom(5, canvas.height);
    this.r = getRandom(2, 15);
    this.ballColor = colors[Math.floor(Math.random() * colors.length)];
    this.vx = getRandom(10, 15);
    this.vy = getRandom(10, 30);
  }
  
  Ball.prototype.ballMove = function () {
    ctx.beginPath();
    ctx.fillStyle = this.ballColor;
    ctx.arc(this.x, this.y, this.r, 2 * Math.PI, false);
    ctx.fill();
    this.x += this.vx;
    this.y += this.vy;
    if (this.x - this.r < 0 || this.x + this.r > canvas.width) {
      this.vx *= -1;
    } else if (this.y - this.r < 0 || this.y + this.r > canvas.height) {
      this.vy *= -1;
    }
  };

  
  const arr = new Array();

  
  function ballNum(num) {
    for (var i = 0; i < num; i++) {
      arr.push(new Ball());
    }
  }
  ballNum(200);

  
  this.setInterval(function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var item of arr) {
      item.ballMove();
    }
  }, 1000 / 60);
});
