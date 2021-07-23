// функции рисоввания

export function clearContext(canvas, color) {
	let cW = canvas.width;
	let cH = canvas.height;

	let context = canvas.getContext('2d');

	context.fillStyle = color;
	context.fillRect(0, 0, cW, cH);
}

export function placeImage(canvas, area, imageFile, colors) {
	let context = canvas.getContext('2d');

	let image = new Image();
	image.src = `assets/images/${imageFile}`;

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

export function drawGameAreas(context, areas) {
	context.strokeStyle = "#ff0000";
	context.lineWidth = 1;

	for (const [key, value] of Object.entries(areas)) {
		context.strokeRect(value.x, value.y, value.w, value.h);
	}
}

export function drawInfo(canvas, landscape_orientation) {
	let cW = canvas.width;
	let cH = canvas.height;
	let context = canvas.getContext('2d');

	console.log("INFO");

	context.fillStyle = 'rgba(0,0,0,.8)';
	context.fillRect(0, 0, cW, cH);

	// if(!landscape_orientation) {
		context.fillStyle = '#000000';
		context.fillRect(80, 80, cW - 160, cH - 160);
	// }
}

export function drawProgressBar(context, area, colors, questions) {
	let sizeProgressItem = area.w / questions.length;

	context.strokeStyle = colors.strokeSize;

	for (let i = 0; i < questions.length; i++) {
		switch (questions[i].status) {
			case null:
				context.fillStyle = colors.answer.notPassed;
				break;
			case true:
				context.fillStyle = colors.answer.right;
				break;
			case false:
				context.fillStyle = colors.answer.wrong;
				break;
		}

		context.fillRect(10 + (i * sizeProgressItem), 10, sizeProgressItem, 20);
		context.strokeRect(10 + (i * sizeProgressItem), 10, sizeProgressItem, 20);
	}
}

export function drawQuestionLabel(canvas, area, questLabel) {
	let context = canvas.getContext('2d');

	context.font = '32px Yanone Kaffeesatz';
	context.textAlign = 'center';
	context.fillStyle = '#ffffff';

	context.fillText(questLabel, canvas.width / 2, area.y + 30);
}
