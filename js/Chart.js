/*
* @Author: Ryan Kophs
* @Date:   2016-09-18 23:39:08
* @Last Modified by:   Ryan Kophs
* @Last Modified time: 2016-09-22 19:37:48
*/

'use strict';

/*
* Description: Renders a 3D animation of a series of points, represented as small red cubes.
*/
window.Chart = function(elementId) {

	/*
	* Project a 3d coordinate onto the X position of a 2d pixel screen.
	* @Params:
	*   point: 3d coordinate represented as an array of length 3
	*   camera: 3d camera position represented as an array of length 3
	*   scale: double value used to convert coordinate into unit vector
	*/
	var pX = function(point, camera, scale) {
		return ((camera[2]*(point[0]-camera[0])/(point[2]+camera[2])) + camera[0]) * scale;
	};

	/*
	* Project a 3d coordinate onto the Y position of a 2d pixel screen.
	* @Params:
	*   point: 3d coordinate represented as an array of length 3
	*   camera: 3d camera position represented as an array of length 3
	*   scale: double value used to convert coordinate into unit vector
	*/
	var pY = function(point, camera, scale) {
		return -1*((camera[2]*(point[1]-camera[1])/(point[2]+camera[2])) + camera[1]) * scale;
	};

	/*
	* Draw a line between two coordinates onto the canvas element
	* @Params:
	*   context: HTML canvas context
	*   x1: first coordinate
	*   x2: second coordinate
	*   camera: 3d camera position represented as an array of length 3
	*   scale: double value used to convert coordinate into unit vector
	*/
	var drawEdge = function(context, x1, x2, camera, scale) {
		context.beginPath();
		context.moveTo(pX(x1, camera, scale), pY(x1, camera, scale));
		context.lineTo(pX(x2, camera, scale), pY(x2, camera, scale));
		context.stroke();
	};

	/*
	* Draw a solid polygon given an input array of vertices
	* @Params:
	*   context: HTML canvas context
	*   points: array of 3d vertices that define the polygon
	*   camera: 3d camera position represented as an array of length 3
	*   fill: RGB color of polygon
	*   scale: double value used to convert coordinate into unit vector
	*/
	var drawPolygon = function(context, points, camera, fill, scale) {
		context.fillStyle = fill;
		context.beginPath();
		context.moveTo(pX(points[0], camera, scale), pY(points[0], camera, scale));
		for(var i = 1; i < points.length; i++) {
			context.lineTo(pX(points[i], camera, scale), pY(points[i], camera, scale));
		}
		context.closePath();
		context.fill();
	}

	/*
	* Draw a solid cube given an input center of mass
	* @Params:
	*   context: HTML canvas context
	*   center: 3d coordinate for the center of the cube (i.e. center of mass)
	*   camera: 3d camera position represented as an array of length 3
	*   scale: double value used to convert coordinate into unit vector
	*   shade: double value representing how dark the cube should be
	*   cubeSize: double value representing half of the length of one of the cube edges
	*/
	var drawCube = function(context, center, camera, scale, shade, cubeSize) {

		var color1 = "rgb(" + Math.floor(220*shade) + ",0,0)";
		var color2 = "rgb(" + Math.floor(255*shade) + ",0,0)";
		var color3 = "rgb(" + Math.floor(200*shade) + ",0,0)";

		var corners = [
			[center[0]-cubeSize, center[1]+cubeSize, center[2]-cubeSize],
			[center[0]-cubeSize, center[1]-cubeSize, center[2]-cubeSize],
			[center[0]+cubeSize, center[1]-cubeSize, center[2]-cubeSize],
			[center[0]+cubeSize, center[1]+cubeSize, center[2]-cubeSize],
			[center[0]-cubeSize, center[1]+cubeSize, center[2]+cubeSize],
			[center[0]-cubeSize, center[1]-cubeSize, center[2]+cubeSize],
			[center[0]+cubeSize, center[1]-cubeSize, center[2]+cubeSize],
			[center[0]+cubeSize, center[1]+cubeSize, center[2]+cubeSize]
		];
		drawPolygon(context, [corners[4], corners[5], corners[6], corners[7]], camera, color1, scale);
		drawPolygon(context, [corners[0], corners[4], corners[7], corners[3]], camera, color2, scale);
		drawPolygon(context, [corners[6], corners[7], corners[3], corners[2]], camera, color3, scale);
	}

	/*
	* Draw a shadow on the floor of the chart for a cube defined by its center
	* @Params:
	*   context: HTML canvas context
	*   center: 3d coordinate for the center of the cube (i.e. center of mass)
	*   camera: 3d camera position represented as an array of length 3
	*   scale: double value used to convert coordinate into unit vector
	*   cubeSize: double value representing half of the length of one of the cube edges
	*/
	var drawCubeShadows = function(context, center, camera, scale, cubeSize) {
		var corners = [
			[center[0]-cubeSize, -1, center[2]-cubeSize],
			[center[0]-cubeSize, -1, center[2]+cubeSize],
			[center[0]+cubeSize, -1, center[2]+cubeSize],
			[center[0]+cubeSize, -1, center[2]-cubeSize]
		];
		drawPolygon(context, [corners[0], corners[1], corners[2], corners[3]], camera, '#666', scale);
	}

	/*
	* Draw either the back or front half of the chart's box perimeter edges.
	* @Params:
	*   context: HTML canvas context
	*   camera: 3d camera position represented as an array of length 3
	*   scale: double value used to convert coordinate into unit vector
	*   backEdge: boolean representing whether to render the back half of the box
	*/
	var drawBoxHalf = function(context, camera, scale, backEdge) {
		context.lineWidth = 1;
		context.strokeStyle = '#777';
		var corners = [
			[-1,-1,-1],
			[-1, 1,-1],
			[ 1, 1,-1],
			[ 1,-1,-1],
			[-1,-1, 1],
			[-1, 1, 1],
			[ 1, 1, 1],
			[ 1,-1, 1]
		];

		var edges;
		if (backEdge) {
			edges = [
				[corners[0], corners[1]],
				[corners[1], corners[2]],
				[corners[2], corners[3]],
				[corners[3], corners[0]],
				[corners[0], corners[4]],
				[corners[1], corners[5]],
				[corners[4], corners[5]]
			];
		} else {
			edges = [
				[corners[5], corners[6]],
				[corners[6], corners[7]],
				[corners[7], corners[4]],
				[corners[2], corners[6]],
				[corners[3], corners[7]]
			];
		}

		for (var i in edges) {
			drawEdge(context, edges[i][0], edges[i][1], camera, scale);
		}
		context.strokeStyle = 'none';
	}

	/*
	* Erase any rendered graphics on the HTML canvas element
	* @Params:
	*   context: HTML canvas context
	*   canvas: HTML canvas
	*/
	var clear = function(context, canvas) {
		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.restore();
	}

	/* Beginning of JS class constructor; if already instantiated: */
	if (this instanceof Chart) {

		/* get canvas, canvas context, and reposition to center of canvas */
		var canvas = document.getElementById(elementId);
		var context = canvas.getContext('2d');
		context.translate(canvas.width / 1.8, canvas.height / 2.2);
		
		/* animation scale and camera position*/
		var scale = canvas.width / 4 ;
		var camera = [2, 2, -7];

		/* clear anything on the canvas and draw empty box perimiter*/
		clear(context, canvas);
		drawBoxHalf(context, camera, scale, true);
		drawBoxHalf(context, camera, scale, false);

		/*
		* plotPoints accepts an array of box locations/colors and renders
		*   them to the screen.
		* @Params
		*   boxes: array of box objects containing box center and color
		*/
		this.plotBoxes = function(boxes) {
			clear(context, canvas);
			drawBoxHalf(context, camera, scale, true);
			for (var i = boxes.length - 1; i >= 0; i--) {
				drawCubeShadows(context, boxes[i].point, camera, scale, 0.008);
				drawCube(context, boxes[i].point, camera, scale, boxes[i].color_it, 0.01);
			};
			drawBoxHalf(context, camera, scale, false);
		};

	} else {
		return new Chart(elementId);
	}
}