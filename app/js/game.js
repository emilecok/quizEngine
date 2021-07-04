// функции игры

export function checkAnswer(question, answer) {
	if (question.rightAnswer.toLowerCase() == answer.toLowerCase())
		return true;
	else
		return false;
}

// передаёт следующий квест, либо возвращает окончание кввестов
export function nextQuest(questions, questIndex) {
	if (questIndex < questions.length - 1) {
		return questIndex += 1;
	}
	// TODO: make end quest return
}
