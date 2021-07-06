export function playMusic(config, music) {
	let request = new XMLHttpRequest();

	request.open("GET", `assets/sfx/${config.music}`, true);
    request.responseType = "arraybuffer";
    request.onload = function() {
        music.decodeAudioData(request.response, onDecoded);
    }
    
    function onDecoded(buffer) {
        let bufferSource = music.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(music.destination);
        bufferSource.loop = true;
    	bufferSource.start();
    }
    
    request.send();
}
