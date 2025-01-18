class Obstacle {

    constructor(x, y, spawner) {

        this.x = x;

        this.y = y;

        this.size = spawner.size;
        //this.speed = (lowFrequencyEnergy / threshold) * 2;
        //this.direction = direction + Math.random() * 2 * (Math.PI);

        this.spawner = spawner;
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
        this.x += this.spawner.movementModifier * Math.cos(this.spawner.direction);
        this.y += this.spawner.movementModifier * Math.sin(this.spawner.direction);
    }

    draw() {

        fill(255);
        ellipse(this.x, this.y, this.size, this.size);

    }

}

class Spawner {

    movementModifier;
    direction;
    size;

    // Position of the circle, starts from 0.
    static index = 0;

    constructor() {
        Spawner.index += 1;
        console.log(Spawner.index);
    }

    drawInCircles(speed) {
        this.direction = ((Math.PI * 2) / 100) * Spawner.index;
        this.movementModifier = speed;
        this.size = speed + (windowWidth * 0.05) / 40;
    }


    drawInRandomDirection(speed) {
        this.direction = Math.random() * 2 * (Math.PI);
        this.movementModifier = speed;
        this.size = 10 + speed + (windowWidth * 0.05) / 15;
    }


}