'use strict';

import config from '../config.json'; // game configuration
import gameData from '../gameData.json'; // game data

import { getMousePos, isInside } from './buttons.js';
import { clearContext, getCenterH, getCenterV } from './draw.js';

// Engine variables -------------------------------------
let DEBUG = true;
let canvas = null; // canvas id
let context = null; // context id
let cW = null; // canvas with
let cH = null; // canvas height
let orientation = null; // screen orientation
let button = null; // buttons array
let area = null; // game areas (buttons, images, etc.)

// Init -------------------------------------------------
window.onload = function() {
	// init canvas id and sizes
	canvas = document.getElementById('game');
	context = canvas.getContext('2d');
	cW = canvas.width;
	cH = canvas.height;

	// set screen orientation by carculate canvas width&height
	if (cW >= cH) {	orientation = true;	}
	else { orientation = false;	}

	area = {
		answerButtons: { x: 10, y: cH - 340, w: cW - 20, h: 250 },
	}

	button = {
		info: { x: 10, y: cH - 80, w: 70, h: 70 },
		sfx: { x: cW - 80, y: cH - 80, w: 70, h: 70 },
		// TODO: change data: to null
		answerButtons: [
			{ x: getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: "olololosdgsdggs" },
			{ x: getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: "null" },
			{ x: getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: "null" },
			{ x: getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: "null" },
		],
	}

	button.answerButtons.forEach(function callback(value, index, array) {
		if (index == 0)
			array[index].y = area.answerButtons.y;
		else
			array[index].y = array[index - 1].y + value.h + 15;
	});

	canvas.addEventListener('click', function(evt) {
		let mousePos = getMousePos(canvas, evt);

		// bet inscrease
		if (isInside(mousePos, button.info)) {
			console.log("info");
		}
	}, false);

	window.requestAnimationFrame(gameLoop);
};


// GameLoop ---------------------------------------------
function gameLoop(timeStamp) {
	update();
	draw();

	window.requestAnimationFrame(gameLoop);
}

// Game update func -------------------------------------
function update() {
}

// Draw to canvas func ----------------------------------
function draw() {
	clearContext(canvas, config); // flush?! canvas

	// draw game areas
	if (DEBUG) {
		context.strokeStyle = "red";
		context.lineWidth = 2;

		// answer buttons area
		if (orientation)
			// TODO: draw answer buttons area by landscape
			console.log('TODO: draw answer buttons area by landscape');
		else
			context.strokeRect(area.answerButtons.x, area.answerButtons.y,
				area.answerButtons.w, area.answerButtons.h);
	}

	// draw image ------------------------------------------
	// let imageSize = { w: 320, h: 140 };
	// let graImage = context.createLinearGradient(cW / 2 - imageSize.w / 2, cH / 2 - imageSize.h / 2, cW / 2 - imageSize.w / 2 + imageSize.w, cH / 2 - imageSize.h / 2 + imageSize.h);
	// graImage.addColorStop(0, "#ff4ba7");
	// graImage.addColorStop(1, "#ffda64");
	// context.fillStyle = graImage;
	// context.fillRect(cW / 2 - imageSize.w / 2, cH / 2 - imageSize.h / 2,
	// 	imageSize.w, imageSize.h);

	// draw quest ------------------------------------------
	context.font = "32px Ubuntu";
	context.textAlign = "center";
	context.fillStyle = "white";
	context.fillText(gameData[0].question, cW / 2, cH - 420);

	// draw buttons ------------------------------------------
	context.fillStyle = "yellow";

	for (let i = 0; i <= button.answerButtons.length - 1; i++) {
		context.fillRect(button.answerButtons[i].x, button.answerButtons[i].y,
			button.answerButtons[i].w, button.answerButtons[i].h);
	}

	context.font = "32px Ubuntu";
	context.textAlign = "center";
	context.fillStyle = "white";

	button.answerButtons.forEach(function callback(value) {
		//
		context.fillText(value.data, cW / 2, value.y + 35);
	});


	// UI ------------------------------------------
	context.fillStyle = "red";
	context.strokeStyle = "navy";
    context.lineWidth = 2;
	context.fillRect(button.info.x, button.info.y, button.info.w, button.info.h); // info button
	context.strokeRect(button.info.x, button.info.y, button.info.w, button.info.h); // info button
	context.fillRect(button.sfx.x, button.sfx.y, button.sfx.w, button.sfx.h); // sfx button
	context.strokeRect(button.sfx.x, button.sfx.y, button.sfx.w, button.sfx.h); // sfx button

	let q = 10;

	for (var i = 1; i <= q - 1; i++) {
		q[i];
	}
}
