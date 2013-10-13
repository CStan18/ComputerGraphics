/*
    initGL.js - Essential setup for our WebGL application
*/

var canvas; // global to hold reference to an HTML5 canvas
var gl; // global to hold reference to our WebGL context

// a few simple constants
const X_AXIS = 0;
const Y_AXIS = 1;
const Z_AXIS = 2;

var drawables = []; // used to store any objects that need to be drawn

var turning = false; // determines whether we are in the middle of a turn
var leftturn = false; // this and determines which direction it is turning (if it's false, it's assumed to be turning right)
var count = 0; // keeps track of how many single angles (absolute value) we have gone through on the way to either 90 or -90

/* Initialize global WebGL stuff - not object specific */
function initGL() {
    // look up our canvas element
    canvas = document.getElementById( "gl-canvas" );

    // obtain a WebGL context bound to our canvas
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height ); // use the whole canvas
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 ); // background color
    gl.enable(gl.DEPTH_TEST); // required for 3D hidden-surface elimination

    // set the projection matrix
    // note: added rotation just to better see the shapes of our cubes
    projection = ortho(-2, 2, -1.5, 1.5, -100, 100);
    //projection = mult(projection, rotate(30, [0.5, 1, 0.12]));
    projection = mult(projection, lookAt(vec3(1.1, 1.5, 1.7), vec3(2.1, 2.5, 2.7), vec3(0.1, 0.5, 0.7)));

    // set up an event handler for the top-left button
    var a = document.getElementById("Btn_TL");
    a.addEventListener("click",
        function() {
            /* DONE - This button should start a -90deg
                rotation (to the left) of the top cube. */
            if (turning == false) {
                turning = true;
                leftturn = true;
            }
        },
        false
    );

    // set up an event handler for the top-right button
    var b = document.getElementById("Btn_TR");
    b.addEventListener("click",
        function() {
            /* DONE - This button should start 90deg
                rotation (to the right) of the top cube. */
            if (turning == false) {
                turning = true;
                leftturn = false;
            }
        },
        false
    );
}

/* Global render callback - would draw multiple objects if there were more than one */
var renderScene = function() {
    // start from a clean frame buffer for this frame
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // loop over all objects and draw each
    var i;
    for (i in drawables) {
        drawables[i].draw();
    }

    // queue up this same callback for the next frame
    requestAnimFrame(renderScene);
}