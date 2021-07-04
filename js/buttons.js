// функции обработки кнопок

export function getMousePos(canvas, event) {
	let rect = canvas.getBoundingClientRect();

	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top,
	};
}

export function isInside(mousePos, rect) {
	return mousePos.x > rect.x && mousePos.x < rect.x + rect.w && mousePos.y < rect.y + rect.h && mousePos.y > rect.y;
}
