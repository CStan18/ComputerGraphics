// John Paul Welsh
// September 11, 2013
// Graphics Homework #1
// Koch Snowflake

var gl;
var canvas;
var NumTimesToSubdivide = 5;
var points = [];

//----------------------------------------------------------------------------

function triangle(a, b) {
    points.push(a, b);
}

//----------------------------------------------------------------------------

function divide_segment(a, b, count) {
	if (count > 0) {
        
        var diff = subtract(b, a);
        //var diff = b - a;
        
        var v0a = scale((1/3), diff);
        var v0 = add(a, v0a);
        //var v0 = a + diff / 3;
        
        var v1a = scale(2, diff);
        var v1b = scale((1/3), v1a);
        var v1 = add(a, v1b);
        //var v1 = a + 2 * diff / 3;
        
        var v2a = add(a, b);
        var v2 = scale(0.5, v2a);
        //var v2 = ( a + b ) / 2.0;

        var ra = subtract(b, a);
        var r = length(ra); // r isn't a vector, it's a number
        //var r = length(b - a);
        
        var h = Math.sqrt(3.0) * r / 2.0;

        // This needs to be of type vec2, with the crazy math as parameters
        var v3 = vec2(v2[0] - (h * (v1[1] - v0[1]) / r),
                  v2[1] + (h * (v1[0] - v0[0]) / r));

        divide_segment( a, v0, count - 1);
        divide_segment(v0, v3, count - 1);
        divide_segment(v3, v1, count - 1);
        divide_segment(v1,  b, count - 1);
    }
    else {
        triangle(a, b); // draw triangle at end of recursion
    }
}

//----------------------------------------------------------------------------

window.onload = function init() {
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	
	if (!gl) {
		alert("WebGL isn't available.");
	}

	// Set up original triangle
    //
    var vertices = [
        vec2(-0.5, -0.5),
        vec2( 0.0,  0.5),
        vec2( 0.5, -0.5)
    ];

    // Subdivide the original triangle
    //
    divide_segment(vertices[0], vertices[1], NumTimesToSubdivide);
    divide_segment(vertices[1], vertices[2], NumTimesToSubdivide);
    divide_segment(vertices[2], vertices[0], NumTimesToSubdivide);

    // Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    // Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    // Load the data into the GPU
    //
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    //
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    display();
}

//----------------------------------------------------------------------------

// Display the snowflake
//
function display() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, points.length);
}