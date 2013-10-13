/*
    cube.js - Drawable WebGL cube object definition

    IMPORTANT NOTE:
    This scripts assumes that the initGL.js script has already been loaded,
    and that consequently a variety of global variables are already defined,
    such as: gl, drawables, X_AXIS, Y_AXIS, Z_AXIS
*/

/*
    Global variable for the 2D array cubelist, which will contain all 27 cubes
 */
var cubelist;

/*
    This is the preset color combination for a Rubik's Cube.
 */
var rubcubecolor = [6, 1, 4, 3, 2, 8];


var Cube = function (program, facecolor) {
    this.init(program, facecolor);
}

/* Initialize properties of this color cube object. */
Cube.prototype.init = function(program, fc) {
    this.points = []; // this array will hold raw vertex positions
    this.colors = []; // this array will hold per-vertex color data
    this.transform = mat4(); // initialize object transform as identity matrix

    this.facecolor = fc;
    
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

    // logic for determining which way to orbit the top row of cubes
    if ( orbiting == true && count < 90 ) {
        if (leftorbit) {
            orbit(Y_AXIS, -1);
        } else {
            leftorbit = false;
            orbit(Y_AXIS, 1);
        }
        count++;
    } else {
        orbiting = false;
        leftorbit = false;
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
    [ 0.0, 1.0, 1.0, 1.0 ], // cyan
    [ 1.0, 0.5, 0.0, 1.0 ]  // orange
];

/* Build one of the faces for this cube object. */
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

/* Build all faces of this cube object. */
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

    // switched parameters in the following command to get the cubes to move as a collective role
    this.transform = mult(rotate(angle, avec), this.transform);
}

/* Make the top row of the cube orbit around the center cube. */
orbit = function(axis, angle) {
    var j;
    for (j = 0; j < 9; j++) {
        cubelist[0][j].turn(angle, axis);
    }
}

/* Set up event callback to start the application */
window.onload = function() {
    initGL(); // basic WebGL setup for the scene 

    // load and compile our shaders into a program object
    var shaders = initShaders( gl, "vertex-shader", "fragment-shader" );

    cubelist = [];

    var rows; // rows from top down
    var squares; // squares from top left to bottom right
    for (rows = 0; rows < 3; rows++) {
        cubelist[rows] = []; // state that each element in cubelist is an array

        // create the Cube objects in each element of the 2D array cubelist
        for (squares = 0; squares < 9; squares++) {
            cubelist[rows][squares] = new Cube(shaders, rubcubecolor);
        }
    }

    // move the entire top row upwards from the origin
    var square;
    for (square = 0; square < 9; square++) {
        cubelist[0][square].move(1.0, Y_AXIS);
    }
    // **** move each square on the top row to where it needs to be ****
    cubelist[0][0].move(-1.0, X_AXIS);
    cubelist[0][0].move(-1.0, Z_AXIS);
    cubelist[0][1].move(-1.0, Z_AXIS);
    cubelist[0][2].move(1.0, X_AXIS);
    cubelist[0][2].move(-1.0, Z_AXIS);
    cubelist[0][3].move(-1.0, X_AXIS);
    // don't move cubelist[0][4], this is our center cube for the top face
    cubelist[0][5].move(1.0, X_AXIS);
    cubelist[0][6].move(-1.0, X_AXIS);
    cubelist[0][6].move(1.0, Z_AXIS);
    cubelist[0][7].move(1.0, Z_AXIS);
    cubelist[0][8].move(1.0, X_AXIS);
    cubelist[0][8].move(1.0, Z_AXIS);
    // **** end moving top row of cubes ****

    // **** move each square on the middle row to where it needs to be ****
    cubelist[1][0].move(-1.0, X_AXIS);
    cubelist[1][0].move(-1.0, Z_AXIS);
    cubelist[1][1].move(-1.0, Z_AXIS);
    cubelist[1][2].move(1.0, X_AXIS);
    cubelist[1][2].move(-1.0, Z_AXIS);
    cubelist[1][3].move(-1.0, X_AXIS);
    // don't move cubelist[1][4], this is our center cube
    cubelist[1][5].move(1.0, X_AXIS);
    cubelist[1][6].move(-1.0, X_AXIS);
    cubelist[1][6].move(1.0, Z_AXIS);
    cubelist[1][7].move(1.0, Z_AXIS);
    cubelist[1][8].move(1.0, X_AXIS);
    cubelist[1][8].move(1.0, Z_AXIS);
    // **** end moving top row of cubes ****

    // move the entire bottom row downwards from the origin
    var square;
    for (square = 0; square < 9; square++) {
        cubelist[2][square].move(-1.0, Y_AXIS);
    }
    // **** move each square on the bottom row to where it needs to be ****
    cubelist[2][0].move(-1.0, X_AXIS);
    cubelist[2][0].move(-1.0, Z_AXIS);
    cubelist[2][1].move(-1.0, Z_AXIS);
    cubelist[2][2].move(1.0, X_AXIS);
    cubelist[2][2].move(-1.0, Z_AXIS);
    cubelist[2][3].move(-1.0, X_AXIS);
    // don't move cubelist[2][4], this is our center cube for the bottom row
    cubelist[2][5].move(1.0, X_AXIS);
    cubelist[2][6].move(-1.0, X_AXIS);
    cubelist[2][6].move(1.0, Z_AXIS);
    cubelist[2][7].move(1.0, Z_AXIS);
    cubelist[2][8].move(1.0, X_AXIS);
    cubelist[2][8].move(1.0, Z_AXIS);
    // **** end moving bottom row of cubes ****
    
    // this adds every cube to the drawables array
    // row and square is declared above, used again down here
    for (row = 0; row < 3; row++) {
        for (square = 0; square < 9; square++) {
            drawables.push(cubelist[row][square]);
        }
    }

    renderScene(); // begin render loop
}