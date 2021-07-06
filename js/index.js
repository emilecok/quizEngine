'use strict';

import config from '../app/config.json'; // game configuration
import gameData from '../app/gameData.json'; // game data

import { getMousePos, isInside } from './buttons.js';
import { clearContext, getCenterH, getCenterV } from './draw.js';
import { loadingLogo, clickAnswer, shuffle } from './game.js';

// Engine variables -------------------------------------
const DEBUG = config.debug;
let canvas = null; // canvas id
let context = null; // context id
let cW = null; // canvas with
let cH = null; // canvas height
let landscape_orientation = null; // canvas orientation
let game = {}; // main game variable
let areas = null;
let images = {};
let buttons = {};


// Init -------------------------------------------------
window.onload = function() {
	// init canvas id and sizes
	canvas = document.getElementById('game');
	context = canvas.getContext('2d');
	cW = canvas.width;
	cH = canvas.height;
	if (DEBUG)
		console.log(`Canvas size ${cW} x ${cH}`);

	// set screen orientation by carculate canvas width & height
	if (cW >= cH) { landscape_orientation = true; }
	else { landscape_orientation = false; }
	if (DEBUG)
		console.log(landscape_orientation ? "Canvas orientation set to landscape" : "Canvas orientation set to portrait");

	loadingLogo(images);

	game.loadedState = false;
	game.finish = false;
	game.currentQuest = 0;

	shuffle(gameData); // shuffle quests
	shuffle(gameData[game.currentQuest].answer); // shuffle first quest answers

	// присваем всем квестам статус не выполнен
	gameData.forEach(element => element.status = null);

	if (!landscape_orientation) {
		areas = {
			btnAnswer: { x: 10, y: cH - 340, w: cW - 20, h: 250 },
			labelQuestion: { x: 10, y: cH - 340 - 80, w: cW - 20, h: 70 },
			btnUi: { x: 10, y: cH - 80, w: cW - 20, h: 70 },
			questProgress: { x: 10, y: 10, w: cW - 20, h: 20 },
		}
		areas.questImage = { x: 10, y: areas.questProgress.y + areas.questProgress.h + 10,
			w: cW - 20, h: areas.labelQuestion.y - areas.questProgress.y - (areas.questProgress.h * 2) };
	}
	// TODO: add areas for landscape mode

	canvas.addEventListener('click', function(evt) {
		let mousePos = getMousePos(canvas, evt);

		// if (isInside(mousePos, button.info)) {
		// 	console.log("info");
		// }

		for (const [key, value] of Object.entries(buttons)) {
			if (isInside(mousePos, value)) {
				console.log(`click on ${key}`);
			}
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
	// progressBar %percentage updater
	// and set gameStateLoaded true
	if (!game.loadedState && game.loadingProgress <= 99) {
		// TODO: реализовать функционал проверки загрузки изображений and fonts
		if (DEBUG) game.loadingProgress += 10; // FIXME: костыль
		else game.loadingProgress += 1;
	}
	else if (game.loadingProgress == 100)
		game.loadedState = true;

	if (game.loadedState && !game.finish) {
		buttons.answerButton0 = { x: getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: null };
		buttons.answerButton1 = { x: getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: null };
		buttons.answerButton2 = { x: getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: null };
		buttons.answerButton3 = { x: getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: null };

		let answerButtonsArray = [buttons.answerButton0, buttons.answerButton1,
			buttons.answerButton2, buttons.answerButton3];

		answerButtonsArray.forEach(function callback(value, index, array) {
			if (index == 0)
				array[index].y = areas.btnAnswer.y;
			else
				array[index].y = array[index - 1].y + value.h + 15;
		});

		// Update answer buttons label
		answerButtonsArray.forEach(function callback(value, index) {
			value.data = gameData[game.currentQuest].answer[index];
		});
	}
}

// Draw to canvas func ----------------------------------
function draw() {
	clearContext(canvas); // clean canvas

	// render splash screen -----------------------------
	if (!game.loadedState) {
		// TODO: change if(! to NaN check
		if (!game.loadingProgress) {
			game.loadingProgress = 0;
		}

		context.drawImage(images.logo, getCenterH(cW, images.logo.width), getCenterV(cH, images.logo.height));

		// TODO: check loadedState to final loading game
		context.strokeStyle = "black";
		context.lineWidth = 2;
		context.fillStyle = "yellow";

		// FIXME: translate to English
		// если расстояние от нижнего края картинки до конца канваса меньше ???
		// то рисуем прогрессбар от нижнего края 
		// если больше, то на расстояние от картинки
		let progressBarHeight = cH - (getCenterV(cH, images.logo.height) + images.logo.height) > 301 ?
			getCenterV(cH, images.logo.height) + images.logo.height + 70 : cH - 70;

		context.fillRect(50, progressBarHeight, ((cW - 100) / 100 * game.loadingProgress), 20);
		context.strokeRect(50, progressBarHeight, cW - 100, 20);
	}

	// render game --------------------------------------
	if (!game.finish && game.loadedState) {
		// draw progress bar
		let sizeProgressItem = areas.questProgress.w / gameData.length;

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

		// draw question label
		context.font = "32px Ubuntu";
		context.textAlign = "center";
		context.fillStyle = "white";
		context.fillText(gameData[game.currentQuest].question, cW / 2, areas.labelQuestion.y + 30);

		// draw answer buttons
		context.fillStyle = "purple";
		context.strokeStyle = "navy";
		context.lineWidth = 2;
		
		let answerButtonsArray = [buttons.answerButton0, buttons.answerButton1,
			buttons.answerButton2, buttons.answerButton3];

		answerButtonsArray.forEach(function(btn) {
			context.fillRect(btn.x, btn.y, btn.w, btn.h);
			context.strokeRect(btn.x, btn.y, btn.w, btn.h);
		});

		// draw answer button label
		context.font = "32px Ubuntu";
		context.textAlign = "center";
		context.fillStyle = "white";

		answerButtonsArray.forEach(function callback(value) {
			context.fillText(value.data, cW / 2, value.y + 35);
		});
	}

	// render result game -------------------------------
	if (game.finish) {
		// 
	}

	// draw game areas ----------------------------------
	if (DEBUG && !game.finish && game.loadedState) {
		context.strokeStyle = "red";
		context.lineWidth = 1;

		// answer buttons area
		if (landscape_orientation)
			// TODO: draw answer buttons area by landscape
			console.log('TODO: draw answer buttons area by landscape');
		else
			for (const [key, value] of Object.entries(areas)) {
				context.strokeRect(value.x, value.y, value.w, value.h);
			}
	}
}
