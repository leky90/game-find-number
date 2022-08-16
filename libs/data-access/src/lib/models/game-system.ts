import { GameSound } from './game-sound';
import { Dispatch, SetStateAction } from 'react';
import { GameActions } from './game-actions';
import { GameEngine } from './game-engine';
import { Mouse } from './mouse';

interface GameSystemProps {
    engine: GameEngine;
    ping: Dispatch<SetStateAction<number>>;
    mouse?: Mouse
}

export type GameStatus = 'running' | 'pause' | 'stop' | 'idle'

export class GameSystem {
    #engine: GameEngine;
    #sounds: GameSound;
    #status: GameStatus = 'running';
    #ping: Dispatch<SetStateAction<number>>;

    constructor({ engine, ping }: GameSystemProps) {
        this.#engine = engine
        this.#sounds = new GameSound();
        this.#status = 'idle'
        this.#ping = ping
    }

    getStatus() {
        return this.#status
    }

    pingStatus() {
        this.#ping((prevValue) => prevValue + 1)
    }

    getScore() {
        return this.#engine.getTime()
    }

    getSounds() {
        return this.#sounds
    }

    listenEvents() {
        const canvasEl = this.#engine.getCanvas();

        canvasEl.addEventListener('mousemove', (ev: MouseEvent) =>
            GameActions.mouseMove({ ev, mouse: this.#engine.getMouse() })
        );

        canvasEl.addEventListener('mousedown', (ev: MouseEvent) =>
            GameActions.mouseClick({ ev, engine: this.#engine, system: this })
        );
    }

    init() {
        this.initSounds()
        this.listenEvents()
    }

    initSounds() {
        this.#sounds.create({ key: 'click', src: 'assets/sounds/click.mp3' })
        this.#sounds.create({ key: 'found', src: 'assets/sounds/found.mp3' })
        this.#sounds.create({ key: 'win', src: 'assets/sounds/win.mp3' })
    }

    start() {
        this.#engine.setup()
        this.#status = 'running'
        this.#engine.startTimer()
        this.#engine.render(this.#status)
        this.pingStatus();
    }

    reset() {
        this.#engine.stopTimer()
        this.#engine.stopRender()
        this.#engine.resetData()
        this.#engine.setup()
        this.start()
        this.pingStatus();
    }

    end() {
        this.#status = 'stop'
        this.#engine.stopTimer()
        this.#engine.stopRender()
        this.pingStatus();
    }

    pause() {
        this.#status = 'pause'
        this.#engine.stopTimer()
        return
    }
}