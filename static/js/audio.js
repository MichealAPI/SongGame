async function generateObstacles(audioUrl) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Create source and analyser nodes
    const source = audioContext.createBufferSource();
    const analyser = audioContext.createAnalyser();

    source.buffer = audioBuffer;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 512; // Set FFT size for frequency resolution
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // Beat detection logic
    const sampleRate = audioContext.sampleRate;
    const duration = audioBuffer.duration;
    const beatMap = new Map();

    source.start();

    return new Promise((resolve) => {
        const interval = setInterval(() => {
            analyser.getByteFrequencyData(frequencyData);

            const currentTime = audioContext.currentTime;
            const second = Math.floor(currentTime);

            // Calculate energy in low-frequency range (e.g., below 150Hz)
            const lowFrequencyEnergy = frequencyData.slice(0, 10).reduce((a, b) => a + b, 0);

            // Detect beats by setting a threshold
            const threshold = 1000; // Adjust this threshold as needed
            if (lowFrequencyEnergy > threshold) {
                // If low-frequency is
                pushObstacle(lowFrequencyEnergy, threshold)
            }

            // Stop the interval when the audio ends
            if (currentTime >= duration) {
                clearInterval(interval);
                resolve(beatMap);
            }
        }, 1000 / 60); // Run 60 times per second for better resolution
    });
}

generateObstacles('static/audio/audio.mp3').then(() => {
    stopGame();
});

