# Survive the Song!

'Survive the Song' is a web-based game that uses audio analysis to generate obstacles in real-time. The player must avoid these obstacles to win the game.

## Features

- Real-time audio analysis
- Dynamic obstacle generation based on audio frequency
- Player movement using keyboard controls
- Simple and intuitive UI

## Technologies Used

- HTML
- CSS (Bootstrap)
- JavaScript
- p5.js for graphics
- Web Audio API for audio processing

## Setup

1. Clone the repository:
    ```sh
    git clone "https://github.com/MichealAPI/SongGame"
    ```

2. Navigate to the project directory:
    ```sh
    cd SongGame
    ```

3. Open `index.html` in your web browser to start the game.

## How to Play

1. Click the `Start` button to begin the game.
2. Use the `W`, `A`, `S`, `D` keys to move the player:
    - `W`: Move forward
    - `A`: Move left
    - `S`: Move back
    - `D`: Move right
3. Avoid the obstacles generated based on the audio frequency.
4. The game ends when the player collides with an obstacle or the audio track finishes.

## Project Structure

- `index.html`: The main HTML file that sets up the game interface.
- `static/js/game.js`: The main JavaScript file containing the game logic.
- `.idea/`: Directory containing project configuration files for IntelliJ IDEA.

## License

This project is licensed under the MIT License.