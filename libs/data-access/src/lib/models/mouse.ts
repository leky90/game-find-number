import { Vector } from '@game-canvas-2d/types';

interface MouseProps extends Vector {
    touched: boolean
}

export class Mouse {
    x: number;
    y: number;

    constructor({ x, y }: MouseProps) {
        this.x = x
        this.y = y
    }
}