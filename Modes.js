// Standard Snooker ball distribution
function modeA(){
    clearBalls();
    // The x position for the first column of red balls
    const firstColumnX = (tableWidth / 5) * 4;

    // The y position for the bottom ball in the first column
    const bottomBallY = (tableHeight / 2) + 2 * ballDiameter; 

    // Create the first column of 5 red balls
    for (let i = 0; i < 5; i++) {
        let x = firstColumnX;
        let y = bottomBallY - i * (ballDiameter); // +1 for a small gap between balls
        let redBall = new Ball(x, y, ballDiameter / 2, 'red', 'redBall');
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
        let redBall = new Ball(x, y, ballDiameter / 2, 'red', 'redBall');
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
        let redBall = new Ball(x, y, ballDiameter / 2, 'red', 'redBall');
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
        let redBall = new Ball(x, y, ballDiameter / 2, 'red', 'redBall');
        balls.push(redBall);
    }

    // The x position for the single ball at the top of the triangle
    const fifthColumnX = firstColumnX - (ballDiameter * 4) - 2; // Subtract four times the diameter and a gap for the fifth column

    // Y position for the single ball in the fifth column
    const yFifth = halfTable; // The center of the table height

    // Create the single ball at the top of the triangle
    let singleRedBall = new Ball(fifthColumnX, yFifth, ballDiameter / 2, 'red', 'redBall');
    balls.push(singleRedBall);

    // Iterate over the coloredBallPositions dictionary to create each colored ball
    for (const [color, position] of Object.entries(coloredBallPositions)) {
        balls.push(new Ball(position.x, position.y, ballDiameter / 2, color, 'colorBall'));
    }
}

// All random balls
function modeB() {
    clearBalls();
    // Define padding and safe zone
    const padding = 10;
    const minX = borderWidth + cushionDepth + padding;
    const maxX = tableWidth - (borderWidth + cushionDepth + padding);
    const minY = borderWidth + cushionDepth + padding;
    const maxY = tableHeight - (borderWidth + cushionDepth + padding);

    // Randomize positions for the red balls
    for (let i = 0; i < 15; i++) {
        let x, y, safeSpot;
        do {
            x = random(minX, maxX);
            y = random(minY, maxY);
            safeSpot = isSafePosition(x, y, balls, ballDiameter);
        } while (!safeSpot);

        let redBall = new Ball(x, y, ballDiameter / 2, 'red', 'redBall');
        balls.push(redBall);
    }

    // Iterate over the coloredBallPositions dictionary to create each colored ball
    for (const [color, position] of Object.entries(coloredBallPositions)) {
        balls.push(new Ball(position.x, position.y, ballDiameter / 2, color, 'colorBall'));
    }
}

// Only red balls random
function modeC() {
    clearBalls();
    // Define padding and safe zone
    const padding = 10;
    const minX = borderWidth + cushionDepth + padding;
    const maxX = tableWidth - (borderWidth + cushionDepth + padding);
    const minY = borderWidth + cushionDepth + padding;
    const maxY = tableHeight - (borderWidth + cushionDepth + padding);

    // Randomize positions for the red balls
    for (let i = 0; i < 15; i++) {
        let x, y, safeSpot;
        do {
            x = random(minX, maxX);
            y = random(minY, maxY);
            safeSpot = isSafePosition(x, y, balls, ballDiameter);
        } while (!safeSpot);

        let redBall = new Ball(x, y, ballDiameter / 2, 'red', 'redBall');
        balls.push(redBall);
    }

    // Randomize positions for the colored balls
    const colors = ['yellow', 'green', 'brown', 'blue', 'pink', 'black'];
    colors.forEach(color => {
        let x, y, safeSpot;
        do {
            x = random(minX, maxX);
            y = random(minY, maxY);
            safeSpot = isSafePosition(x, y, balls, ballDiameter);
        } while (!safeSpot);

        let coloredBall = new Ball(x, y, ballDiameter / 2, color, 'colorBall');
        balls.push(coloredBall);
    });
}


