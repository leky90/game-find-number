import { Vector } from '@game-canvas-2d/types';
import { distance, resolveCollision } from '@game-canvas-2d/utils';
import { GameSettings } from '../constants/game-settings';
import { BaseObject } from './base-object';
import { BaseObject as IBaseObject } from '@game-canvas-2d/types';
import { Mouse } from './mouse';

interface BallProps {
    index: number;
    position: Vector;
    radius?: number;
}

export default class Ball extends BaseObject {
    #index: number;
    #radius: number;
    #clicked: boolean;

    constructor({ position, index, radius = GameSettings.BALL_RADIUS }: BallProps) {
        const velocity: Vector = {
            x: Math.random() - 0.5,
            y: Math.random() - 0.5
        }
        super({ position, velocity })
        this.#index = index
        this.#radius = radius
        this.#clicked = false
    }

    getRadius() {
        return this.#radius
    }

    clicked({ mouse, currentIndex }: { mouse: Mouse, currentIndex: number }) {
        const vector1 = this.getPosition();
        if (distance({ vector1, vector2: mouse }) - this.#radius < 0 && currentIndex + 1 === this.#index) {
            this.#clicked = true
            return this.#clicked
        }

        return false;
    }

    draw(context: CanvasRenderingContext2D) {
        context.beginPath()
        context.arc(this.getPosition().x, this.getPosition().y, this.#radius, 0, Math.PI * 2)
        context.strokeStyle = 'black';
        context.stroke()
        context.font = '20px Franklin Gothic Medium';
        const text = this.#index.toString();
        const textWidth = context.measureText(text).width
        context.fillStyle = 'black'
        context.fillText(text, (this.getPosition().x) - (textWidth / 2), this.getPosition().y + 5)
        context.closePath()
    }

    update({ context, balls, mouse }: { context: CanvasRenderingContext2D, balls: Ball[], mouse: Mouse }) {
        this.draw(context);

        for (let i = 0; i < balls.length; i++) {
            if (this === balls[i]) continue;

            const vector1 = this.getPosition();
            const vector2 = balls[i].getPosition()

            if (distance({ vector1, vector2 }) - (this.#radius + balls[i].getRadius()) < 0) {
                resolveCollision(this as unknown as IBaseObject, balls[i] as unknown as IBaseObject)
            }
        }

        const vector2 = { x: this.getPosition().x, y: this.getPosition().y }

        if (distance({ vector1: vector2, vector2: mouse }) - this.#radius < 0) {
            context.fillStyle = 'rgba(255, 0, 0, 0.5)'
            context.fill()
        }

        if (this.#clicked) {
            context.fillStyle = 'rgba(0, 255, 0, 0.5)'
            context.fill()
        }

        if (this.getPosition().x - this.#radius <= 0 || this.getPosition().x + this.#radius >= GameSettings.SCREEN_WIDTH) {
            this.getVelocity().x = -this.getVelocity().x
        }

        if (this.getPosition().y - this.#radius <= GameSettings.TOP_BAR_OFFSET || this.getPosition().y + this.#radius >= GameSettings.SCREEN_HEIGHT) {
            this.getVelocity().y = -this.getVelocity().y
        }

        this.getPosition().x += this.getVelocity().x
        this.getPosition().y += this.getVelocity().y
    }
}