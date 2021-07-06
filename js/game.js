// функции игры

export function imagePreloader(images, callback) {
	let counter = 0;

	// norm
	function onLoad() {
		counter += 1;
		if (counter == images.length) callback();
	}

	let assetsDiv = document.getElementById("assets");

	for (let i of images) {
		let img = document.createElement('img');
		img.onload = img.onerror = onLoad;
		img.src = `assets/images/${i}`;
	}
}

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
	game.showAlpha = 1;
}
