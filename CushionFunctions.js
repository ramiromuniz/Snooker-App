function drawCushions(){
    // Draw Cushions
    const cushionColor = color(51,97,24,255); // Darker green for the cushion

    fill(cushionColor);
    noStroke();

    const xMiddlePocket = tableWidth / 2 - pocketCoverSize / 2;

    // Cushion top left
    quad(pocketCoverSize, borderWidth, // x1, y1
        xMiddlePocket, borderWidth, // x2, y2
        xMiddlePocket - cushionDepth, borderWidth + cushionDepth, // x3, y3
        pocketCoverSize + cushionDepth+8, borderWidth + cushionDepth); // x4, y4
    
    // Cushion top right
    quad(xMiddlePocket+pocketCoverSize, borderWidth, // x1, y1
        tableWidth-pocketCoverSize, borderWidth,// x2, y2
        (tableWidth-pocketCoverSize) - cushionDepth-8, borderWidth + cushionDepth, // x3, y3
        xMiddlePocket+pocketCoverSize + cushionDepth, borderWidth + cushionDepth); // x4, y4

    // Cushion bottom left
    quad(pocketCoverSize, tableHeight - borderWidth, // x1, y1
        xMiddlePocket, tableHeight - borderWidth, // x2, y2
        xMiddlePocket - cushionDepth, tableHeight - (borderWidth + cushionDepth), // x3, y3
        pocketCoverSize + cushionDepth+8, tableHeight - (borderWidth + cushionDepth)); // x4, y4

    // Cushion bottom right
    quad(xMiddlePocket + pocketCoverSize, tableHeight - borderWidth,
        tableWidth - pocketCoverSize, tableHeight - borderWidth,
        tableWidth - (pocketCoverSize + cushionDepth+8), tableHeight - (borderWidth + cushionDepth),
        xMiddlePocket + pocketCoverSize + cushionDepth, tableHeight - (borderWidth + cushionDepth));

    // Cushion left
    quad(borderWidth, pocketCoverSize,
        borderWidth, tableHeight - pocketCoverSize,
        borderWidth + cushionDepth, (tableHeight - pocketCoverSize) - cushionDepth-8,
        borderWidth + cushionDepth, pocketCoverSize + cushionDepth+8);

    // Cushion right
    quad(tableWidth - borderWidth, pocketCoverSize,
        tableWidth - borderWidth, tableHeight - pocketCoverSize,
        tableWidth - (borderWidth + cushionDepth), (tableHeight - pocketCoverSize) - cushionDepth-8,
        tableWidth - (borderWidth + cushionDepth), pocketCoverSize + cushionDepth+8);

}

function createCushionConstraints() {
    // Define properties for the cushions
    const cushionOptions = {
        isStatic: true,
        restitution: 0.5, // This will make the cushions bouncy
        friction: 0.1,  
        label: 'cushion'  

    };

    // Top left cushion vertices based on your quad coordinates
    let topLeftCushionVertices = [
        { x: 0, y: 0 },
        { x: tableWidth/2, y: 0 },
        { x: xMiddlePocket - cushionDepth, y: borderWidth + cushionDepth },
        { x: pocketCoverSize + cushionDepth+8, y: borderWidth + cushionDepth }
    ];

    // Create a Matter.js body for the top left cushion
    let topLeftCushionBody = Bodies.fromVertices(
        (pocketCoverSize/2 + tableWidth/2) / 2,
        (borderWidth + cushionDepth) / 2,
        [topLeftCushionVertices],
        cushionOptions,
        true
    );

    // Top right cushion vertices
    let topRightCushionVertices = [
        { x: tableWidth/2, y: 0 },
        { x: tableWidth -(cushionDepth*2), y: 0 },
        { x: (tableWidth - pocketCoverSize) - cushionDepth-8, y: borderWidth + cushionDepth },
        { x: xMiddlePocket + pocketCoverSize + cushionDepth, y: borderWidth + cushionDepth }
    ];
    let topRightCushionBody = Bodies.fromVertices(
        (tableWidth/4)*3,
        (borderWidth + cushionDepth)/2,
        [topRightCushionVertices],
        cushionOptions,
        true
    );
    // Bottom left cushion vertices
    let bottomLeftCushionVertices = [
        { x: cushionDepth*2, y: tableHeight },
        { x: tableWidth/2+5, y: tableHeight },
        { x: xMiddlePocket - cushionDepth, y: tableHeight - (borderWidth + cushionDepth) },
        { x: pocketCoverSize + cushionDepth+8, y: tableHeight - (borderWidth + cushionDepth) }
    ];
    let bottomLeftCushionBody = Bodies.fromVertices(
        (tableWidth/4), 
        tableHeight-((borderWidth + cushionDepth)/2),
        [bottomLeftCushionVertices],
        cushionOptions,
        true
    );
    // Bottom right cushion vertices
    let bottomRightCushionVertices = [
        { x: tableWidth/2-5, y: tableHeight },
        { x: tableWidth - (cushionDepth*2), y: tableHeight },
        { x: tableWidth - pocketCoverSize - cushionDepth -8, y: tableHeight - (borderWidth + cushionDepth) },
        { x: xMiddlePocket + pocketCoverSize + cushionDepth, y: tableHeight - (borderWidth + cushionDepth) }
    ];
    let bottomRightCushionBody = Bodies.fromVertices(
        (tableWidth/4)*3, 
        tableHeight-((borderWidth + cushionDepth)/2),
        [bottomRightCushionVertices],
        cushionOptions,
        true
    );
    // Left cushion vertices
    let leftCushionVertices = [
        { x: 0, y: 0 },
        { x: 0, y: tableHeight - (cushionDepth*2) },
        { x: borderWidth + cushionDepth, y: (tableHeight - pocketCoverSize) - cushionDepth -8},
        { x: borderWidth + cushionDepth, y: pocketCoverSize + cushionDepth +8}
    ];
    let leftCushionBody = Bodies.fromVertices(
        (borderWidth + cushionDepth) / 2, 
        tableHeight/2,
        [leftCushionVertices],
        cushionOptions,
        true
    );
    // Right cushion vertices
    let rightCushionVertices = [
        { x: tableWidth, y: cushionDepth*2 },
        { x: tableWidth, y: tableHeight - (cushionDepth*2) },
        { x: tableWidth - (borderWidth + cushionDepth), y: (tableHeight - pocketCoverSize) - cushionDepth-8 },
        { x: tableWidth - (borderWidth + cushionDepth), y: pocketCoverSize + cushionDepth+8 }
    ];
    let rightCushionBody = Bodies.fromVertices(
        tableWidth - ((borderWidth + cushionDepth) / 2), 
        tableHeight/2,
        [rightCushionVertices],
        cushionOptions,
        true
    );

    // Add the cushion to the world
    World.add(world, [
        topLeftCushionBody, 
        topRightCushionBody, 
        bottomLeftCushionBody, 
        bottomRightCushionBody, 
        leftCushionBody, 
        rightCushionBody
    ]);
}