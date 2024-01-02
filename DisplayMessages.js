// Main Menu
function displayModeSelectionMessage() {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Press 1 for standard snooker", width / 2, height / 5);
    text("Press 2 for all random balls", width / 2, (height / 5)*2);
    text("Press 3 for random red balls", width / 2, (height / 5)*3);
    text("Press 4 for EXTREME MODE (Extension)", width / 2, (height / 5)*4);
}

// Prompt user to place cueball inside D semi circle
function displayCueBallPlacementMessage() {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Click on the D semi-circle to place the cue ball and start the game", width / 2, height / 4);
}

// If cueball pocketed, re-place the cueball message
function displayRePlaceCueBallMessage(){
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Click on the D semi-circle to place the cue ball to continue playing", width / 2, height / 4);
}

// Fault message for when two consecutive colored balls pocketed
function displayTwoColorBallsPocketedMessage() {
    if (displayFaultMessage) {
        // Display the fault message
        fill(136, 8, 8); // Red color for the fault message
        textAlign(CENTER, CENTER);
        text("Fault, two consecutive colored balls potted", width / 2, height / 2);
        
        // Set a timeout to reset the game state after the message is displayed
        setTimeout(() => {
            resetAfterFault();
        }, 2000); // Hide the message after 2 seconds for example
    }
}

// Extreme mode when a ball falls inside a malignant hole message
function displayLostBallMessage() {
    fill(136, 8, 8); // Red color for the message
    textAlign(CENTER, CENTER);
    text("You lost the ball :(", width / 2, height / 2);
}

// Instructions when Extreme Mode selected
function displayExtremeModeInstructions(){
    push();

    // Draw a semi-transparent rectangle as the background for the instructions
    fill(0, 0, 0, 150); // Semi-transparent black
    rectMode(CENTER);
    let rectWidth = 300;
    let rectHeight = 80;
    rect(width / 2, height / 2, rectWidth, rectHeight, 20); // Rounded corners

    // Display the instruction text
    fill(255); // White text
    textAlign(CENTER, CENTER);
    textSize(16);
    textFont('Arial', 11);
    text("Extreme Mode: Balls are half size with random holes\nappearing every 5 seconds.\nPotting in holes loses the ball and points.\nPress ENTER to start.", width / 2, height / 2);

    pop();
}

// Alert user the type of collision of the cueball
function displayCollisionMessage() {
    if (millis() - collisionMessageTime < collisionMessageDuration) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(16); 
        text(collisionMessage, width / 2, 50); // Display at the top of the canvas
    } else {
        collisionMessage = ""; // Clear the message after the duration
    }
}