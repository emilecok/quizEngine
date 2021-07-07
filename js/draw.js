// функции рисоввания

export function clearContext(canvas, color) {
	let cW = canvas.width;
	let cH = canvas.height;

	let context = canvas.getContext('2d');

	context.fillStyle = color;
	context.fillRect(0, 0, cW, cH);
}

export function placeImage(canvas, area, image, colors) {
	let context = canvas.getContext('2d');

	context.strokeStyle = colors.buttonStroke;
	context.lineWidth = colors.strokeSize;

	if (image.width >= image.height) {
		if (image.width > area.w) {
			let newImageW = area.w;
			let newImageH = image.height / (image.width / area.w);
			
			context.drawImage(image, getCenterH(canvas.width, newImageW), area.y, newImageW, newImageH);
			context.strokeRect(getCenterH(canvas.width, newImageW), area.y, newImageW, newImageH);
		}
		else {
			// TODO: getCenterV({this}) <= need plus progressBar sizes
			context.drawImage(image, getCenterH(canvas.width, image.width), getCenterV(canvas.height / 2 + area.y, image.height), image.width, image.height);
			context.strokeRect(getCenterH(canvas.width, image.width), getCenterV(canvas.height / 2 + area.y, image.height), image.width, image.height);
		}
	}
	else {
		let newImageH = area.h;
		let newImageW = image.width * (area.h / image.height);
		context.drawImage(image, getCenterH(canvas.width, newImageW), area.y, newImageW, newImageH);
		context.strokeRect(getCenterH(canvas.width, newImageW), area.y, newImageW, newImageH);
	}
}

export function getCenterH(canvasWidth, objectWidth) {
	return canvasWidth / 2 - objectWidth / 2;
}

export function getCenterV(canvasHeight, objectHeight) {
	return canvasHeight / 2 - objectHeight / 2;
}
