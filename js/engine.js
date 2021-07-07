import config from '../app/config.json';

export function imagePreloader(images, callback) {
	let counter = 0;

	function onLoad() {
		counter += 1;
		if (counter == images.length) callback();
	}

	for (let i of images) {
		let img = document.createElement('img');
		img.onload = img.onerror = onLoad;
		img.src = `assets/images/${i}`;
	}
}

export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function setOrientation(canvas) {
	let landscape_orientation = null;

	if (canvas.width >= canvas.height) landscape_orientation = true;
	else landscape_orientation = false;
	
	if (config.debug)
		console.log(landscape_orientation ?
			'Canvas orientation set to landscape' :
			'Canvas orientation set to portrait');

	return landscape_orientation;
}
