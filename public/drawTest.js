

let synth;

let line;

let p1, p2;

let lineArr;

let cnv;

function setup() {

    cnv = createCanvas( windowWidth, windowHeight );

    background( 'azure' )

    // synth = new p5.MonoSynth();

    osc = new p5.Oscillator();

    p1 = createVector();
    p2 = createVector();

    lineArr = [];

    strokeWeight( 2 );
    stroke( 'pink' );

}

function draw() {


    
}

function mousePressed() {

    p1.set( mouseX, mouseY );
    lineArr.push({ x: mouseX, y: mouseY });

}

function mouseDragged() {

    p2.set( mouseX, mouseY );
    cnv.line( p1.x, p1.y, p2.x, p2.y );
    p1.set( mouseX, mouseY );
    lineArr.push({ x: mouseX, y: mouseY });

}

function mouseReleased() {



}

function keyPressed() {

    switch( keyCode ) {

        case 32:
            playDrawing();
            break;

        case BACKSPACE:
            lineArr = [];
            background( 'azure' );
            break;

    }

}

function playDrawing() {



}