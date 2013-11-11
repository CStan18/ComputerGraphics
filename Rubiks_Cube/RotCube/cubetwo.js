/*
    Authors:
    Katie Craven
    John Paul Welsh
*/

/*
    cube.js - Drawable WebGL cube object definition

    IMPORTANT NOTE:
    This scripts assumes that the initGL.js script has already been loaded,
    and that consequently a variety of global variables are already defined,
    such as: gl, drawables, X_AXIS, Y_AXIS, Z_AXIS
*/

/* This is a global variable for a Rubik object. */
var rbk;

/* This is the color combination for a Rubik's Cube. */
var rubcubecolor = [6, 1, 4, 3, 2, 8];

//var inputString;
//var splitString; // splits the string into characters, puts it in an array
//var countListInstructions; // counter for the element in the splitString array we are currently looking

// the side to turn, according to the char in the instructions
//var myside;
// full number of times to turn this face, according to the number after the char in the instructions
//var times;
// number of times we have turned this face so far
//var currtimes;

/* Constructor for a new Cube. */
var Cube = function (program, facecolor, rbk) {
    this.init(program, facecolor, rbk);
}

/* Initialize properties of this color cube object. */
Cube.prototype.init = function(program, fc, rbk) {
    this.points = []; // this array will hold raw vertex positions
    this.colors = []; // this array will hold per-vertex color data
    this.transform = mat4(); // initialize object transform as identity matrix

    this.facecolor = fc; // assign a set of face colors to the cube
    
    this.mkcube(this.facecolor); // delegate to auxiliary function

    this.program = program; // Load shaders and initialize attribute buffers

    this.rbk = rbk; // assigns a new Rubik variable

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

    var vNormal = gl.getAttribLocation( this.program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var lightPosition = vec4(-4.0, 15.0, 30.0, 0.0 );
    var lightAmbient = vec4(0.0, 0.0, 0.0, 1.0 );
    var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
    var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    
    var lightPositionTwo = vec4(10.0, -3.0, -9.0 );
    var lightAmbientTwo = vec4(0.17, 0.18, 0.2, 1.0 );
    var lightDiffuseTwo = vec4( 0.6, 0.5, 0.6, 1.0 );
    var lightSpecularTwo = vec4( 0.3, 0.3, 0.0, 1.0 );

    var materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
    var materialDiffuse = vec4( 0.8, 0.8, 0.8, 1.0 );
    var materialSpecular = vec4( 0.7, 0.7, 0.7, 1.0 );
    var materialShininess = 80.0;
    
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    
    var ambientProductTwo = mult(lightAmbientTwo, materialAmbient);
    var diffuseProductTwo = mult(lightDiffuseTwo, materialDiffuse);
    var specularProductTwo = mult(lightSpecularTwo, materialSpecular);

    gl.uniform4fv( gl.getUniformLocation(this.program, "ambientProduct"),flatten(ambientProduct ));
    gl.uniform4fv( gl.getUniformLocation(this.program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(this.program, "specularProduct"),flatten(specularProduct));    
    gl.uniform4fv( gl.getUniformLocation(this.program, "lightPosition"), flatten(lightPosition ));
    gl.uniform4fv( gl.getUniformLocation(this.program, "ambientProductTwo"),flatten(ambientProductTwo ));
    gl.uniform4fv( gl.getUniformLocation(this.program, "diffuseProductTwo"), flatten(diffuseProductTwo) );
    gl.uniform4fv( gl.getUniformLocation(this.program, "specularProductTwo"),flatten(specularProductTwo));  
    gl.uniform4fv( gl.getUniformLocation(this.program, "lightPositionTwo"), flatten(lightPositionTwo ));
    gl.uniform1f( gl.getUniformLocation(this.program, "shininess"),materialShininess );

    //myside = splitString[countListInstructions];
    //times = splitString[countListInstructions + 1];
/*
    if (count < 90 && orbiting == true) {
        // these three faces need to orbit with positive angles to turn clockwise
        if (myside == "B" || myside == "O" || myside == "Y") {
            rbk.orbit(myside, 1);
        // the other three can turn with negative angles
        } else {
            rbk.orbit(myside, -1);
        }
        // we have just completed the orbiting
        if (count == 89) {
            // reassign the blocks for the next time
            rbk.reassign(myside);
        }
        count++; // increment the angle count
    } else if (currtimes < times) {
        currtimes++;
        count = 0;
    } else if (countListInstructions < splitString.length) {
        countListInstructions += 2;
    } else {
        orbiting = false;
    }
*/

/*
    // we still have instructions to complete (there are more elements in the list)
    if (countListInstructions < splitString.length) {

        // the current element is a char indicating the side to turn
        myside = splitString[countListInstructions];
        // the element after the current one is a number indicating how many times to turn the side
        times = splitString[countListInstructions + 1];

        // we still need to turn this face 'times' times before we move on to the next instruction
        if (currtimes < times) {
            


            // we still need to turn this face the full 90 degrees before we do it again or move on
            
            // TAKE OUT THE *TIMES MAYBE
            if (count < (90*times) && orbiting == true) {

                // these three faces need to orbit with positive angles to turn clockwise
                if (myside == "B" || myside == "O" || myside == "Y") {
                    rbk.orbit(myside, 1);
                // the other three can turn with negative angles
                } else {
                    rbk.orbit(myside, -1);
                }
                
                // we have just completed the orbiting
                // TAKE OUT THE OTHER OPTIONS MAYBE
                if (count == 89 || count == 179 || count == 269) {
                    // reassign the blocks for the next time
                    rbk.reassign(myside);
                }
                
                count++; // increment the angle count

            // we are done turning this face for now (depending on the value of 'times')
            } else {   
                side = ""; // reset the side
                count = 0; // reset the angle count
                orbiting = false;
            }

            currtimes++;

        // we are done turning this face forever
        } else {
            orbiting = false;
            countListInstructions += 2; // move on to the next letter in the array
        }

    // we are done reading in instructions
    } else {
        orbiting = false; // we are no longer allowed to spin
        side = "";
        count = 0;
        currtimes = 0;
        countListInstructions = 0;
    }
*/

    // logic for determining which way to orbit which side of the cube
    // the variable 'side' comes from InitGL
    if ( orbiting == true && count < 90 ) {
        
        // these three faces need to orbit with positive angles to turn clockwise
        if (side == "left" || side == "bottom" || side == "back") {
            rbk.orbit(side, 1);
        // the other three can turn with negative angles
        } else {
            rbk.orbit(side, -1);
        }
        
        // we have just completed the orbiting
        if (count == 89) {
            // reassign the blocks for the next time
            rbk.reassign(side);
        }
        count++;

    // no button has been pressed
    } else {

        orbiting = false;
        side = "";
        count = 0;
    
    }


    // now push buffer data through the pipeline to render this object
    gl.drawArrays( gl.TRIANGLES, 0, this.numverts() );
}

/* Returns the total count of vertices to be sent into the pipeline. */
Cube.prototype.numverts = function() {
    return this.points.length;
};

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
    this.mkquad( 1, 0, 3, 2, this.facecolor[0] );
    this.mkquad( 2, 3, 7, 6, this.facecolor[1] );
    this.mkquad( 3, 0, 4, 7, this.facecolor[2] );
    this.mkquad( 6, 5, 1, 2, this.facecolor[3] );
    this.mkquad( 4, 5, 6, 7, this.facecolor[4] );
    this.mkquad( 5, 4, 0, 1, this.facecolor[5] );
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

    // switched parameters in the following command to get the cubes to move as a whole
    this.transform = mult(rotate(angle, avec), this.transform);
}

/* Set up event callback to start the application */
window.onload = function() {
    initGL(); // basic WebGL setup for the scene 

    // load and compile our shaders into a program object
    var shaders = initShaders( gl, "vertex-shader", "fragment-shader" );

    // make a new Rubik object, which will be called in the logic for spinning a face, found in 'draw'
    rbk = new Rubik(shaders);
    // make the first version of 'copy'
    rbk.copyInit();

    inputString = "W3B1G1"; // default
    //inputString = contents; // carried over from cube.html by the event listener in initGL.js
    splitString = inputString.split("");

    for (var row = 0; row < 3; row++) {
        for (var square = 0; square < 9; square++) {
            drawables.push(cubelist[row][square]);
        }
    }

    renderScene(); // begin render loop
}