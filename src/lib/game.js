// функции игры

import { shuffle } from './engine.js';

export function checkAnswer(quest, answer) {
	if (Array.isArray(quest.rightAnswer)) {
		let lowerCaseArray = [];

		quest.rightAnswer.forEach(item => lowerCaseArray.push(item.toLowerCase()))

		if (lowerCaseArray.includes(answer.toLowerCase())) {
			quest.status = true;
		}
		else {
			quest.status = false;
		}
	}
	else {
		if (quest.rightAnswer.toLowerCase() == answer.toLowerCase()) {
			quest.status = true;
		}
		else
			quest.status = false;
	}
}

export function restartGame(game, quests) {
	// shuffle quests and answers order
	shuffle(quests);
	quests.forEach(quest => {
		shuffle(quest.answer);
	});
	quests.forEach(element => element.status = null);

	// set new game vars
	game.finish = false;
	game.currentQuest = 0;
	game.showAlpha = 1;
}
