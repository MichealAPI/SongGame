const startBtn = document.getElementById('startBtn');
const warningText = document.getElementById('result');
let isGameRunning = false;
let audioContext;
let source;
let interval;
let player;
let obstacleList = [];

startBtn.addEventListener('click', () => {
    startGame();
    startBtn.disabled = true;
});

function startGame() {
    isGameRunning = true;

    generateObstacles('static/audio/eminem-rap-god.mp3').then(() => {
        won();
    });
}

function stopGame() {

    isGameRunning = false;
    noLoop();
    setup();
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
    const analyser = audioContext.createAnalyser();

    source.buffer = audioBuffer;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 512;
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    const sampleRate = audioContext.sampleRate;
    const duration = audioBuffer.duration;
    const beatMap = new Map();

    source.start();

    return new Promise((resolve) => {
        interval = setInterval(() => {
            analyser.getByteFrequencyData(frequencyData);

            const currentTime = audioContext.currentTime;
            const second = Math.floor(currentTime);

            const lowFrequencyEnergy = frequencyData.slice(0, 10).reduce((a, b) => a + b, 0);

            const threshold = 1200;
            if (lowFrequencyEnergy > threshold) {
                pushObstacle(lowFrequencyEnergy, threshold);
            }

            if (currentTime >= duration) {
                clearInterval(interval);
                resolve(beatMap);
            }
        }, 1000 / 60);
    });
}

function setup() {

    frameRate(60);
    createCanvas(500, 800);
    background(0);

    this.defaultDirection = Math.PI;

    player = new Player();

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

function pushObstacle(lowEnergy, threshold) {

    let obstacle = new Obstacle(lowEnergy, threshold, this.defaultDirection);

    this.defaultDirection -= 0.1;

    if (this.defaultDirection < 0) {
        this.defaultDirection = Math.PI;
    }


    obstacleList.push(obstacle);

}

class Player {

    constructor() {

        this.x = 250;
        this.y = 700;
        this.size = 15;
        this.speed = 7;

    }

    draw() {

        fill(255, 0, 0);
        rect(this.x, this.y, this.size, this.size);

    }

    moveLeft() {
        this.x = max(0, this.x - this.speed);
    }

    moveRight() {
        this.x = min(width - this.size, this.x + this.speed);
    }

    moveBack() {
        this.y = min(height - this.size, this.y + this.speed);
    }

    moveForward() {
        this.y = max(0, this.y - this.speed);
    }

}

class Obstacle {

    constructor(lowFrequencyEnergy, threshold, direction) {

        this.x = 250;

        this.y = 30;

        this.size = 10 + lowFrequencyEnergy / threshold;
        this.speed = (lowFrequencyEnergy / threshold) * 2;
        this.direction = direction + Math.random() * 2 * (Math.PI);
    }

    hasCollided() {
        return this.x < player.x + player.size &&
            this.x + this.size > player.x &&
            this.y < player.y + player.size &&
            this.y + this.size > player.y;

    }

    isOutside() {

        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;

    }

    move() {

        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);

    }

    draw() {

        fill(255);
        ellipse(this.x, this.y, this.size, this.size);

    }

}