class Player {

    constructor(x, y) {

        this.x = x;
        this.y = y;
        this.size = 10 + (windowWidth * 0.01) / 30;
        this.speed = 7  + (windowWidth * 0.01) / 30;

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


    isOutside() {

        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;

    }

}
