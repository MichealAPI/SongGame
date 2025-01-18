const startBtn = document.getElementById('startBtn');
const warningText = document.getElementById('result');
const selector = document.getElementById('music-selector');
const volumeSlider = document.getElementById('volume-slider');

let isGameRunning = false;
let audioContext;
let source;
let interval;
let player;
let obstacleList = [];
let gainNode;
let drawMode = 'circle';

volumeSlider.addEventListener('input', () => {
    if (gainNode) {
        gainNode.gain.value = volumeSlider.value;
    }
});

startBtn.addEventListener('click', () => {

    if (selector.value === 'empty') {
        alert('Please select a music');
        return;
    }

    startGame();
    startBtn.disabled = true;
});

function startGame() {
    isGameRunning = true;
    generateObstacles(`static/audio/${selector.value}.mp3`).then(() => {
        won();
    });
}

function stopGame() {

    isGameRunning = false;
    loop();

    if (interval) {
        clearInterval(interval);
    }
    if (source) {
        source.stop();
    }
    if (audioContext) {
        audioContext.close();
    }

    startBtn.disabled = false;
}

function lose() {
    stopGame();
    warningText.classList.add('text-danger');
    warningText.innerText = "You lost!";
}

function won() {
    stopGame();
    warningText.classList.add('text-success');
    warningText.innerText = "You won!";
}

async function generateObstacles(audioUrl) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    source = audioContext.createBufferSource();
    gainNode = audioContext.createGain();
    const analyser = audioContext.createAnalyser();

    source.buffer = audioBuffer;
    source.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 512;
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    const duration = audioBuffer.duration;

    source.start();

    return new Promise((resolve) => {
        interval = setInterval(() => {
            analyser.getByteFrequencyData(frequencyData);

            const currentTime = audioContext.currentTime;

            const lowFrequencyEnergy = frequencyData.slice(0, 10).reduce((a, b) => a + b, 0);

            const threshold = 1200;
            if (lowFrequencyEnergy > threshold) {
                pushObstacle(lowFrequencyEnergy, threshold);
            }

            if (currentTime >= duration) {
                clearInterval(interval);
                resolve();
            }
        }, 1000 / 60);
    });
}

function setup() {

    frameRate(60);

    let gameCanvas = createCanvas(windowWidth * 0.7, windowHeight * 0.7);
    gameCanvas.parent('game');

    background(0);

    this.defaultDirection = Math.PI;

    let playerX = (windowWidth * 0.7) / 2;
    let playerY = (windowHeight * 0.7) - (windowHeight * 0.7) / 10;

    player = new Player(playerX, playerY);

    document.addEventListener('keydown', (event) => {

        switch(event.key) {

            case 'w':
                player.moveForward();
                break;
            case 'a':
                player.moveLeft();
                break;
            case 's':
                player.moveBack();
                break;
            case 'd':
                player.moveRight();
                break;

        }

    });

}

function draw() {

    background(0);

    player.draw();

    for (let obstacle of obstacleList) {

        if (obstacle.isOutside()) {

            obstacleList.splice(obstacleList.indexOf(obstacle), 1);
            continue;
        }

        if (obstacle.hasCollided() && isGameRunning) {

            lose();

            break;

        }


        obstacle.move();
        obstacle.draw();

    }

}

function windowResized() {
    resizeCanvas(windowWidth * .7, windowHeight * .7);

    if(player.isOutside()) {
        player.x = windowWidth * .7 / 2;
        player.y = windowHeight * .7 - windowHeight * .7 / 10;
    }

}

function toggleDrawMode() {
    drawMode = drawMode === 'circle' ? 'random' : 'circle';
}


function pushObstacle(lowEnergy, threshold) {
    let obstacleX = (windowWidth * 0.7) / 2;
    let obstacleY = (windowHeight * 0.7) / 10;

    let spawner = new Spawner(1);
    if (drawMode === 'circle') {
        spawner.drawInCircles((lowEnergy / threshold) * 2);
    } else {
        spawner.drawInRandomDirection((lowEnergy / threshold) * 2);
    }

    let obstacle = new Obstacle(obstacleX, obstacleY, spawner);

    this.defaultDirection -= 0.1;

    if (this.defaultDirection < 0) {
        this.defaultDirection = Math.PI;
    }

    obstacleList.push(obstacle);
}


// Scheduler for changing obstacles

setInterval(() => {
    toggleDrawMode();
}, 5000);


