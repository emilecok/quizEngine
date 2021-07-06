// функции рисоввания

export function clearContext(canvas) {
	// var:canvas -- канвас, на котором рисуем
	let cW = canvas.width;
	let cH = canvas.height;

	let context = canvas.getContext('2d');

	let graBack = context.createLinearGradient(cW / 2, 0, cW / 2, cH);
	// graBack.addColorStop(0, config.scene.backGradient[0]);
	// graBack.addColorStop(1, config.scene.backGradient[1]);
	// context.fillStyle = graBack;
	context.fillStyle = "#444444";
	context.fillRect(0, 0, cW, cH);
}

export function placeImage(canvas, area, image) {
	let context = canvas.getContext('2d');

	if (image.width >= image.height) {
		if (image.width > area.w) {
			let newImageW = area.w;
			let newImageH = image.height * (area.h / newImageW);

			if (newImageH > area.h) {
				newImageH = area.h;
				// BUG: ...
				newImageW = image.width * (area.h / image.height);
				context.drawImage(image, getCenterH(canvas.width, newImageW), area.y, newImageW, newImageH);
			}
			else {
				context.drawImage(image, area.x, getCenterV(canvas.height - area.h + area.y, newImageH), newImageW, newImageH);
			}
		}
	}
	else {
		let newImageH = area.h;
		let newImageW = image.width * (area.h / image.height);
		context.drawImage(image, getCenterH(canvas.width, newImageW), area.y, newImageW, newImageH);
	}
}

export function getCenterH(canvasWidth, objectWidth) {
	return canvasWidth / 2 - objectWidth / 2;
}

export function getCenterV(canvasHeight, objectHeight) {
	return canvasHeight / 2 - objectHeight / 2;
}
