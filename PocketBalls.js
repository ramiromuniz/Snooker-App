function checkForPocketedBalls() {
    // Check if the cue ball is pocketed
    if (cueBall && isCueBallPocketed()) {
        handleCueBallPocketed();
    }

    // Check other balls
    for (let i = balls.length - 1; i >= 0; i--) {
        let ball = balls[i];
        let ballPos = ball.body.position;

        for (let pocket of pockets) {
            if (isBallPocketed(ballPos, pocket)) {
                console.log(`Pocketed ball color: ${ball.color}`);
                if (ball.color !== 'red') {
                    // Respawn colored ball
                    moveBallToPosition(ball, coloredBallPositions[ball.color]);
                    consecutiveColoredBallsPotted++;
                    if (consecutiveColoredBallsPotted === 2) {
                        // If two consecutive colored balls are potted, set the flag to display the fault message
                        displayFaultMessage = true;
                    }
                    continue;
                } else {
                    // Remove the ball from the world and the balls array (for red balls)
                    Matter.World.remove(world, ball.body);
                    balls.splice(i, 1);
                    consecutiveColoredBallsPotted = 0;
                    break; // No need to check other pockets since the ball is removed
                }
            }
        }
    }
}

function moveBallToPosition(ball, position) {

    // Set the position of the ball's Matter.js body
    Matter.Body.setPosition(ball.body, position);
    // Set the velocity of the ball to zero to stop it from moving
    Matter.Body.setVelocity(ball.body, { x: 0, y: 0 });

    // Set the angular velocity of the ball to zero to stop any rotation
    Matter.Body.setAngularVelocity(ball.body, 0);
}
// Check if cueball was pocketed
function isCueBallPocketed() {
    for (let pocket of pockets) {
        if (isBallPocketed(cueBall.body.position, pocket)) {
            return true;
        }
    }
    return false;
}

function handleCueBallPocketed() {
    console.log('Cue ball pocketed!');
    // Remove the cue ball from the world
    Matter.World.remove(world, cueBall.body);
    cueBall = null;
    // Reset the cueBallPlaced flag to false so user can re position the cueball
    cueBallPlaced = false;
    cueBallPocketed = true;
}

function isBallPocketed(ballPos, pocketPos) {
    // Check if the ball overlaps with a hole, and return true if it is
    let distance = dist(ballPos.x, ballPos.y, pocketPos.x, pocketPos.y);
    return distance < (pocketDiameter * 0.6) / 2; 
}

// Function to reset the game state after a fault
function resetAfterFault() {
    consecutiveColoredBallsPotted = 0;
    displayFaultMessage = false;
}
