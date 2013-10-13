/* sierpinski gasket with vertex arrays */

#include "Angel.h"

using namespace std;

const int NumTimesToSubdivide = 5;
const int NumSegments = 3072;  // 3*4^5 triangles generated
const int NumVertices  = 2 * NumSegments;

vec2 points[NumVertices];
int Index = 0;

//----------------------------------------------------------------------------

void
segment( const vec2& a, const vec2& b )
{
    points[Index++] = a;
    points[Index++] = b;
}

//----------------------------------------------------------------------------

void
divide_segment( const vec2& a, const vec2& b, int count )
{
    if ( count > 0 ) {
        vec2 diff = b - a;
        vec2 v0 = a + diff / 3;
        vec2 v1 = a + 2 * diff / 3;
        vec2 v2 = ( a + b ) / 2.0;

        GLfloat r = length(b - a);
        //GLfloat d = 2.0f * r;
        GLfloat h = sqrt(3.0) * r / 2.0;

        vec2 v3 (v2.x - h * (v1.y - v0.y) / r,
                 v2.y + h * (v1.x - v0.x) / r);

        divide_segment( a, v0, count - 1 );
        divide_segment( v0, v3, count - 1 );
        divide_segment( v3, v1, count - 1 );
        divide_segment( v1, b, count - 1 );
    }
    else {
        segment( a, b );    // draw triangle at end of recursion
    }
}

//----------------------------------------------------------------------------

void
init( void )
{
    vec2 vertices[3] = {
        vec2( -1.0, -1.0 ), vec2( 0.0, 0.732050808 ), vec2( 1.0, -1.0 )
    };

    // Subdivide the original triangle
    divide_segment( vertices[0], vertices[1], NumTimesToSubdivide);
    divide_segment( vertices[1], vertices[2], NumTimesToSubdivide);
    divide_segment( vertices[2], vertices[0], NumTimesToSubdivide);

    // Create a vertex array object
    GLuint vao;
    glGenVertexArrays( 1, &vao );
    glBindVertexArray( vao );

    // Create and initialize a buffer object
    GLuint buffer;
    glGenBuffers( 1, &buffer );
    glBindBuffer( GL_ARRAY_BUFFER, buffer );
    glBufferData( GL_ARRAY_BUFFER, sizeof(points), points, GL_STATIC_DRAW );

    // Load shaders and use the resulting shader program
    GLuint program = InitShader( "vshader22.glsl", "fshader22.glsl" );
    glUseProgram( program );

    // Initialize the vertex position attribute from the vertex shader    
    GLuint loc = glGetAttribLocation( program, "vPosition" );
    glEnableVertexAttribArray( loc );
    glVertexAttribPointer( loc, 2, GL_FLOAT, GL_FALSE, 0,
                           BUFFER_OFFSET(0) );

    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glViewport(0, 0, 500, 500);
    gluOrtho2D(-10, 10, -1, 1);
    glMatrixMode(GL_MODELVIEW);


    glClearColor( 0.0, 0.0, 0.0, 1.0 ); /* white background */
}

//----------------------------------------------------------------------------

void reshape(int w, int h)
{
    double aspectRatio = (double)w / (double)h;

    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glViewport(0, 0, w, h);
    gluOrtho2D(-10, 10, -1, 1);
    glMatrixMode(GL_MODELVIEW);
}

//----------------------------------------------------------------------------

void
display( void )
{
    glClear( GL_COLOR_BUFFER_BIT );
    glDrawArrays( GL_LINES, 0, NumVertices );
    glFlush();
}

//----------------------------------------------------------------------------

void
keyboard( unsigned char key, int x, int y )
{
    switch ( key ) {
    case 033:
        exit( EXIT_SUCCESS );
        break;
    }
}

//----------------------------------------------------------------------------

int
main( int argc, char **argv )
{
    glutInit( &argc, argv );
    glutInitDisplayMode( GLUT_RGBA );
    glutInitWindowSize( 512, 512 );
    glutInitContextVersion( 3, 2 );
    glutInitContextProfile( GLUT_CORE_PROFILE );
    glutCreateWindow( "Simple GLSL example" );

    //glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
    glewExperimental = GL_TRUE;
    glewInit();

    init();


    glutDisplayFunc( display );
    glutKeyboardFunc( keyboard );
    glutReshapeFunc( reshape );

    glutMainLoop();
    return 0;
}
