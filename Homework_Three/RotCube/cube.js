/*
    cube.js - Drawable WebGL cube object definition

    IMPORTANT NOTE:
    This scripts assumes that the initGL.js script has already been loaded,
    and that consequently a variety of global variables are already defined,
    such as: gl, drawables, X_AXIS, Y_AXIS, Z_AXIS
*/

/*
    Global variables for the three cubes, so we can access them from initGL.js
        and call the 'turn' function inside the event handlers.
 */
var ctop;
var cmid;
var cbot;

/*
    These are preset color combinations for each cube. These are activated in window.onload
        as the second parameter for the cube constructor. This way, we choose the colors for
        each individual cube by simply picking new combinations of colors, represented by
        array elements in the vcolor variable.
 */
var topfacecolor = [7, 1, 2, 3, 4, 5];
var midfacecolor = [5, 2, 4, 6, 1, 3];
var botfacecolor = [2, 3, 5, 4, 7, 1];

/*
    Constructor for ColorCube objects
    DONE add additional parameter(s) so we can specify colors for each face
        and we probably should pass these through to init()
 */
var Cube = function (program, facecolor) {
    this.init(program, facecolor);
}

/* Initialize properties of this color cube object. */
Cube.prototype.init = function(program, fc) {
    this.points = []; // this array will hold raw vertex positions
    this.colors = []; // this array will hold per-vertex color data
    this.transform = mat4(); // initialize object transform as identity matrix

    this.facecolor = fc;
    
    // DONE make sure we pass the face colors into this call
    this.mkcube(this.facecolor); // delegate to auxiliary function

    this.program = program; // Load shaders and initialize attribute buffers

    this.cBufferId = gl.createBuffer(); // reserve a buffer object
    gl.bindBuffer( gl.ARRAY_BUFFER, this.cBufferId ); // set active array buffer
    /* send vert colors to the buffer, must repeat this
       wherever we change the vert colors for this cube */
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW );

    this.vBufferId = gl.createBuffer(); // reserve a buffer object
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBufferId ); // set active array buffer
    /* send vert positions to the buffer, must repeat this
       wherever we change the vert positions for this cube */
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW );
}

Cube.prototype.draw = function() {
    gl.useProgram( this.program ); // set the current shader programs

    var projId = gl.getUniformLocation(this.program, "projection"); 
    gl.uniformMatrix4fv(projId, false, flatten(projection));

    var xformId = gl.getUniformLocation(this.program, "modeltransform");
    gl.uniformMatrix4fv(xformId, false, flatten(this.transform));

    gl.bindBuffer( gl.ARRAY_BUFFER, this.cBufferId ); // set active array buffer
    // map buffer data to the vertex shader attribute
    var vColorId = gl.getAttribLocation( this.program, "vColor" );
    gl.vertexAttribPointer( vColorId, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColorId );

    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBufferId ); // set active array buffer
    // map buffer data to the vertex shader attribute
    var vPosId = gl.getAttribLocation( this.program, "vPosition" );
    gl.vertexAttribPointer( vPosId, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosId );

    if ( turning == true && count < 90 ) {
        if (leftturn) {
            ctop.turn(-1, Y_AXIS);
        } else {
            leftturn = false;
            ctop.turn(1, Y_AXIS);
        }
        count++;
    } else {
        turning = false;
        leftturn = false;
        count = 0;
    }

    // now push buffer data through the pipeline to render this object
    gl.drawArrays( gl.TRIANGLES, 0, this.numverts() );
}

/* Returns the total count of vertices to be sent into the pipeline. */
Cube.prototype.numverts = function() {return this.points.length;};

/* Default vertex positions for unit cube centered at the origin. */
Cube.prototype.vertices = [
    [ -0.5, -0.5,  0.5, 1.0 ],
    [ -0.5,  0.5,  0.5, 1.0 ],
    [  0.5,  0.5,  0.5, 1.0 ],
    [  0.5, -0.5,  0.5, 1.0 ],
    [ -0.5, -0.5, -0.5, 1.0 ],
    [ -0.5,  0.5, -0.5, 1.0 ],
    [  0.5,  0.5, -0.5, 1.0 ],
    [  0.5, -0.5, -0.5, 1.0 ]
];

/* Default vertex colors for the color cube. */
Cube.prototype.vcolors = [
    [ 0.0, 0.0, 0.0, 1.0 ], // black
    [ 1.0, 0.0, 0.0, 1.0 ], // red
    [ 1.0, 1.0, 0.0, 1.0 ], // yellow
    [ 0.0, 1.0, 0.0, 1.0 ], // green
    [ 0.0, 0.0, 1.0, 1.0 ], // blue
    [ 1.0, 0.0, 1.0, 1.0 ], // magenta
    [ 1.0, 1.0, 1.0, 1.0 ], // white
    [ 0.0, 1.0, 1.0, 1.0 ]  // cyan
];

/*
    Build one of the faces for this cube object.

    DONE change this so that we specify a single color (via a
        parameter) for the quad face instead of using vcolors
*/
Cube.prototype.mkquad = function(a, b, c, d, facecolor) {

    this.points.push( vec4(this.vertices[a]) );
    this.colors.push( vec4(this.vcolors[facecolor]) );

    this.points.push( vec4(this.vertices[b]) );
    this.colors.push( vec4(this.vcolors[facecolor]) );

    this.points.push( vec4(this.vertices[c]) );
    this.colors.push( vec4(this.vcolors[facecolor]) );

    this.points.push( vec4(this.vertices[a]) );
    this.colors.push( vec4(this.vcolors[facecolor]) );

    this.points.push( vec4(this.vertices[c]) );
    this.colors.push( vec4(this.vcolors[facecolor]) );

    this.points.push( vec4(this.vertices[d]) );
    this.colors.push( vec4(this.vcolors[facecolor]) );
}

/*
    Build all faces of this cube object.
    DONE change this so that we specify the colors (via parameter)
        for the different faces and pass them into mkquad 
*/
Cube.prototype.mkcube = function() {
    this.mkquad( 1, 0, 3, 2, this.facecolor[0]);
    this.mkquad( 2, 3, 7, 6, this.facecolor[1]);
    this.mkquad( 3, 0, 4, 7, this.facecolor[2]);
    this.mkquad( 6, 5, 1, 2, this.facecolor[3]);
    this.mkquad( 4, 5, 6, 7, this.facecolor[4]);
    this.mkquad( 5, 4, 0, 1, this.facecolor[5]);
}

/* Translate this cube along the specified canonical axis. */
Cube.prototype.move = function(dist, axis) {
    var delta = [0, 0, 0];

    if (axis === undefined) axis = Y_AXIS;
    delta[axis] = dist;

    this.transform = mult(translate(delta), this.transform);
}

/* Rotate this cube around the specified canonical axis. */
Cube.prototype.turn = function(angle, axis) {
    var avec = [0, 0, 0];

    if (axis === undefined) axis = Y_AXIS;
    avec[axis] = 1;

    this.transform = mult(this.transform, rotate(angle, avec));
}

/* Set up event callback to start the application */
window.onload = function() {
    initGL(); // basic WebGL setup for the scene 

    // load and compile our shaders into a program object
    var shaders = initShaders( gl, "vertex-shader", "fragment-shader" );

    // create a cube centered at the origin
    cmid = new Cube(shaders, midfacecolor);

    // DONE create two additional cubes above and below the middle one
    ctop = new Cube(shaders, topfacecolor);
    ctop.move(1.0, Y_AXIS);
    
    cbot = new Cube(shaders, botfacecolor);
    cbot.move(-1.0, Y_AXIS);

    // DONE include the two new cubes here as well
    drawables.push(cmid); // add all cubes to our list of drawables
    drawables.push(ctop);
    drawables.push(cbot);

    renderScene(); // begin render loop
}