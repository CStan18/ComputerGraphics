/*
    This is a global variable for an array of 27 cubes.
 */
var cubelist;

/*
    Constructor for a Rubik object.
 */
var Rubik = function(program) {
    this.init(program);
}

/* Initial setup of the 27 cubes into cubelist. */
Rubik.prototype.init = function(program) {
    this.program = program;

    cubelist = new Array(3); // cubelist is an empty array

    var rows, squares;
    for (rows = 0; rows < 3; rows++) {
        cubelist[rows] = new Array(9); // state that each element in cubelist is also an array

        // create the Cube objects in each element of the 2D array 'cubelist'
        for (squares = 0; squares < 9; squares++) {
            cubelist[rows][squares] = new Cube(program, rubcubecolor);
        }
    }

    // move the entire top row upwards from the origin
    var square;
    for (square = 0; square < 9; square++) {
        cubelist[0][square].move(1.01, Y_AXIS);
    }
    // **** move each square on the top row to where it needs to be ****
    cubelist[0][0].move(-1.01, X_AXIS);
    cubelist[0][0].move(-1.01, Z_AXIS);
    cubelist[0][1].move(-1.01, Z_AXIS);
    cubelist[0][2].move(1.01, X_AXIS);
    cubelist[0][2].move(-1.01, Z_AXIS);
    cubelist[0][3].move(-1.01, X_AXIS);
    // don't move cubelist[0][4], this is our center cube for the top face
    cubelist[0][5].move(1.01, X_AXIS);
    cubelist[0][6].move(-1.01, X_AXIS);
    cubelist[0][6].move(1.01, Z_AXIS);
    cubelist[0][7].move(1.01, Z_AXIS);
    cubelist[0][8].move(1.01, X_AXIS);
    cubelist[0][8].move(1.01, Z_AXIS);
    // **** end moving top row of cubes ****

    // **** move each square on the middle row to where it needs to be ****
    cubelist[1][0].move(-1.01, X_AXIS);
    cubelist[1][0].move(-1.01, Z_AXIS);
    cubelist[1][1].move(-1.01, Z_AXIS);
    cubelist[1][2].move(1.01, X_AXIS);
    cubelist[1][2].move(-1.01, Z_AXIS);
    cubelist[1][3].move(-1.01, X_AXIS);
    // don't move cubelist[1][4], this is our center cube for the middle row
    cubelist[1][5].move(1.01, X_AXIS);
    cubelist[1][6].move(-1.01, X_AXIS);
    cubelist[1][6].move(1.01, Z_AXIS);
    cubelist[1][7].move(1.01, Z_AXIS);
    cubelist[1][8].move(1.01, X_AXIS);
    cubelist[1][8].move(1.01, Z_AXIS);
    // **** end moving top row of cubes ****

    // move the entire bottom row downwards from the origin
    var square;
    for (square = 0; square < 9; square++) {
        cubelist[2][square].move(-1.01, Y_AXIS);
    }
    // **** move each square on the bottom row to where it needs to be ****
    cubelist[2][0].move(-1.01, X_AXIS);
    cubelist[2][0].move(-1.01, Z_AXIS);
    cubelist[2][1].move(-1.01, Z_AXIS);
    cubelist[2][2].move(1.01, X_AXIS);
    cubelist[2][2].move(-1.01, Z_AXIS);
    cubelist[2][3].move(-1.01, X_AXIS);
    // don't move cubelist[2][4], this is our center cube for the bottom row
    cubelist[2][5].move(1.01, X_AXIS);
    cubelist[2][6].move(-1.01, X_AXIS);
    cubelist[2][6].move(1.01, Z_AXIS);
    cubelist[2][7].move(1.01, Z_AXIS);
    cubelist[2][8].move(1.01, X_AXIS);
    cubelist[2][8].move(1.01, Z_AXIS);
    // **** end moving bottom row of cubes ****
}

/* Make the given side of the cube orbit around its center cube. */
Rubik.prototype.orbit = function(side, angle) {
    var j;

    // make a brand new array of 27 cubes called 'copy'
    var copy = new Array(3);
    var rows, squares;
    for (rows = 0; rows < 3; rows++) {
        copy[rows] = new Array(9);

        // copies each cube from 'cubelist' into the new 'copy' array
        for (squares = 0; squares < 9; squares++) {
            copy[rows][squares] = cubelist[rows][squares].getCube();
            // THIS IS NOT CREATING A NEW CUBE!!!
        }
    }
    
    // switch statement for deciding which face needs to be orbited
    switch(side) {
        case "top":
            // physically orbits the cubes
            for (j = 0; j < 9; j++) {
                cubelist[0][j].turn(angle, Y_AXIS);
            }
            
            // reassigns the cubes into the spots in 'copy' that they should now be in
            copy[0][0] = cubelist[0][2].getCube();
            copy[0][1] = cubelist[0][5].getCube();
            copy[0][2] = cubelist[0][8].getCube();
            copy[0][3] = cubelist[0][1].getCube();
            copy[0][4] = cubelist[0][4].getCube();
            copy[0][5] = cubelist[0][7].getCube();
            copy[0][6] = cubelist[0][0].getCube();
            copy[0][7] = cubelist[0][3].getCube();
            copy[0][8] = cubelist[0][6].getCube();

            // put the newly aligned cubes back into 'cubelist'
            for(rows = 0; rows < 3; rows++){
                for(squares = 0; squares < 9; squares++) {
                    cubelist[rows][squares] = copy[rows][squares];
                }
            }
            break;

        case "front":
            // physically orbit the cubes
            cubelist[0][6].turn(angle, Z_AXIS);
            cubelist[0][7].turn(angle, Z_AXIS);
            cubelist[0][8].turn(angle, Z_AXIS);
            cubelist[1][6].turn(angle, Z_AXIS);
            cubelist[1][7].turn(angle, Z_AXIS);
            cubelist[1][8].turn(angle, Z_AXIS);
            cubelist[2][6].turn(angle, Z_AXIS);
            cubelist[2][7].turn(angle, Z_AXIS);
            cubelist[2][8].turn(angle, Z_AXIS);
            
            // reassigns the cubes into the spots in 'copy' that they should now be in
            copy[0][8] = cubelist[0][6].getCube();
            copy[1][8] = cubelist[0][7].getCube();
            copy[2][8] = cubelist[0][8].getCube();
            copy[0][7] = cubelist[1][6].getCube();
            copy[1][7] = cubelist[1][7].getCube();
            copy[2][7] = cubelist[1][8].getCube();
            copy[0][6] = cubelist[2][6].getCube();
            copy[1][6] = cubelist[2][7].getCube();
            copy[2][6] = cubelist[2][8].getCube();

            // put the newly aligned cubes back into 'cubelist'
            for(rows = 0; rows < 3; rows++) {
                for(squares = 0; squares < 9; squares++) {
                    cubelist[rows][squares] = copy[rows][squares];
                }
            }
            break;
    }
}