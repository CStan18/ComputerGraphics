// lines.cpp

#include "main.h"

// Rasterize a line from (X1,Y1) to (X2,Y2) using the DDA algorithm:
void dda( GLint X1, GLint Y1, GLint X2, GLint Y2 )
{
	int dy = 0;		// = ? (initialize from endpoints)
	int dx = 0;		// = ? (initialize from endpoints)
	double m;		// slope of the line
	double x, y;	// algorithm increments x or y, depending on slope
	
	;	// draw the pixel corresponding to the left endpoint
		// (see draw_pixel() in render.cpp)

	// Shallow slope case: start at X1 and on scanline Y1, then  
	// increment X1, going to the next scanline when necessary,
	// until we get to the second endpoint (X2,Y2)

	if( 0 ) // test for |slope| < 1 ... => shallow slope
	{          
		m = 0;		// = ? (compute slope in the usual way: rise over run)
		dx = 0;		// = ? (should we increment X1 by -1 (go left) or by +1 (go right) ?)

		m *= dx;	// (slope can be positive or negative)
		y = Y1;		// (start on the first endpoint's scanline)

		// Going from X1 to X2 ...
		while ( 0 )		// (loop until we reach the second endpoint)
		{
			;	// (step to next x value)
			;	// (add slope to y value)
			;	// (draw this pixel)
		}
	}

	// Steep slope case: switch x's and y's, dx's and dy's from the shallow case.
	// Start on scanline Y1 at X1, then increment Y1 (move one scanline at a time),
	// going to the next X value when necessary, until we get to the 2nd endpoint (X2,Y2)

	else // |slope| >= 1 ... => steep slope
	{                                     
		m  = 0;	// = ? (compute slope as "rise" over "run"; dx and dy are switched!)
		dy = 0;	// = ? (should we increment Y1 by -1 (go down) or by +1 (go up) ?  )
				// (That depends on the top-bottom order of Y1 and Y2          )

		m *= dy;	// slope can be positive or negative
		x = X1;		// start at the first endpoint in x

	    // Going from Y1 to Y2 ...
		while ( 0 )		// (loop until we reach the second endpoint)
		{
			;	// (step to next y value)
			;	// (add slope to x value)
			;	// (draw this pixel)
		}
	}
}

// Rasterize a line from (X1, Y1) to (X2, Y2) using the Bresenham's algorithm:
void bres( GLint X1, GLint Y1, GLint X2, GLint Y2 )
{
	bool steep = 0;	// = ? (check for steep slope case)

	if( steep )	// switch our notion of x and y for each endpoint
	{
		;	// (first endpoint)
		;	// (second endpoint)
	}

	if( 0 )	// (first endpoint is to the "right" of the second)
	{
		;	// reverse the endpoints
		;
	}

	int dx = 0;		// (computed as usual) 
	int dy = 0;		// (computed as an absolute value; ystep takes care of direction)
	int e  = 0;		// (no error, initially)
	int de = dy;	// (value to adjust error term by)
	int y  = Y1;	// (start on first endpoint's scanline)

	int ystep;		// (set this below, based on endpoint Y values)
	if( 0 )			// (first endpoint is "below" second endpoint)
		ystep;		// = ? (y increment will be positive)
	else
		ystep;		// = ? (y increment will be negative)
	
	// Go from X1 to X2	('X' really is 'Y' if this is steep slope case)
	for( int x; 0; ++x )
	{
		;	// Draw the pixel
		;	// Remember: steep slope case swaps x and y!

		;	// Add to the error term
		if( 0 )	// See if y increments
		{
			;	// Increment y
			;	// Reset error term
		}
	}
}
