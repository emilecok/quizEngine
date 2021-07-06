export function playMusic(config, music) {
	let request = new XMLHttpRequest();

	request.open("GET", `assets/sfx/${config.music.src}`, true);
    request.responseType = "arraybuffer";
    request.onload = function(){
        music.decodeAudioData(request.response, onDecoded);
    }
    
    function onDecoded(buffer) {
        var bufferSource = music.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(music.destination);
        bufferSource.loop = true;

        if (config.music.autoplay)
        	bufferSource.start();
    }
    
    request.send();
}
