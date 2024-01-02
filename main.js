function setup() {

    // Set the size of the canvas according to the table size
    createCanvas(tableWidth, tableHeight).mouseClicked(handleMouseClick);
    // Initiate Matter.js engine
    engine = Engine.create();
    world = engine.world;
    // Snooker tables don't have gravity affecting them horizontally
    world.gravity.y = 0;
    setupSnookerEnvironment();
    // Create the constrains of the cushions
    createCushionConstraints();


    // Set up collision event handling
    Matter.Events.on(engine, 'collisionStart', function(event) {

        let pairs = event.pairs;
        // Check the pair of balls that collided
        for (let i = 0, j = pairs.length; i < j; ++i) {
            let pair = pairs[i];
            
            let cueBallInvolved = pair.bodyA.label === 'cueBall' || pair.bodyB.label === 'cueBall';
            let otherBody = pair.bodyA.label === 'cueBall' ? pair.bodyB : pair.bodyA;
            // Only print if cueball was involved in the collision
            if (cueBallInvolved) {
                if (otherBody.label === 'redBall') {
                    collisionMessage = 'cueball-red';
                } else if (otherBody.label === 'colorBall') {
                    collisionMessage = 'cueball-color';
                } else if (otherBody.label === 'cushion') {
                    collisionMessage = 'cueball-cushion';
                }
                // Store the time of the collision message
                collisionMessageTime = millis();
            }
        }
    });
}

function setupSnookerEnvironment() {
    // Define the snooker table with correct proportions
    table = {
        x: width / 2,
        y: height / 2,
        color: [78,136,52,255] // Dark green color for the table
    };
}

function drawTable() {
    // Draw the brown borders
    const cornerRadius = 10;

    noStroke()
    fill(64,36,13,255); // Brown color for the borders
    rect(0, 0, tableWidth, tableHeight, cornerRadius); // The entire canvas is the border initially

    // Draw the green baize, inset by the border width
    fill(table.color);
    rect(borderWidth, borderWidth, tableWidth - borderWidth * 2, tableHeight - borderWidth * 2, cornerRadius);

    // Set the fill color to yellow for the pocket covers
    fill(243,213,70,255);

    // Draw the corner pocket covers with rounded top left corner
    rect(0, 0, pocketCoverSize, pocketCoverSize, cornerRadius, 0, cornerRadius, 0); // Top-left
    rect(tableWidth - pocketCoverSize, 0, pocketCoverSize, pocketCoverSize, 0, cornerRadius, 0, cornerRadius); // Top-right
    rect(0, tableHeight - pocketCoverSize, pocketCoverSize, pocketCoverSize, 0, cornerRadius, 0, cornerRadius); // Bottom-left
    rect(tableWidth - pocketCoverSize, tableHeight - pocketCoverSize, pocketCoverSize, pocketCoverSize, cornerRadius, 0, cornerRadius, 0); // Bottom-right

    // Draw the side pocket covers without rounded corners
    rect(tableWidth / 2 - pocketCoverSize / 2, 0, pocketCoverSize, borderWidth); // Top-middle
    rect(tableWidth / 2 - pocketCoverSize / 2, tableHeight - borderWidth, pocketCoverSize, borderWidth); // Bottom-middle
    
    // Set the fill color to white for the lines
    stroke(255);
    strokeWeight(1); 

    // Baulk line, 1/5th from the left side of the table
    line(baulkLineX, borderWidth+cushionDepth, baulkLineX, (tableHeight-borderWidth-cushionDepth));

    noFill(); // The D-line is not filled
    stroke(255);

    // Drawing the left part of the D-line circle
    arc(dLineCenterX, dLineCenterY, dLineDiameter, dLineDiameter, HALF_PI,-HALF_PI);

    // Reset drawing settings
    noStroke();
    // Draw Cushions
    drawCushions();

    // Black for the pockets
    fill(0);

    // Correct size for the pockets
    const ballRadius = ballDiameter / 2;
    const pocketRadius = 1.5 * ballRadius; // 1.5 times the ball's radius

    // Draw the corner pocket holes aligned with the bottom right of the yellow covers
    ellipse(borderWidth, borderWidth, pocketRadius * 2); // Top-left
    ellipse(tableWidth - borderWidth, borderWidth, pocketRadius * 2); // Top-right
    ellipse(borderWidth, tableHeight - borderWidth, pocketRadius * 2); // Bottom-left
    ellipse(tableWidth - borderWidth, tableHeight - borderWidth, pocketRadius * 2); // Bottom-right
    // Draw the side pocket holes aligned with the bottom of the yellow covers
    ellipse(tableWidth / 2, borderWidth, pocketRadius * 2); // Top-middle
    ellipse(tableWidth / 2, tableHeight - borderWidth, pocketRadius * 2); // Bottom-middle
}

function draw() {
    // Canvas transparent
    clear(); 
    Engine.update(engine);
    // Draw the table
    drawTable();
    // If user selected Extreme Mode display instructions
    if (showExtremeModeInstructions) {
        displayExtremeModeInstructions();
    } else {
        // Add random holes for Extreme Mode
        if (extremeModeFlag) {
            if (millis() > nextHoleTime) {
                addRandomHole();
                nextHoleTime = millis() + holeInterval;
            }
            drawHoles();        
            checkForBallsInHoles();
        }
        // If mode hasnt been select yet (menu mode)
        if (!modeSelected) {
            displayModeSelectionMessage();
        } else {
            // If the cueball was placed, display balls
            if (cueBallPlaced) {
                displayBalls();
                handleCueBallInteractions();
            }
            // If cueball was pocketed and it's not been re-placed
            if (cueBallPocketed && !cueBallPlaced) {
                displayBalls();
                displayRePlaceCueBallMessage();
            } else if (!cueBallPlaced && !showExtremeModeInstructions) {
                // Display the cue ball placement message only if the Extreme Mode instructions are not showing
                displayCueBallPlacementMessage();
                displayBalls();
            }
        }
        // When in Extreme Mode if user loses a ball display message
        if (ballLostMessage) {
            if (millis() - faultMessageStart < faultMessageDuration) {
                displayLostBallMessage();
            } else {
                ballLostMessage = false;
            }
        }

        checkForPocketedBalls();
        displayTwoColorBallsPocketedMessage();
        displayCollisionMessage();
    }
}

// Function to display all the balls
function displayBalls() {
    for (let i = 0; i < balls.length; i++) {
        balls[i].show();
    }
}

// Function to handle interactions with the cue ball
function handleCueBallInteractions() {
    if (cueBall) {
        cueBall.show();
        handleAimingAndHitting();
    }
}
// Function for aiming and hitting the cue ball
function handleAimingAndHitting() {
    // Draw cue stick when user presses on the cueball
    if (dragging && dragStart && cueBall) {
        drawCueStick();
        displayPowerLevel();
    }
}

// Function to display the power level
function displayPowerLevel() {
    let dragDistance = dist(dragStart.x, dragStart.y, mouseX, mouseY);
    // Cap the power at MAX_POWER
    let power = map(dragDistance, 0, MAX_LINE_LENGTH, 0, MAX_POWER);
    power = constrain(power, 0, MAX_POWER); // Constrain the power between 0 and MAX_POWER

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text("Power: " + power.toFixed(0), width / 2, 30); // Display power level, capped at MAX_POWER
}

// Function to draw the cue stick
function drawCueStick() {
    // Get the position of the cue ball
    let cueBallPos = cueBall.body.position;

    // Determine the angle from the cue ball to the mouse cursor
    let angle = atan2(mouseY - cueBallPos.y, mouseX - cueBallPos.x);

    // Set a fixed length for the cue stick
    let cueLength = 100;
    let cueWidth = 5; 
    // Distance from the cue ball center to the start of the cue stick
    let offset = 65;
    let startX = cueBallPos.x + (offset * cos(angle));
    let startY = cueBallPos.y + (offset * sin(angle));

    push();
    // Translate to the start position of the cue stick
    translate(startX, startY);
    // Rotate the canvas to align with the angle
    rotate(angle);
    // Set the drawing properties for the cue stick
    fill(205, 127, 50);
    noStroke();
    // Draw the cue stick as a rectangle
    rectMode(CENTER);
    rect(0, 0, cueLength, cueWidth);
    fill(128, 0, 32);
    rect(-50, 0, 5, cueWidth);
    fill(225, 193, 110);
    rect(45, 0, 20, cueWidth);
    pop();

}

function handleMouseClick() {
    // Check if the game has not started and the click is within the D semi-circle. If so, place cueball
    if (modeSelected && !cueBallPlaced && isClickWithinD(mouseX, mouseY)) {
        placeCueBall(mouseX, mouseY);
        cueBallPlaced = true;
    }
}

function isClickWithinD(x, y) {
    // Check if within the bounding box of the D
    if (mouseX > dLineCenterX - dLineRadius && mouseX < dLineCenterX &&
        mouseY > dLineCenterY - dLineRadius && mouseY < dLineCenterY + dLineRadius) {
        // Now check if within the semicircle of the D
        let distToCenter = dist(mouseX, mouseY, dLineCenterX, dLineCenterY);
        if (distToCenter < dLineRadius) {
            // The click is within the D
            return true;
        }
    }
    return false;
}

function placeCueBall(x, y) {
    // Create an instance of Ball class with cueball properties
    cueBall = new Ball(x, y, ballDiameter / 2, 'white', 'cueBall');
}

// This function will be responsible for initiating the drag
function startDragging() {
    let cueBallPos = cueBall.body.position;
    // Check if the mouse is over the cue ball
    if (dist(mouseX, mouseY, cueBallPos.x, cueBallPos.y) < cueBall.radius) {
        dragStart = createVector(mouseX, mouseY);
        dragging = true;
    }
}

// This function calculates the force based on the drag distance and applies it to the cue ball
function applyForceToCueBall() {
    let dragEnd = createVector(mouseX, mouseY);
    let forceDirection = p5.Vector.sub(dragStart, dragEnd);
    forceDirection.normalize(); // Normalize to get direction only
    
    let dragDistance = dist(dragStart.x, dragStart.y, mouseX, mouseY);
    let power = min(map(dragDistance, 0, width, 0, MAX_POWER), MAX_POWER);
    let forceMagnitude = power * 0.1;
    
    // Limit the force to prevent balls from leaving the canvas
    forceDirection.mult(min(forceMagnitude, MAX_FORCE_VALUE));
    
    Matter.Body.setStatic(cueBall.body, false); // Make the cue ball dynamic
    Matter.Body.applyForce(cueBall.body, cueBall.body.position, forceDirection);
}

// Detects when the mouse is pressed
function mousePressed() {
    // Start dragging only if the cue ball is placed and not already dragging
    if (modeSelected && cueBallPlaced && !dragging && cueBall) {
        startDragging();
    }
}

function mouseReleased() {
    // Apply the force to the cue ball only if dragging has occurred
    if (modeSelected && cueBallPlaced && dragging && cueBall) {
        applyForceToCueBall();

        // Reset drag variables
        dragStart = null;
        dragging = false;
    }
}

function keyPressed() {
    // Main menu mode selection logic
    if (!modeSelected && (key === '1' || key === '2' || key === '3' || key === '4')) {
        if (key === '4') {
            showExtremeModeInstructions = true;
        } else {
            modeSelected = true;
            if (key === '1') {
                modeA();
            } else if (key === '2') {
                modeC();
            } else if (key === '3') {
                modeB();
            }
        }
    }
    // If user selected Extreme Mode, show instructions before initiating the game
    if (showExtremeModeInstructions && key === 'Enter') {
        showExtremeModeInstructions = false;
        modeSelected = true;
        extremeMode();
    }
}




