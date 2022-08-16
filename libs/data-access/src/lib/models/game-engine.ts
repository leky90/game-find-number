import { GameSettings } from '../constants/game-settings';
import BallFactory from '../factories/ball-factory';
import Ball from './ball';
import { GameStatus } from './game-system';
import { Mouse } from './mouse';

export interface GameEngineProps {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
}

export class GameEngine {
    #canvas: HTMLCanvasElement;
    #context: CanvasRenderingContext2D | null;
    #mouse: Mouse;
    #balls: Array<Ball> = [];
    #currentIndex = 0;
    #currentFrame = 0;
    #time = 0;
    #timer: number | undefined;

    constructor({ canvas }: GameEngineProps) {
        this.#canvas = canvas;
        this.#context = this.#canvas.getContext('2d');
        this.#mouse = { x: 0, y: 0 };
        this.#currentIndex = 0;
        this.#time = 0;
        this.#timer = 0;
    }

    setCurrentIndex(index: number) {
        this.#currentIndex = index;
    }

    getCurrentIndex() {
        return this.#currentIndex;
    }

    getBalls() {
        return this.#balls;
    }

    getCanvas() {
        return this.#canvas;
    }

    getMouse() {
        return this.#mouse;
    }

    getTime() {
        return this.#time
    }

    render(status: GameStatus) {
        if (status !== 'running') return

        this.#currentFrame = requestAnimationFrame(() => this.render(status));

        this.#clearCanvas();

        this.#renderTopBar();

        this.#renderBalls();

        this.#renderGameInfo();
    }

    stopRender() {
        cancelAnimationFrame(this.#currentFrame)
    }

    setup() {
        this.#balls = [];

        this.#balls = BallFactory.createBalls({
            number: GameSettings.BALL_NUMBERS,
        });
    }

    resetData() {
        this.#balls = [];
        this.#currentIndex = 0;
        this.#time = 0;
    }

    startTimer() {
        this.#timer = window.setInterval(() => {
            this.#time++
        }, 1000)
    }

    stopTimer() {
        clearInterval(this.#timer)
    }

    #clearCanvas() {
        this.#context?.clearRect(
            0,
            0,
            GameSettings.SCREEN_WIDTH,
            GameSettings.SCREEN_HEIGHT
        );
    }

    #renderBalls() {
        if (!this.#context) return;

        for (let i = 0; i < this.#balls.length; i++) {
            this.#balls[i]?.update({
                context: this.#context,
                balls: this.#balls,
                mouse: this.#mouse,
            });
        }
    }

    #renderTopBar() {
        if (!this.#context) return

        this.#context.fillStyle = GameSettings.TOP_BAR_COLOR;
        this.#context.fillRect(
            0,
            0,
            GameSettings.SCREEN_WIDTH,
            GameSettings.TOP_BAR_OFFSET
        );
    }

    #renderGameInfo() {
        if (this.#context) {
            this.#context.fillStyle = 'white';
            this.#context.fillText(
                `Find number: ${this.#currentIndex + 1}`,
                GameSettings.SCREEN_WIDTH - 150,
                35
            );

            const minutes = Math.floor(this.#time / 60)
            const seconds = this.#time % 60

            this.#context.fillStyle = 'white';
            this.#context.fillText(
                `Timer: ${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`,
                20,
                35
            );
        }
    }
}
