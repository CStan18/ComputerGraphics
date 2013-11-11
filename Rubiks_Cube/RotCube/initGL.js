/*
    Authors:
    Katie Craven
    John Paul Welsh
*/

/* initGL.js - Essential setup for our WebGL application */

var canvas; // global to hold reference to an HTML5 canvas
var gl;     // global to hold reference to our WebGL context

// a few simple constants
const X_AXIS = 0;
const Y_AXIS = 1;
const Z_AXIS = 2;

var drawables = [];   // used to store any objects that need to be drawn

var orbiting = false;       // determines whether we are in the middle of a turn
var side = "";              // this determines which side of the cube is turning
var count = 0;              // keeps track of how many single angles (absolute value) we have gone through so far

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
    projection = perspective(50, 1.3, 0.1, 100); //ortho(-5, 5, -3.5, 3.5, -100, 100);
    projection = mult(projection, lookAt(vec3(5, 5, 5), vec3(-5, -5, -5), vec3(10, 35, -10)));

/*
    // set up an event handler for the Begin Instructions button
    var begin = document.getElementById("Btn_Begin");
    begin.addEventListener("click",
        function() {
            if (orbiting == false) {
                orbiting = true;
                count = 0;
                currtimes = 0;
                countListInstructions = 0;
                rbk.copyInit();
            }
        },
        false);
*/

    // set up an event handler for the top button
    var t = document.getElementById("Btn_T");
    t.addEventListener("click",
        function() {
            if (orbiting == false) {
                orbiting = true;
                side = "top";
                rbk.copyInit();
            }
        },
        false);

    // set up an event handler for the bottom button
    var b = document.getElementById("Btn_B");
    b.addEventListener("click",
        function() {
            if (orbiting == false) {
                orbiting = true;
                side = "bottom";
                rbk.copyInit();
            }
        },
        false);

    // set up an event handler for the left button
    var l = document.getElementById("Btn_L");
    l.addEventListener("click",
        function() {
            if (orbiting == false) {
                orbiting = true;
                side = "left";
                rbk.copyInit();
            }
        },
        false);

    // set up an event handler for the right button
    var r = document.getElementById("Btn_R");
    r.addEventListener("click",
        function() {
            if (orbiting == false) {
                orbiting = true;
                side = "right";
                rbk.copyInit();
            }
        },
        false);

    // set up an event handler for the front button
    var f = document.getElementById("Btn_F");
    f.addEventListener("click",
        function() {
            if (orbiting == false) {
                orbiting = true;
                side = "front";
                rbk.copyInit();
            }
        },
        false);

    // set up an event handler for the back button
    var k = document.getElementById("Btn_K");
    k.addEventListener("click",
        function() {
            if (orbiting == false) {
                orbiting = true;
                side = "back";
                rbk.copyInit();              
            }
        },
        false);

    // set up event handler for the orthographic view button
    var or = document.getElementById("Btn_ORTHO");
    or.addEventListener("click",
        function() {
            projection = ortho(-5, 5, -3.5, 3.5, -100, 100);
        },
        false
    );

    // set up event handler for the perspective view button
    var pr = document.getElementById("Btn_PERSP");
    pr.addEventListener("click",
        function() {
            projection = perspective(45, 1.3, 0.1, 100);
            projection = mult(projection, lookAt(vec3(5, 5, 5), vec3(-5, -5, -5), vec3(0, 30, 0)));
        },
        false
    );

    // set up event handler for the perspective view (behind) button
    var prbh = document.getElementById("Btn_PERSPBEHIND");
    prbh.addEventListener("click",
        function() {
            projection = perspective(45, 1.3, 0.1, 100);
            projection = mult(projection, lookAt(vec3(-5, -5, -5), vec3(5, 5, 5), vec3(0, 30, 0)));
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