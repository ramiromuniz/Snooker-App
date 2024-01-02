let holes = []; // Array to store holes

function extremeMode(){
    extremeModeFlag = true;
    nextHoleTime = millis() + holeInterval; // Set the timer for the first malignant hole
    clearBalls();
    half_ball_diameter = ballDiameter/2;
    // The x position for the first column of red balls
    const firstColumnX = (tableWidth / 5) * 4;

    // The y position for the bottom ball in the first column
    const bottomBallY = (tableHeight / 2) + 2 * ballDiameter; 

    // Create the first column of 5 red balls
    for (let i = 0; i < 5; i++) {
        let x = firstColumnX;
        let y = bottomBallY - i * (ballDiameter);
        let redBall = new Ball(x, y, half_ball_diameter / 2, 'red', 'redBall');
        balls.push(redBall);
    }

    // The x position for the second column of red balls
    const secondColumnX = firstColumnX - ballDiameter - 1; // Subtract the diameter and a gap

    // Y positions for the 4 balls in the second column
    const yPositions = [
        halfTable + (ballDiameter + (ballDiameter / 2)),
        halfTable + (ballDiameter / 2),
        halfTable - (ballDiameter / 2),
        halfTable - (ballDiameter + (ballDiameter / 2))
    ];

    // Create the second column of 4 red balls
    for (let i = 0; i < 4; i++) {
        let x = secondColumnX;
        let y = yPositions[i];
        let redBall = new Ball(x, y, half_ball_diameter / 2, 'red', 'redBall');
        balls.push(redBall);
    }

    // The x position for the third column of red balls
    const thirdColumnX = firstColumnX - (ballDiameter * 2) - 2; // Subtract twice the diameter and a gap for the third column

    // Y positions for the 3 balls in the third column
    const yPositionsThird = [
        halfTable + ballDiameter,
        halfTable,
        halfTable - ballDiameter
    ];

    // Create the third column of 3 red balls
    for (let i = 0; i < 3; i++) {
        let x = thirdColumnX;
        let y = yPositionsThird[i];
        let redBall = new Ball(x, y, half_ball_diameter / 2, 'red', 'redBall');
        balls.push(redBall);
    }

    // The x position for the fourth column of red balls
    const fourthColumnX = firstColumnX - (ballDiameter * 3) - 2; // Subtract thrice the diameter and a gap for the fourth column

    // Y positions for the 2 balls in the fourth column
    const yPositionsFourth = [
        halfTable + (ballDiameter / 2),
        halfTable - (ballDiameter / 2)
    ];

    // Create the fourth column of 2 red balls
    for (let i = 0; i < 2; i++) {
        let x = fourthColumnX;
        let y = yPositionsFourth[i];
        let redBall = new Ball(x, y, half_ball_diameter / 2, 'red', 'redBall');
        balls.push(redBall);
    }

    // The x position for the single ball at the top of the triangle
    const fifthColumnX = firstColumnX - (ballDiameter * 4) - 2; // Subtract four times the diameter and a gap for the fifth column

    // Y position for the single ball in the fifth column
    const yFifth = halfTable; // The center of the table height

    // Create the single ball at the top of the triangle
    let singleRedBall = new Ball(fifthColumnX, yFifth, half_ball_diameter / 2, 'red', 'redBall');
    balls.push(singleRedBall);

    // Iterate over the coloredBallPositions dictionary to create each colored ball
    for (const [color, position] of Object.entries(coloredBallPositions)) {
        balls.push(new Ball(position.x, position.y, half_ball_diameter / 2, color, 'colorBall'));
    }
}

function drawHoles() {
    fill(0); // Black color for holes
    noStroke();
    for (let hole of holes) {
        ellipse(hole.x, hole.y, pocketDiameter/2);
    }
}

// Check for balls falling into holes
function checkForBallsInHoles() {
    if (extremeModeFlag) {
        for (let i = balls.length - 1; i >= 0; i--) {
            let ball = balls[i];
            let ballPos = ball.body.position;

            for (let hole of holes) {
                if (dist(ballPos.x, ballPos.y, hole.x, hole.y) < pocketDiameter/2) {
                    console.log(`${ball.color} ball fell into a hole!`);
                    ballLostMessage = true; // Trigger the message display
                    faultMessageStart = millis(); // Record the start time
                    // Remove the ball from the world and the balls array
                    Matter.World.remove(world, ball.body);
                    balls.splice(i, 1);
                }
            }
        }
    }
}
// Function to add random holes
function addRandomHole() {
    let safeSpot = false;
    let newHole = {};
    // Check if its within the boundaries of the table
    while (!safeSpot) {
        newHole = {
            x: random(borderWidth + cushionDepth, tableWidth - borderWidth - cushionDepth),
            y: random(borderWidth + cushionDepth, tableHeight - borderWidth - cushionDepth),
            radius: pocketDiameter/2 // Same radius as pockets
        };
        safeSpot = isSafeHolePosition(newHole, holes);
    }
    // Never let more than 10 holes be drawn, if its more than 10, start deleting the first one, and so on
    if (holes.length > 9) {
        holes.shift(); // Remove the first hole
    }

    holes.push(newHole);
}
// Function to check if holes are not drawn overlapping each other
function isSafeHolePosition(newHole, existingHoles) {
    for (let hole of existingHoles) {
        if (dist(newHole.x, newHole.y, hole.x, hole.y) < newHole.radius + hole.radius) {
            return false; // Too close to another hole
        }
    }
    return true;
}