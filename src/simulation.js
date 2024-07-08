/**
 * Boid simulation by Ben Eater:
 * https://github.com/beneater/boids/blob/master/boids.js
 * https://eater.net/boids
 *
 * modified: skittlemittle feb 2024
 *
 * license: MIT
 */

/* eslint-disable no-console */
const Simulation = (
  canvasId,
  height,
  width,
  numBoids,
  lookRange,
  boidColor,
  trailColor,
  showTrail
) => {
  const boids = [];
  let DRAW_TRAIL = showTrail;
  let visualRange = lookRange;
  let centeringFactor = 0.005;
  let avoidFactor = 0.05; // Adjust velocity by this %
  let matchingFactor = 0.05; // Adjust by this % of average velocity

  const setLookRange = (r) => (visualRange = r);
  const toggleBoidTrails = (show) => (DRAW_TRAIL = show);
  const setCentering = (c) => (centeringFactor = c);
  const setAvoid = (a) => (avoidFactor = a);
  const setCoherence = (c) => (matchingFactor = c);

  function initBoids() {
    for (var i = 0; i < numBoids; i += 1) {
      boids[boids.length] = {
        x: Math.random() * width,
        y: Math.random() * height,
        dx: Math.random() * 10 - 5,
        dy: Math.random() * 10 - 5,
        history: [],
      };
    }
  }

  function distance(boid1, boid2) {
    return Math.sqrt(
      (boid1.x - boid2.x) * (boid1.x - boid2.x) +
        (boid1.y - boid2.y) * (boid1.y - boid2.y)
    );
  }

  // Constrain a boid to within the window. If it gets too close to an edge,
  // nudge it back in and reverse its direction.
  function keepWithinBounds(boid) {
    const margin = 200;
    const turnFactor = 1;

    if (boid.x < margin) {
      boid.dx += turnFactor;
    }
    if (boid.x > width - margin) {
      boid.dx -= turnFactor;
    }
    if (boid.y < margin) {
      boid.dy += turnFactor;
    }
    if (boid.y > height - margin) {
      boid.dy -= turnFactor;
    }
  }

  // Find the center of mass of the other boids and adjust velocity slightly to
  // point towards the center of mass.
  function flyTowardsCenter(boid) {
    let centerX = 0;
    let centerY = 0;
    let numNeighbors = 0;

    for (let otherBoid of boids) {
      if (distance(boid, otherBoid) < visualRange) {
        centerX += otherBoid.x;
        centerY += otherBoid.y;
        numNeighbors += 1;
      }
    }

    if (numNeighbors) {
      centerX = centerX / numNeighbors;
      centerY = centerY / numNeighbors;

      boid.dx += (centerX - boid.x) * centeringFactor;
      boid.dy += (centerY - boid.y) * centeringFactor;
    }
  }

  // Move away from other boids that are too close to avoid colliding
  function avoidOthers(boid) {
    const minDistance = 20; // The distance to stay away from other boids
    let moveX = 0;
    let moveY = 0;
    for (let otherBoid of boids) {
      if (otherBoid !== boid) {
        if (distance(boid, otherBoid) < minDistance) {
          moveX += boid.x - otherBoid.x;
          moveY += boid.y - otherBoid.y;
        }
      }
    }

    boid.dx += moveX * avoidFactor;
    boid.dy += moveY * avoidFactor;
  }

  // Find the average velocity (speed and direction) of the other boids and
  // adjust velocity slightly to match.
  function matchVelocity(boid) {
    let avgDX = 0;
    let avgDY = 0;
    let numNeighbors = 0;

    for (let otherBoid of boids) {
      if (distance(boid, otherBoid) < visualRange) {
        avgDX += otherBoid.dx;
        avgDY += otherBoid.dy;
        numNeighbors += 1;
      }
    }

    if (numNeighbors) {
      avgDX = avgDX / numNeighbors;
      avgDY = avgDY / numNeighbors;

      boid.dx += (avgDX - boid.dx) * matchingFactor;
      boid.dy += (avgDY - boid.dy) * matchingFactor;
    }
  }

  // Speed will naturally vary in flocking behavior, but real animals can't go
  // arbitrarily fast.
  function limitSpeed(boid) {
    const speedLimit = 15;

    const speed = Math.sqrt(boid.dx * boid.dx + boid.dy * boid.dy);
    if (speed > speedLimit) {
      boid.dx = (boid.dx / speed) * speedLimit;
      boid.dy = (boid.dy / speed) * speedLimit;
    }
  }

  function drawBoid(ctx, boid) {
    const angle = Math.atan2(boid.dy, boid.dx);
    ctx.translate(boid.x, boid.y);
    ctx.rotate(angle);
    ctx.translate(-boid.x, -boid.y);
    ctx.fillStyle = boidColor;
    ctx.beginPath();
    ctx.moveTo(boid.x, boid.y);
    ctx.lineTo(boid.x - 15, boid.y + 5);
    ctx.lineTo(boid.x - 15, boid.y - 5);
    ctx.lineTo(boid.x, boid.y);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (DRAW_TRAIL) {
      ctx.strokeStyle = trailColor;
      ctx.beginPath();
      ctx.moveTo(boid.history[0][0], boid.history[0][1]);
      for (const point of boid.history) {
        ctx.lineTo(point[0], point[1]);
      }
      ctx.stroke();
    }
  }

  // Main animation loop
  function animationLoop() {
    // Update each boid
    for (let boid of boids) {
      // Update the velocities according to each rule
      flyTowardsCenter(boid);
      avoidOthers(boid);
      matchVelocity(boid);
      limitSpeed(boid);
      keepWithinBounds(boid);

      // Update the position based on the current velocity
      boid.x += boid.dx;
      boid.y += boid.dy;
      boid.history.push([boid.x, boid.y]);
      boid.history = boid.history.slice(-50);
    }

    // Clear the canvas and redraw all the boids in their current positions
    const ctx = document.getElementById(canvasId).getContext("2d");
    ctx.clearRect(0, 0, width, height);
    for (let boid of boids) {
      drawBoid(ctx, boid);
    }

    // Schedule the next frame
    window.requestAnimationFrame(animationLoop);
  }

  return {
    initBoids,
    animationLoop,
    setLookRange,
    toggleBoidTrails,
    setCentering,
    setAvoid,
    setCoherence,
  };
};

export { Simulation };
