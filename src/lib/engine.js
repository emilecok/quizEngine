import config from '../config.json';

/**
 * Функция, которая загружает изображения в документ
 * и по завершению выполнятся callback() функция
 * @param {Array} images массив с именами файлов
 * @param {Function} callback callback() функция
 */
export function imagePreloader(images, callback) {
	// TODO: check file exist
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

/**
 * Функция случайным образом перемешивает массив
 * @param {Array} array массив, элементы которого будут перемешаны
 */
export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 
/**
 * Функция возвращает ориентацию игры в зависимости от размера canvas
 * @param {Object} canvas canvas object
 * @return {Bool} значение, которое присвается landscape_orientation в index.js
 */
export function setOrientation(canvas) {
	let landscape_orientation = null;

	if (canvas.width >= canvas.height) landscape_orientation = true;
	else landscape_orientation = false;
	
	if (config.debug)
		console.log(landscape_orientation ?
			'Set game orientation to landscape' :
			'Set game orientation to portrait');

	return landscape_orientation;
}
