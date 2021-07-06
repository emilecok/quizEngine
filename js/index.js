'use strict';

import config from '../app/config.json'; // game configuration
import gameData from '../app/gameData.json'; // game data

import { getMousePos, isInside } from './buttons.js';
import { clearContext, getCenterH, getCenterV } from './draw.js';
import { loadingLogo, checkAnswer, shuffle } from './game.js';

// Engine variables -------------------------------------
const DEBUG = config.debug;
let canvas = null; // canvas id
let context = null; // context id
let cW = null; // canvas with
let cH = null; // canvas height
let landscape_orientation = null; // canvas orientation
let game = {}; // main game variable
let areas = { game: {}, finish: {} };
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
	shuffle(gameData.questions[game.currentQuest].answer); // shuffle first quest answers

	// присваем всем квестам статус не выполнен
	gameData.questions.forEach(element => element.status = null);

	// set areas sizes
	if (!landscape_orientation) {
		areas.game = {
			// { x: 0, y: 0, w: 0, h: 0 }
			btnAnswer: { x: 10, y: cH - 340, w: cW - 20, h: 250 },
			labelQuestion: { x: 10, y: cH - 340 - 80, w: cW - 20, h: 70 },
			btnUi: { x: 10, y: cH - 80, w: cW - 20, h: 70 },
			questProgress: { x: 10, y: 10, w: cW - 20, h: 20 },
		}
		areas.game.questImage = { x: 10, y: areas.game.questProgress.y + areas.game.questProgress.h + 10,
			w: cW - 20, h: areas.game.labelQuestion.y - areas.game.questProgress.y - (areas.game.questProgress.h * 2) };

		areas.finish.labelFinishGameName = { x: 10, y: 60, w: cW - 20, h: 30 };
		areas.finish.labelTotalAnswerPercent = { x: 10, y: getCenterV(cH, 80), w: cW - 20, h: 80 };
		areas.finish.labelTotalAnswerRight = { x: 10, y: areas.finish.labelTotalAnswerPercent.y - 70, w: cW - 20, h: 60 };
		areas.finish.labelTotalInfo = { x: 10, y: areas.finish.labelTotalAnswerPercent.y + areas.finish.labelTotalAnswerPercent.h + 10, w: cW - 20, h: 90 };
	}
	else {
		// TODO: add areas for landscape mode
	}

	// click by buttons?!
	canvas.addEventListener('click', function(evt) {
		let mousePos = getMousePos(canvas, evt);

		for (const [key, value] of Object.entries(buttons)) {
			if (isInside(mousePos, value)) {
				checkAnswer(gameData.questions[game.currentQuest], value.data);

				if (game.currentQuest < gameData.questions.length - 1) {
					game.currentQuest += 1;
				}
				else game.finish = true;
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
				array[index].y = areas.game.btnAnswer.y;
			else
				array[index].y = array[index - 1].y + value.h + 15;
		});

		// Update answer buttons label
		answerButtonsArray.forEach(function callback(value, index) {
			value.data = gameData.questions[game.currentQuest].answer[index];
		});
	}

	if (game.finish) {
		buttons.btnRestart = { x: getCenterH(cW, cW / 1.5), y: areas.finish.labelTotalInfo.y + areas.finish.labelTotalInfo.h + 20, w: cW / 1.5, h: 70, data: "Ответить на вопросы заново" };
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
		let sizeProgressItem = areas.game.questProgress.w / gameData.questions.length;

		context.strokeStyle = "black";

		for (let i = 0; i < gameData.questions.length; i++) {
			// change progress item color by status answer
			switch (gameData.questions[i].status) {
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
		context.font = "32px Yanone Kaffeesatz";
		context.textAlign = "center";
		context.fillStyle = "white";
		context.fillText(gameData.questions[game.currentQuest].question, cW / 2, areas.game.labelQuestion.y + 30);

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
		context.font = "32px Yanone Kaffeesatz";
		context.textAlign = "center";
		context.fillStyle = "white";

		answerButtonsArray.forEach(function callback(value) {
			context.fillText(value.data, cW / 2, value.y + 35);
		});
	}

	// render result game -------------------------------
	if (game.finish) {
		// draw game name label
		context.font = "32px Yanone Kaffeesatz";
		context.textAlign = "center";
		context.fillStyle = "white";

		context.fillText(config['gameName'], cW / 2, areas.finish.labelFinishGameName.y + 25);

		// draw labelTotalAnswerRight :FIXME:
		
		let rightAnswer = 0;
		gameData.questions.forEach(element => element.status ? rightAnswer += 1 : null);
		context.font = "50px Yanone Kaffeesatz";
		context.fillText(`Вы ответили правильно на ${rightAnswer} из ${gameData.questions.length} вопросов`, cW / 2, areas.finish.labelTotalAnswerRight.y + 45);
		

		// draw labelTotalAnswerPercent
		let rightAnswerPercentage = Math.ceil(rightAnswer / gameData.questions.length * 100);
		context.font = "75px Yanone Kaffeesatz";
		context.fillText(`${rightAnswerPercentage}%`, cW / 2, areas.finish.labelTotalAnswerPercent.y + 65);

		// labelTotalInfo
		context.font = "50px Yanone Kaffeesatz";
		let resultInfo = null;

		// for (let i = gameData.answerResult.length - 1; i >= 0; i--) {
		// 	if (rightAnswerPercentage > gameData.answerResult[i]) {
		// 		resultInfo = gameData.answerResult[i];
		// 	}
		// }
		for (const [key, value] of Object.entries(gameData.answerResult)) {
			if (key <= rightAnswerPercentage) {
				resultInfo = value;
			}
		}

		context.fillText(resultInfo, cW / 2, areas.finish.labelTotalInfo.y + 55);
		
		// draw btnRestart
		context.fillStyle = "purple";
		context.strokeStyle = "navy";
		context.fillRect(buttons.btnRestart.x, buttons.btnRestart.y, buttons.btnRestart.w, buttons.btnRestart.h);
		context.strokeRect(buttons.btnRestart.x, buttons.btnRestart.y, buttons.btnRestart.w, buttons.btnRestart.h);

		context.font = "32px Yanone Kaffeesatz";
		context.textAlign = "center";
		context.fillStyle = "white";
		context.fillText(buttons.btnRestart.data, cW / 2, buttons.btnRestart.y + 43);
	}
	// draw game areas ----------------------------------
	if (DEBUG && !game.finish && game.loadedState) {
		context.strokeStyle = "red";
		context.lineWidth = 1;

		if (landscape_orientation)
			// TODO: draw areas by landscape
			console.log('TODO: draw answer buttons area by landscape');
		else
			for (const [key, value] of Object.entries(areas.game)) {
				context.strokeRect(value.x, value.y, value.w, value.h);
			}
	}
	else if (DEBUG && game.finish) {
		context.strokeStyle = "red";
		context.lineWidth = 1;

		if (landscape_orientation)
			// TODO: draw areas by landscape
			console.log('TODO: draw answer buttons area by landscape');
		else
			for (const [key, value] of Object.entries(areas.finish)) {
				context.strokeRect(value.x, value.y, value.w, value.h);
			}
	}
}
