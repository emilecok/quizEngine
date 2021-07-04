'use strict';

import config from '../config.json';
import gameData from '../gameData.json';

let DEBUG = true;
let canvas;
let context;
let cW;
let cH;
let landscape = true;

let button = null;

let dragging = false;

function mMove(e) {
	if (dragging) {
		point.pX = e.offsetX * cW / canvas.clientWidth | 0;
		point.pY = e.offsetY * cH / canvas.clientHeight | 0;
	};
}

function mDown(e) {
	dragging = true;
}

function mUp(e) {
	dragging = false;
}

function clearContext() {
	let graBack = context.createLinearGradient(cW / 2, 0, cW / 2, cH);
	graBack.addColorStop(0, config.scene.backGradient[0]);
	graBack.addColorStop(1, config.scene.backGradient[1]);
	context.fillStyle = graBack;
	context.fillRect(0, 0, cW, cH);
}

// Init
window.onload = function() {
	canvas = document.getElementById('game');
	context = canvas.getContext('2d');
	cW = canvas.width;
	cH = canvas.height;

	if (cW >= cH) {
		landscape = true;
	}
	else {
		landscape = false;
	}

	button = {
		info: { x: 10, y: cH - 80, w: 70, h: 70 },
		sfx: { x: cW - 80, y: cH - 80, w: 70, h: 70 },
	}

	window.requestAnimationFrame(gameLoop);
};

// GameLoop
function gameLoop(timeStamp) {
	update();
	draw();

	window.requestAnimationFrame(gameLoop);
}

function update() {
}

function draw() {
	clearContext();

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
	let graButton = context.createLinearGradient(0, 0, cW / 2, cH / 2);
	graButton.addColorStop(0, "#3fff7c");
	graButton.addColorStop(1, "#3ffbe0");
	context.fillStyle = graButton;

	function centerW(size) {
		return cW / 2 - size / 2;
	}
	function centerH(size) {
		return cH / 2 - size / 2;
	}

	context.fillRect(centerW(cW / 1.5), cH - 380, cW / 1.5, 50);
	context.fillRect(centerW(cW / 1.5), cH - 320, cW / 1.5, 50);
	context.fillRect(centerW(cW / 1.5), cH - 260, cW / 1.5, 50);
	context.fillRect(centerW(cW / 1.5), cH - 200, cW / 1.5, 50);

	context.strokeStyle = "navy";
    context.lineWidth = 2;

    context.strokeRect(centerW(cW / 1.5), cH - 380, cW / 1.5, 50);
	context.strokeRect(centerW(cW / 1.5), cH - 320, cW / 1.5, 50);
	context.strokeRect(centerW(cW / 1.5), cH - 260, cW / 1.5, 50);
	context.strokeRect(centerW(cW / 1.5), cH - 200, cW / 1.5, 50);

	context.font = "32px Ubuntu";
	context.textAlign = "center";
	context.fillStyle = "white";

	for (let i = 0; i < 4; i++) {
		switch(i) {
			case 0:
				context.fillText(gameData[0].answer[i], cW / 2, cH - 380 + 35);
				break;
			case 1:
				context.fillText(gameData[0].answer[i], cW / 2, cH - 320 + 35);
				break;
			case 2:
				context.fillText(gameData[0].answer[i], cW / 2, cH - 260 + 35);
				break;
			case 3:
				context.fillText(gameData[0].answer[i], cW / 2, cH - 200 + 35);
				break;
		}
	}


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
