import config from './config.json';

import * as Draw from './draw.js'

/**
 * Устанавливает размеры и положение зон для отрисовки
 * @param {Object} canvas
 * @param {Bool} landscape_orientation текущая ориентация игры
 * @param {Image} logoImage логотип
 * @return {Object} список зон
 */
export function setAreas(canvas, landscape_orientation, logoImage) {
	let areasArray = null;

	let cW = canvas.width;
	let cH = canvas.height;

	areasArray = { splash: {}, game: {}, finish: {} };

	if (!landscape_orientation) {
		areasArray.game = {
			btnAnswer: { x: 10, y: cH - 340, w: cW - 20, h: 250 },
			labelQuestion: { x: 10, y: cH - 340 - 80, w: cW - 20, h: 70 },
			btnUi: { x: 10, y: cH - 80, w: cW - 20, h: 70 },
			questProgress: { x: 10, y: 10, w: cW - 20, h: 20 },
		}
		areasArray.game.questImage = { x: 10, y: areasArray.game.questProgress.y + areasArray.game.questProgress.h + 10,
			w: cW - 20, h: areasArray.game.labelQuestion.y - areasArray.game.questProgress.y - (areasArray.game.questProgress.h * 2) };

		let progressBarHeight = cH - (Draw.getCenterV(cH, logoImage.height) + logoImage.height) > 301 ?
			Draw.getCenterV(cH, logoImage.height) + logoImage.height + 70 : cH - 70;

		areasArray.splash = {
			border: { x: Draw.getCenterH(cW, config.loaderWidth), y: progressBarHeight, w: config.loaderWidth, h: 20 },
			pointer: { position: 0, direction: true },
		}

		areasArray.finish.labelFinishGameName = { x: 10, y: 60, w: cW - 20, h: 30 };
		areasArray.finish.labelTotalAnswerPercent = { x: 10, y: Draw.getCenterV(cH, 80), w: cW - 20, h: 80 };
		areasArray.finish.labelTotalAnswerRight = { x: 10, y: areasArray.finish.labelTotalAnswerPercent.y - 70, w: cW - 20, h: 60 };
		areasArray.finish.labelTotalInfo = { x: 10, y: areasArray.finish.labelTotalAnswerPercent.y + areasArray.finish.labelTotalAnswerPercent.h + 10, w: cW - 20, h: 90 };
		areasArray.finish.image = { x: 10, y: areasArray.finish.labelFinishGameName.y + areasArray.finish.labelFinishGameName.h + 10, w: cW - 20, h: areasArray.finish.labelTotalAnswerRight.y - 20 - areasArray.finish.labelFinishGameName.y - areasArray.finish.labelFinishGameName.h };
	}
	else {
		// TODO: add areas for landscape mode
	}

	return areasArray;
}