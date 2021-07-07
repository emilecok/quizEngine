'use strict';

// Import game configs and questsData -------------------
import config from './config.json'; // game configuration
import gameData from './gameData.json'; // game data

// Import engine libs -----------------------------------
import * as Engine from './engine.js';
import * as Buttons from './buttons.js';
import * as Draw from './draw.js';
import * as Music from './music.js';
import * as Areas from './areas.js';
import * as Game from './game.js';

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
let buttonsUi = {};
let music = {};

// Engine init ------------------------------------------
window.onload = function() {
	// init canvas id and sizes
	canvas = document.getElementById('game');
	context = canvas.getContext('2d');
	cW = canvas.width;
	cH = canvas.height;
	if (DEBUG)
		console.log(`Canvas size ${cW} x ${cH}`);

	// set screen orientation by carculate canvas width & height
	landscape_orientation = Engine.setOrientation(canvas)
	
	let imageLogo = new Image();
	imageLogo.src = "assets/logo.png";
	images.logo = imageLogo;

	let loadingImages = [];
	loadingImages.push(gameData.result.notPassed);
	loadingImages.push(gameData.result.passed);

	for (const [key, value] of Object.entries(gameData.questions)) {
		loadingImages.push(value.image);
	}

	Engine.imagePreloader(loadingImages, function() {
		game.loadedState = true;
		game.showAlpha = 1;
	});

	// TODO: rewrite playMusic() func
	music.music = new AudioContext() || new webkitAudioContext();
	Music.playMusic(config, music.music);

	game.showAlpha = null;
	game.showInfo = false;
	game.loadedState = false;
	game.finish = false;
	game.currentQuest = 0;

	// shuffle quests and first quest answers
	Engine.shuffle(gameData.questions);
	gameData.questions.forEach(quest => {
		Engine.shuffle(quest.answer);
	});
	
	// set all quest status 'not answered'
	gameData.questions.forEach(element => element.status = null);

	// set areas sizes
	areas = Areas.setAreas(canvas, landscape_orientation, images.logo);

	// hover by buttons
	canvas.addEventListener('mousemove', e => {
		let mousePos = Buttons.getMousePos(canvas, e);

		for (const [key, value] of Object.entries(buttonsUi)) {
			if (Buttons.isInside(mousePos, value)) {
				console.log("hover", key)
			}
		}
	}, false);

	// click by buttons
	canvas.addEventListener('click', e => {
		let mousePos = Buttons.getMousePos(canvas, e);

		if (game.loadedState) {
			for (const [key, value] of Object.entries(buttonsUi)) {
				if (Buttons.isInside(mousePos, value)) {
					// Music button
					if (key == "uiMusic") {
						music.music.suspend();

						if (music.music.state == "suspended") {
							music.music.resume();
						}
					}

					// Info button
					if (key == "uiInfo") {
						game.showInfo = true;
					}
				}
			}
		}

		for (const [key, value] of Object.entries(buttons)) {
			if (!game.finish && key != undefined) {
				if (Buttons.isInside(mousePos, value)) {
					Game.checkAnswer(gameData.questions[game.currentQuest], value.data);

					if (game.currentQuest < gameData.questions.length - 1) {
						game.currentQuest += 1;
					}
					else {
						game.finish = true;
						game.showAlpha = 1;
					}
				}
			}
		}

		if (game.finish && buttons.btnRestart != undefined) {
			if (Buttons.isInside(mousePos, buttons.btnRestart)) {
				Game.restartGame(game, gameData.questions);
				delete buttons.btnRestart;
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
	if (game.showAlpha >= 0) {
		game.showAlpha -= 0.01;
	}

	if (!game.loadedState) {
		if (areas.splash.pointer.position < areas.splash.border.w - 50 && areas.splash.pointer.direction) {
			areas.splash.pointer.position += 1;
		}
		else areas.splash.pointer.direction = false;

		if (!areas.splash.pointer.direction) {
			if (areas.splash.pointer.position <= 0)
				areas.splash.pointer.direction = true;

			areas.splash.pointer.position -= 1;
		}
	}

	if (game.loadedState && !game.finish) {
		buttons.answerButton0 = { x: Draw.getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: null };
		buttons.answerButton1 = { x: Draw.getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: null };
		buttons.answerButton2 = { x: Draw.getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: null };
		buttons.answerButton3 = { x: Draw.getCenterH(cW, cW / 1.5), y: 0, w: cW / 1.5, h: 50, data: null };

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

		buttonsUi.uiInfo = { x: areas.game.btnUi.x, y: areas.game.btnUi.y, w: areas.game.btnUi.h, h: areas.game.btnUi.h };
		buttonsUi.uiMusic = { x: areas.game.btnUi.w + areas.game.btnUi.x - areas.game.btnUi.h, y: areas.game.btnUi.y, w: areas.game.btnUi.h, h: areas.game.btnUi.h };
		buttonsUi.uiSfx = { x: areas.game.btnUi.w + areas.game.btnUi.x - (areas.game.btnUi.h * 2) - 10, y: areas.game.btnUi.y, w: areas.game.btnUi.h, h: areas.game.btnUi.h };
	}

	if (game.finish) {
		delete buttons.answerButton0;
		delete buttons.answerButton1;
		delete buttons.answerButton2;
		delete buttons.answerButton3;

		buttons.btnRestart = { x: Draw.getCenterH(cW, cW / 1.5), y: areas.finish.labelTotalInfo.y + areas.finish.labelTotalInfo.h + 20, w: cW / 1.5, h: 70, data: "Ответить на вопросы заново" };
	}
}

// Draw to canvas func ----------------------------------
function draw() {
	Draw.clearContext(canvas, config.colors.back); // clean canvas

	// render splash screen -----------------------------
	if (!game.loadedState) {
		context.drawImage(images.logo, Draw.getCenterH(cW, images.logo.width), Draw.getCenterV(cH, images.logo.height));

		context.font = "32px Yanone Kaffeesatz";
		context.textAlign = "center";
		context.fillStyle = "white";

		context.fillRect(areas.splash.pointer.position + areas.splash.border.x, areas.splash.border.y, 50, areas.splash.border.h);
		context.strokeRect(areas.splash.border.x, areas.splash.border.y,
			areas.splash.border.w, areas.splash.border.h);
	}

	// render game --------------------------------------
	if (!game.finish && game.loadedState) {
		// draw progress bar
		Draw.drawProgressBar(context, areas.game.questProgress, config.colors, gameData.questions);

		// draw quest image
		Draw.placeImage(canvas, areas.game.questImage,
			gameData.questions[game.currentQuest].image, config.colors);

		// draw question label
		Draw.drawQuestionLabel(canvas, areas.game.labelQuestion, gameData.questions[game.currentQuest].question);
		
		// draw answer buttons
		context.fillStyle = config.colors.buttonFill;
		context.strokeStyle = config.colors.buttonStroke;
		context.lineWidth = config.colors.strokeSize;
		
		let answerButtonsArray = [buttons.answerButton0, buttons.answerButton1,
			buttons.answerButton2, buttons.answerButton3];

		answerButtonsArray.forEach(function(btn) {
			context.fillRect(btn.x, btn.y, btn.w, btn.h);
			context.strokeRect(btn.x, btn.y, btn.w, btn.h);
		});

		// draw answer button label
		context.font = "32px Yanone Kaffeesatz";
		context.textAlign = "center";
		context.fillStyle = config.colors.buttonFont;

		answerButtonsArray.forEach(function callback(value) {
			context.fillText(value.data, cW / 2, value.y + 35);
		});

		// draw UI buttons
		context.fillStyle = config.colors.buttonFill;
		context.strokeStyle = config.colors.buttonStroke;
		context.lineWidth = config.colors.strokeSize;

		for (const [key, value] of Object.entries(buttonsUi)) {
			context.fillRect(value.x, value.y, value.w, value.h);
			context.strokeRect(value.x, value.y, value.w, value.h);
		}
	}

	// render result game -------------------------------
	if (game.finish) {
		// draw game name label
		context.font = "32px Yanone Kaffeesatz";
		context.textAlign = "center";
		context.fillStyle = "white";

		context.fillText(config['gameName'], cW / 2, areas.finish.labelFinishGameName.y + 25);

		/// draw finish game image
		let rightAnswer = 0;
		gameData.questions.forEach(element => element.status ? rightAnswer += 1 : null);
		let rightAnswerPercentage = Math.ceil(rightAnswer / gameData.questions.length * 100);

		let i = new Image();
		if (rightAnswerPercentage >= gameData.result.minRightAnswer) {
			i.src = `assets/images/${gameData.result.passed}`
		}
		else {
			i.src = `assets/images/${gameData.result.notPassed}`
		}

		context.drawImage(i, Draw.getCenterH(cW, i.width), areas.finish.image.y + areas.finish.image.h - i.height);

		// draw labelTotalAnswerRight
		context.font = "50px Yanone Kaffeesatz";
		context.fillText(`Результат: ${rightAnswer} из ${gameData.questions.length} ответов верны`, cW / 2, areas.finish.labelTotalAnswerRight.y + 45);
		

		// draw labelTotalAnswerPercent
		context.font = "75px Yanone Kaffeesatz";
		context.fillText(`Выполнено на ${rightAnswerPercentage}%`, cW / 2, areas.finish.labelTotalAnswerPercent.y + 65);

		// labelTotalInfo
		context.font = "50px Yanone Kaffeesatz";
		let resultInfo = null;

		for (const [key, value] of Object.entries(gameData.answerResult)) {
			if (key <= rightAnswerPercentage) {
				resultInfo = value;
			}
		}

		context.fillText(resultInfo, cW / 2, areas.finish.labelTotalInfo.y + 55);
		
		// draw btnRestart
		context.fillStyle = config.colors.buttonFill;
		context.strokeStyle = config.colors.buttonStroke;
		context.fillRect(buttons.btnRestart.x, buttons.btnRestart.y, buttons.btnRestart.w, buttons.btnRestart.h);
		context.strokeRect(buttons.btnRestart.x, buttons.btnRestart.y, buttons.btnRestart.w, buttons.btnRestart.h);

		context.font = "32px Yanone Kaffeesatz";
		context.textAlign = "center";
		context.fillStyle = config.colors.buttonFont;
		context.fillText(buttons.btnRestart.data, cW / 2, buttons.btnRestart.y + 43);
	}

	// draw game areas ----------------------------------
	if (DEBUG && !game.finish && game.loadedState) {
		Draw.drawGameAreas(context, areas.game);
	}
	else if (DEBUG && game.finish) {
		Draw.drawGameAreas(context, areas.finish);
	}

	// draw alpha animation -----------------------------
	if (game.showAlpha != null) {
		context.fillStyle =	`rgba(0,0,0,${game.showAlpha})`;
		context.fillRect(0, 0, cW, cH);
	}

	// draw info window [indev] -------------------------
	if (game.showInfo) {
		Draw.drawInfo(canvas, landscape_orientation);
	}
}
