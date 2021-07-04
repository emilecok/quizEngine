// функции рисоввания

export function clearContext(canvas, config) {
	// var:canvas -- канвас, на котором рисуем
	// var:config -- используется для получения цветов фона градиента сцены
	let cW = canvas.width;
	let cH = canvas.height;

	let context = canvas.getContext('2d');

	let graBack = context.createLinearGradient(cW / 2, 0, cW / 2, cH);
	graBack.addColorStop(0, config.scene.backGradient[0]);
	graBack.addColorStop(1, config.scene.backGradient[1]);
	context.fillStyle = graBack;
	context.fillRect(0, 0, cW, cH);
}

export function getCenterH(canvasWidth, objectWidth) {
	return canvasWidth / 2 - objectWidth / 2;
}

export function getCenterV(canvasHeight, objectHeight) {
	return canvasHeight / 2 - objectHeight / 2;
}
