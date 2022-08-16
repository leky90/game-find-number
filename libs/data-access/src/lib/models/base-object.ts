import { Vector } from '@game-canvas-2d/types';

interface BaseObjectProps {
    position: Vector;
    velocity?: Vector;
    mass?: number;
}

export class BaseObject {
    #position: Vector;
    #velocity: Vector;
    #mass: number;

    constructor({ position, velocity = { x: 0, y: 0 }, mass = 0.01 }: BaseObjectProps) {
        this.#position = position
        this.#mass = mass
        this.#velocity = velocity
    }

    getPosition() {
        return this.#position
    }

    getVelocity() {
        return this.#velocity
    }

    getMass() {
        return this.#mass
    }
}