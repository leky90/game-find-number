import { BaseObject, Vector } from '@game-canvas-2d/types';

export function randomIntFromRange({ min, max }: { min: number; max: number }) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function randomColor(colors: Array<string>) {
  return colors[Math.floor(Math.random() * colors.length)]
}

export function distance({ vector1, vector2 }: { vector1: Vector, vector2: Vector }) {
  const xDist = vector1.x - vector2.x
  const yDist = vector1.y - vector2.y

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

export function rotate(velocity: Vector, angle: number) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}

/**
* Swaps out two colliding particles' x and y velocities after running through
* an elastic collision reaction equation
*
* @param  Object | particle      | A particle object with x and y coordinates, plus velocity
* @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
* @return Null | Does not return a value
*/

export function resolveCollision(particle: BaseObject, otherParticle: BaseObject) {
  const particlePosition = particle.getPosition();
  const otherParticlePosition = otherParticle.getPosition();

  const particleVelocity = particle.getVelocity();
  const otherParticleVelocity = otherParticle.getVelocity();

  const xVelocityDiff = particleVelocity.x - otherParticleVelocity.x;
  const yVelocityDiff = particleVelocity.y - otherParticleVelocity.y;

  const xDist = otherParticlePosition.x - particlePosition.x;
  const yDist = otherParticlePosition.y - particlePosition.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

    // Grab angle between the two colliding particles
    const angle = -Math.atan2(otherParticlePosition.y - particlePosition.y, otherParticlePosition.x - particlePosition.x);

    // Store mass in var for better readability in collision equation
    const m1 = particle.getMass();
    const m2 = otherParticle.getMass();

    // Velocity before equation
    const u1 = rotate(particleVelocity, angle);
    const u2 = rotate(otherParticleVelocity, angle);

    // Velocity after 1d collision equation
    const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
    const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particleVelocity.x = vFinal1.x;
    particleVelocity.y = vFinal1.y;

    otherParticleVelocity.x = vFinal2.x;
    otherParticleVelocity.y = vFinal2.y;
  }
}