// функции игры

// передаёт следующий квест, либо возвращает окончание кввестов
export function nextQuest(questions, questIndex, answer) {
	if (questions[questIndex].rightAnswer.toLowerCase() == answer.toLowerCase())
		questions[questIndex].status = true;
	else
		questions[questIndex].status = false;

	if (questIndex < questions.length - 1) {
		return true;
	}
	else {
		return false;
	}
}

export function shuffleQuestAnswer(answers) {
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }
}
