import { GameSettings } from '../constants/game-settings';
import { GameEngine } from './game-engine';
import { GameSystem } from './game-system';
import { Mouse } from './mouse';

export class GameActions {
    static mouseMove({ ev, mouse }: { ev: MouseEvent, mouse: Mouse }) {
        mouse.x = ev.offsetX
        mouse.y = ev.offsetY
    }

    static mouseClick({ ev, engine, system }: { ev: MouseEvent, engine: GameEngine, system: GameSystem }) {
        const mouse: Mouse = {
            x: ev.offsetX, y: ev.offsetY
        }

        const balls = engine.getBalls();
        const ballLength = balls.length;

        const currentIndex = engine.getCurrentIndex()

        let result = false;

        for (let i = 0; i < ballLength; i++) {
            result = balls[i].clicked({ mouse, currentIndex })

            if (result) {
                if (currentIndex + 1 === GameSettings.BALL_NUMBERS) {
                    system.end()
                    system.getSounds().play({ key: 'win' })
                } else {
                    system.getSounds().play({ key: 'found' })
                    engine.setCurrentIndex(currentIndex + 1)
                }

                break;
            }
        }

        if (!result) {
            system.getSounds().play({ key: 'click' })
        }
    }
}