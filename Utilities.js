// Helper function that checks position of balls when created randomly so they dont overlap
function isSafePosition(x, y, balls, minDist) {
    return balls.every(ball => {
        const dx = ball.body.position.x - x;
        const dy = ball.body.position.y - y;
        return Math.sqrt(dx * dx + dy * dy) >= minDist;
    });
}

function clearBalls() {
    // Remove all balls from the Matter.js world
    balls.forEach(ball => {
        World.remove(world, ball.body);
    });
    balls = []; // Clear the array
}