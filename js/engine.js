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
