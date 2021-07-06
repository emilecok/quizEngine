// функции игры

export function loadingLogo(imagesArray) {
	// FIXME: возможно потом просто удалить функцию, если будет реализован imageLoader
	let imgLogo = new Image();
	imgLogo.src = 'assets/logo.png';

	imagesArray.logo = imgLogo;
}

export function clickAnswer(questions, game, answer) {
	if (questions[game.questIndex].rightAnswer.toLowerCase() == answer.toLowerCase()) {
		questions[game.questIndex].status = true;
		game.totalRightAnswers += 1;
	}
	else
		questions[game.questIndex].status = false;

	if (game.questIndex < questions.length - 1) {
		game.quest = questions[game.questIndex += 1]; // костыль
		shuffleQuestAnswer(questions[game.questIndex].answer);
		return true;
	}
	else {
		return false;
	}
}

export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
