// функции рисоввания

export function clearContext(canvas, color) {
	let cW = canvas.width;
	let cH = canvas.height;

	let context = canvas.getContext('2d');

	context.fillStyle = color;
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
