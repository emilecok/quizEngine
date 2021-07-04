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
