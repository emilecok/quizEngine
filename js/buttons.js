// функции обработки кнопок

/**
 * Возвращает координаты позичии курсора
 * @param {Object} canvas canvas с которого считывается позиция курсора
 * @param {Event} event
 * @return {Object} координаты X, Y положения курсора на canvas
 */
export function getMousePos(canvas, event) {
	let rect = canvas.getBoundingClientRect();

	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top,
	};
}

/**
 * Проверяет положение курсора в области объекта
 * @param {Object} mousePos { x:, y: } курсора мыши
 * @param {Object} rect квадратная область 
 * @return {Bool} 
 */
export function isInside(mousePos, rect) {
	return mousePos.x > rect.x && mousePos.x < rect.x + rect.w && mousePos.y < rect.y + rect.h && mousePos.y > rect.y;
}
