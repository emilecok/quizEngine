'use strict';

import config from '../config.json'; // game configuration
import gameData from '../gameData.json'; // game data

import { getMousePos, isInside } from './buttons.js';
import { clearContext, getCenterH, getCenterV } from './draw.js';
import { clickAnswer, shuffleQuestAnswer } from './game.js';

// Engine variables -------------------------------------
let DEBUG = true;
let canvas = null; // canvas id
let context = null; // context id
let cW = null; // canvas with
let cH = null; // canvas height
let orientation = null; // screen orientation
let button = null; // buttons array
let area = null; // game areas (buttons, images, etc.)
let game = null;

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

	if (DEBUG) {
		console.log(`Loaded ${gameData.length} quests.`);
	}

	game = {
		// TODO: change quest by script
		questIndex: 0,
		quest: null,
		questImage: null,
		totalRightAnswers: 0, // количество правильных ответов
		scene: null,
	};
	shuffleQuestAnswer(gameData); // shuffle quest
	game.quest = gameData[game.questIndex];
	shuffleQuestAnswer(gameData[game.questIndex].answer); // shuffle first quest answers

	// присваем всем квестам статус не выполнен
	gameData.forEach(element => element.status = null);

	if (!orientation) {
		area = {
			answerButtons: { x: 10, y: cH - 340, w: cW - 20, h: 250 },
			questionLabel: { x: 10, y: cH - 340 - 80, w: cW - 20, h: 70 },
			uiButtons: { x: 10, y: cH - 80, w: cW - 20, h: 70 },
			questProgress: { x: 10, y: 10, w: cW - 20, h: 20 },
		}
		area.image = { x: 10, y: area.questProgress.y + area.questProgress.h + 10,
			w: cW - 20, h: area.questionLabel.y - area.questProgress.y - (area.questProgress.h * 2) };
	}
	// TODO: add areas for landscape mode

	button = {
		info: { x: 10, y: cH - 80, w: 70, h: 70 },
		sfx: { x: cW - 80, y: cH - 80, w: 70, h: 70 },
		// TODO: change data: to null
		answerButtons: [
			{ x: getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: null },
			{ x: getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: null },
			{ x: getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: null },
			{ x: getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: null },
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

		// click by first answer button
		if (isInside(mousePos, button.answerButtons[0])) {
			clickAnswer(gameData, game, button.answerButtons[0].data);
		}

		// click by second answer button
		if (isInside(mousePos, button.answerButtons[1])) {
			clickAnswer(gameData, game, button.answerButtons[1].data);
		}

		// click by third answer button
		if (isInside(mousePos, button.answerButtons[2])) {
			clickAnswer(gameData, game, button.answerButtons[2].data);
		}

		// click by four answer button
		if (isInside(mousePos, button.answerButtons[3])) {
			clickAnswer(gameData, game, button.answerButtons[3].data);
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
	// Update answer buttons label
	button.answerButtons.forEach(function callback(value, index) {
		value.data = game.quest.answer[index];
	});
}

// Draw to canvas func ----------------------------------
function draw() {
	clearContext(canvas, config); // flush?! canvas

	// draw question label
	context.font = "32px Ubuntu";
	context.textAlign = "center";
	context.fillStyle = "white";
	context.fillText(game.quest.question, cW / 2, area.questionLabel.y + 30);

	// draw answer buttons
	context.fillStyle = "purple";
	context.strokeStyle = "navy";
	context.lineWidth = 2;

	for (let i = 0; i <= button.answerButtons.length - 1; i++) {
		context.fillRect(button.answerButtons[i].x, button.answerButtons[i].y,
			button.answerButtons[i].w, button.answerButtons[i].h);
		context.strokeRect(button.answerButtons[i].x, button.answerButtons[i].y,
			button.answerButtons[i].w, button.answerButtons[i].h);
	}

	// draw answer button label
	context.font = "32px Ubuntu";
	context.textAlign = "center";
	context.fillStyle = "white";

	button.answerButtons.forEach(function callback(value) {
		context.fillText(value.data, cW / 2, value.y + 35);
	});

	// draw image
	game.questImage = new Image();
	game.questImage.src = 'assets/images/' + game.quest.image;

	// carculate image ratio by area.image size
	if (game.questImage.width >= game.questImage.height) {
		if (game.questImage.height > area.image.h) {
			let ratio = game.questImage.width / area.image.w;
			let newImageW = area.image.w / ratio;
			let newImageH = area.image.h;

			context.drawImage(game.questImage, getCenterH(cW, newImageW), area.image.y,
				newImageW, newImageH);
		}
		else {
			// TODO: draw image center
			// TODO: add option to sizeUp images to engine config
		}
	}
	else {
		let ratio = game.questImage.height / area.image.h;
		let newImageW = area.image.w / ratio;

		context.drawImage(game.questImage, getCenterH(cW, newImageW), area.image.y,
			newImageW, area.image.h);
	}

	// draw progress bar
	let sizeProgressItem = area.questProgress.w / gameData.length;

	context.strokeStyle = "black";

	for (let i = 0; i < gameData.length; i++) {
		// change progress item color by status answer
		switch (gameData[i].status) {
			case null:
				context.fillStyle = "gray";
				break;
			case true:
				context.fillStyle = "green";
				break;
			case false:
				context.fillStyle = "red";
				break;
		}

		context.fillRect(10 + (i * sizeProgressItem), 10, sizeProgressItem, 20);
		context.strokeRect(10 + (i * sizeProgressItem), 10, sizeProgressItem, 20);
	}

	// UI ------------------------------------------
	// TODO: переписать это всё г*
	context.fillStyle = "red";
	context.strokeStyle = "navy";
	context.lineWidth = 2;
	context.fillRect(button.info.x, button.info.y, button.info.w, button.info.h); // info button
	context.strokeRect(button.info.x, button.info.y, button.info.w, button.info.h); // info button
	context.fillRect(button.sfx.x, button.sfx.y, button.sfx.w, button.sfx.h); // sfx button
	context.strokeRect(button.sfx.x, button.sfx.y, button.sfx.w, button.sfx.h); // sfx button

	// draw game areas
	if (DEBUG) {
		context.strokeStyle = "red";
		context.lineWidth = 2;

		// answer buttons area
		if (orientation)
			// TODO: draw answer buttons area by landscape
			console.log('TODO: draw answer buttons area by landscape');
		else
			for (const [key, value] of Object.entries(area)) {
				context.strokeRect(value.x, value.y, value.w, value.h);
			}
	}
}
