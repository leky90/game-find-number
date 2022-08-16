import { Vector } from './vector';

export interface BaseObject {
    position: Vector;
    velocity: Vector;
    mass: number;
    getPosition: () => Vector;
    getVelocity: () => Vector;
    getMass: () => number
}