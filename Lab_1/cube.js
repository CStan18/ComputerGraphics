/*
 IMPORTANT NOTE:
 This scripts assumes that the initGL.js script has already been loaded,
 and that consequently a variety of global variables are already defined,
 such as: canvas, gl, Xaxis, Yaxis, Zaxis, Axis
*/

/* Definition of ColorCube object follows */
function ColorCube (vshader, fshader) {
    this.init(vshader, fshader);
}

/* Prototype: there is a master copy of the object, from which every other
   one is derived (instead of the template in the class). You can dynamically
   change the prototype and it will update every instance.
*/
ColorCube.prototype.init = function(vshader, fshader) {
    // each instance of the object ColorCube needs its own data
    this.vshader = vshader;
    this.fshader = fshader;

    // builds all points
    this.mkcube(); // delegate to auxiliary function

    //  Load shaders and initialize attribute buffers
    ColorCube.prototype.program = initShaders( gl, vshader, fshader );
    gl.useProgram( this.program );

    ColorCube.prototype.cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW );
    // the name "vColor" needs to match the name in the shader program
    var vColorId = gl.getAttribLocation( this.program, "vColor" );
    gl.vertexAttribPointer( vColorId, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColorId );

    ColorCube.prototype.vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW );
    var vPosId = gl.getAttribLocation( this.program, "vPosition" );
    gl.vertexAttribPointer( vPosId, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosId );
    
    // default values
    this.theta = [45.0, 45.0, 45.0];
    this.delta = [0.0, 0.0, 0.0];
}

ColorCube.prototype.draw = function() {

    this.theta[Axis] += 2.0; // update the rotation angle

    gl.useProgram(this.program); // use the appropriate shader programs
    
    // changing angle
    thetaId = gl.getUniformLocation(this.program, "theta");
    gl.uniform3fv(thetaId, this.theta);

    // changing position
    deltaId = gl.getUniformLocation(this.program, "delta");
    gl.uniform3fv(deltaId, this.delta);

    // projection matrix
    projId = gl.getUniformLocation(this.program, "projection");
    gl.uniformMatrix4fv(projId, false, projection);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.nBufferId);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferId);
    gl.drawArrays(gl.TRIANGLES, 0, this.numverts());
}

ColorCube.prototype.points = [];
ColorCube.prototype.colors = [];
ColorCube.prototype.numverts = function() {return this.points.length;};

ColorCube.prototype.vertices = [
    [ -0.5, -0.5,  0.5, 1.0 ],
    [ -0.5,  0.5,  0.5, 1.0 ],
    [  0.5,  0.5,  0.5, 1.0 ],
    [  0.5, -0.5,  0.5, 1.0 ],
    [ -0.5, -0.5, -0.5, 1.0 ],
    [ -0.5,  0.5, -0.5, 1.0 ],
    [  0.5,  0.5, -0.5, 1.0 ],
    [  0.5, -0.5, -0.5, 1.0 ]
];

ColorCube.prototype.vcolors = [
    [ 0.0, 0.0, 0.0, 1.0 ], // black
    [ 1.0, 0.0, 0.0, 1.0 ], // red
    [ 1.0, 1.0, 0.0, 1.0 ], // yellow
    [ 0.0, 1.0, 0.0, 1.0 ], // green
    [ 0.0, 0.0, 1.0, 1.0 ], // blue
    [ 1.0, 0.0, 1.0, 1.0 ], // magenta
    [ 1.0, 1.0, 1.0, 1.0 ], // white
    [ 0.0, 1.0, 1.0, 1.0 ]  // cyan
];

ColorCube.prototype.mkquad = function(a, b, c, d) {
    this.points.push( point4.create(this.vertices[a]) );
    this.colors.push( point4.create(this.vcolors[a]) );

    this.points.push( point4.create(this.vertices[b]) );
    this.colors.push( point4.create(this.vcolors[b]) );

    this.points.push( point4.create(this.vertices[c]) );
    this.colors.push( point4.create(this.vcolors[c]) );

    this.points.push( point4.create(this.vertices[a]) );
    this.colors.push( point4.create(this.vcolors[a]) );

    this.points.push( point4.create(this.vertices[c]) );
    this.colors.push( point4.create(this.vcolors[c]) );

    this.points.push( point4.create(this.vertices[d]) );
    this.colors.push( point4.create(this.vcolors[d]) );
}

ColorCube.prototype.mkcube = function() {
    this.mkquad( 1, 0, 3, 2 );
    this.mkquad( 2, 3, 7, 6 );
    this.mkquad( 3, 0, 4, 7 );
    this.mkquad( 6, 5, 1, 2 );
    this.mkquad( 4, 5, 6, 7 );
    this.mkquad( 5, 4, 0, 1 );
}

ColorCube.prototype.move = function(x, y, z) {
    this.delta = [x, y, z];
}

/* Set up event callback to start the application */
window.onload = function() {
	initGL();
	
    var cube = new ColorCube("vertex-shader", "fragment-shader");
	cube.move(-2.0, 0.0, 0.0); // change the movement here
    drawables.push(cube);

    var cubetwo = new ColorCube("vertex-shader", "fragment-shader");
    cubetwo.move(0.0, 0.0, 0.0); // change the movement here
    drawables.push(cubetwo);
  
    renderScene();
}