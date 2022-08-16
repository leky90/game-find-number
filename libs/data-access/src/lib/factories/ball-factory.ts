import { Vector } from '@game-canvas-2d/types';
import { distance, randomIntFromRange } from '@game-canvas-2d/utils';
import { GameSettings } from '../constants/game-settings';
import Ball from '../models/ball';

export default class BallFactory {
    static createBalls({ number = GameSettings.BALL_NUMBERS }) {
        const balls: Array<Ball> = []
        for (let i = 0; i < number; i++) {
            BallFactory.createBall({ index: i + 1, balls })
        }

        return balls
    }

    static createBall({ index, balls }: { index: number; balls: Array<Ball> }) {
        const x = randomIntFromRange({ min: GameSettings.BALL_RADIUS, max: GameSettings.SCREEN_WIDTH - GameSettings.BALL_RADIUS })
        const y = randomIntFromRange({ min: GameSettings.BALL_RADIUS + GameSettings.TOP_BAR_OFFSET, max: GameSettings.SCREEN_HEIGHT - GameSettings.BALL_RADIUS })

        const vector1: Vector = { x, y }
        let collised = false;

        for (let i = 0; i < balls.length; i++) {
            const vector2 = balls[i].getPosition()
            if (distance({ vector1, vector2 }) - GameSettings.BALL_RADIUS * 2 < 0) {
                collised = true;
                break;
            }
        }

        if (collised) {
            BallFactory.createBall({ index, balls })
        } else {
            const position = { x, y }
            balls.push(new Ball({ position, index }))
        }
    }
}