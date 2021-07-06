// функции игры

export function loadingLogo(imagesArray) {
	// FIXME: возможно потом просто удалить функцию, если будет реализован imageLoader
	let imgLogo = new Image();
	imgLogo.src = 'assets/logo.png';

	imagesArray.logo = imgLogo;
}

export function checkAnswer(quest, answer) {
	if (quest.rightAnswer.toLowerCase() == answer.toLowerCase()) {
		quest.status = true;
	}
	else
		quest.status = false;
}

export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function restartGame(game, quests) {
	shuffle(quests);
	quests.forEach(element => element.status = null);
	game.finish = false;
	game.currentQuest = 0;
}
