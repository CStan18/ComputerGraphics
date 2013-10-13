var canvas;
var gl;

var X_AXIS = 0;
var Y_AXIS = 1;
var Z_AXIS = 2;
var Axis = 0; // will change as the axis in question changes

var drawables = []; // used to store any objects that need to be drawn

/* Initialize global WebGL stuff - not object specific */
function initGL()
{
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if ( !gl ) {
        alert("WebGL isn't available");
    }

    //******** From now on, everything is part of the "gl" object ********
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 1.0, 1.0);
    // layers things correctly, instead of just stacking each object on top of the last
    gl.enable(gl.DEPTH_TEST);

    // from MV.js: creates a matrix according to an otrhographic projection
    //         boundaries   x      y      z
    projection = mat4.ortho(-3, 3, -1, 1, -100, 100); // changed to -3, 3 to match the canvas size change

    var a = document.getElementById("ButtonX");
    a.addEventListener("click", function(){Axis = X_AXIS;}, false);
    var b = document.getElementById("ButtonY");
    b.addEventListener("click", function(){Axis = Y_AXIS;}, false);
    var c = document.getElementById("ButtonZ");
    c.addEventListener("click", function(){Axis = Z_AXIS;}, false);

    var d = document.getElementById("gl-canvas");
    d.addEventListener("mousedown", function(){
                                        if(event.button==0)
                                            Axis = X_AXIS;
                                        else if(event.button==1)
                                            Axis = Y_AXIS;
                                        else
                                            Axis = Z_AXIS;
                                    }, false);
}

/* Global render callback - would draw multiple objects
   if there were more than one */
var renderScene = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for (i in drawables) {
	   drawables[i].draw();
    }
    requestAnimFrame(renderScene); // keeps looping every frame
}