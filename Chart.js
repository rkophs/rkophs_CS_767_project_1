/*
* @Author: ryan
* @Date:   2016-09-18 23:39:08
* @Last Modified by:   Ryan Kophs
* @Last Modified time: 2016-09-19 19:17:44
*/

'use strict';

window.Chart = function(elementId) {

	var projectX = function(px, pz, cx, cz){
	    return (cz * (px-cx)/(pz+cz)) + cx;
	};

	var projectY = function(py, pz, cy, cz){
	    return (cz * (py-cy)/(pz+cz)) + cy;
	};

	var pX = function(p, c, s) {
		return ((c[2]*(p[0]-c[0])/(p[2]+c[2])) + c[0]) * s;
	};

	var pY = function(p, c, s) {
		return -1*((c[2]*(p[1]-c[1])/(p[2]+c[2])) + c[1]) * s;
	};

	var drawLine = function(context, a, b, c, s) {
		context.beginPath();
        context.moveTo(pX(a, c, s), pY(a, c, s));
        context.lineTo(pX(b, c, s), pY(b, c, s));
        context.stroke();
	};

	var drawPoly = function(context, points, c, f, s) {
		context.fillStyle = f;
		context.beginPath();
        context.moveTo(pX(points[0], c, s), pY(points[0], c, s));
        var i;
        for(i = 1; i < points.length; i++) {
        	context.lineTo(pX(points[i], c, s), pY(points[i], c, s));
        }
        context.closePath();
        context.fill();
	}

	var drawCube = function(context, p, camera, s, color_it, cubeSize) {
		var colors = [
			['#600', '#f00', '#a00'],
			['#660', '#ff0', '#aa0'],
			['#060', '#0f0', '#0a0'],
			['#066', '#0ff', '#0aa'],
			['#006', '#00f', '#00a'],
		];

		var c1 = "rgb(" + Math.floor(220*color_it) + ",0,0)";
		var c2 = "rgb(" + Math.floor(255*color_it) + ",0,0)";
		var c3 = "rgb(" + Math.floor(200*color_it) + ",0,0)";

		var corners = [
			[p[0]-cubeSize,p[1]+cubeSize,p[2]-cubeSize],
			[p[0]-cubeSize,p[1]-cubeSize,p[2]-cubeSize],
			[p[0]+cubeSize,p[1]-cubeSize,p[2]-cubeSize],
			[p[0]+cubeSize,p[1]+cubeSize,p[2]-cubeSize],
			[p[0]-cubeSize,p[1]+cubeSize,p[2]+cubeSize],
			[p[0]-cubeSize,p[1]-cubeSize,p[2]+cubeSize],
			[p[0]+cubeSize,p[1]-cubeSize,p[2]+cubeSize],
			[p[0]+cubeSize,p[1]+cubeSize,p[2]+cubeSize]
		];

		/*Cube*/
		var cit = color_it % colors.length;
		drawPoly(context, [corners[4], corners[5], corners[6], corners[7]], camera, c1, s);
		drawPoly(context, [corners[0], corners[4], corners[7], corners[3]], camera, c2, s);
		drawPoly(context, [corners[6], corners[7], corners[3], corners[2]], camera, c3, s);
	}

	var drawShadows = function(context, p, c, s, cubeSize) {
		var shadowCorners = [
			[p[0]-cubeSize,-1,p[2]-cubeSize],
			[p[0]-cubeSize,-1,p[2]+cubeSize],
			[p[0]+cubeSize,-1,p[2]+cubeSize],
			[p[0]+cubeSize,-1,p[2]-cubeSize]
		];

		/*Shadow*/
		drawPoly(context, [shadowCorners[0], shadowCorners[1], shadowCorners[2], shadowCorners[3]], c, '#666', s);
	}

	var drawBoxHalf = function(context, c, s, first) {
		context.lineWidth = 1;
		context.strokeStyle = '#777';
		var corners = [
			[-1,-1,-1],
			[-1,1,-1],
			[1,1,-1],
			[1,-1,-1],
			[-1,-1,1],
			[-1,1,1],
			[1,1,1],
			[1,-1,1],
		];

		var lines;
		if (first) {
			lines = [
				[corners[0], corners[1]],
				[corners[1], corners[2]],
				[corners[2], corners[3]],
				[corners[3], corners[0]],
				[corners[0], corners[4]],
				[corners[1], corners[5]],
				[corners[4], corners[5]],
			];
		} else {
			lines = [
				[corners[5], corners[6]],
				[corners[6], corners[7]],
				[corners[7], corners[4]],
				[corners[2], corners[6]],
				[corners[3], corners[7]],
			];
		}

		for (var i in lines) {
			drawLine(context, lines[i][0], lines[i][1], c, s);
		}

		context.strokeStyle = 'none';
	}

	var clear = function(context, canvas) {
		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.restore();
	}

	if (this instanceof Chart) {

		var canvas = document.getElementById(elementId);
		var size = canvas.width / 4 ;
		var camera = [2, 2, -7];

		var context = canvas.getContext('2d');
		context.translate(canvas.width / 1.8, canvas.height / 2.2);

		clear(context, canvas);

		drawBoxHalf(context, camera, size, true);
		drawBoxHalf(context, camera, size, false);

		context.save();

		this.plotPoints = function(points, scale) {
			var canvas = document.getElementById(elementId);
			var context = canvas.getContext('2d');
			//context.translate(canvas.width / 1.8, canvas.height / 2.2);
			var size = canvas.width / 4 ;

			clear(context, canvas);
			drawBoxHalf(context, camera, size, true);
			for (var i = points.length - 1; i >= 0; i--) {
				var point = [points[i].point[0]*scale, points[i].point[1]*scale, points[i].point[2]*scale];
				var color = points[i].color_it;
				var point_size = points[i].point_size;
				drawShadows(context, point, camera, size, 0.03);
				drawCube(context, point, camera, size, point_size, 0.04);
			};
			drawBoxHalf(context, camera, size, false);

			context.save();
		};

	} else {
		return new Chart(elementId);
	}
}