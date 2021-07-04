// функции игры

export function checkAnswer(question, answer) {
	if (question.rightAnswer.toLowerCase() == answer.toLowerCase())
		return true;
	else
		return false;
}
