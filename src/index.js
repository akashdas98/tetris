const board = document.querySelector('canvas');
const boardCtx = board.getContext('2d');
const scale = 30;

board.height = 20 * scale;
board.width = 10 * scale;

/*for(let i = scale; i < board.width; i += scale) {
    boardCtx.strokeStyle = 'red';
    boardCtx.beginPath();
    boardCtx.moveTo(i, 0);
    boardCtx.lineTo(i, board.height);
    boardCtx.stroke();
}*/

function matrixMultiply(a, b) {
    let c = [
        a[0][0] * b[0] + a[0][1] * b[1],
        a[1][0] * b[0] + a[1][1] * b[1]
    ]
    return c;
}

let history = 99;
function randomizer() {
    let random = Math.floor(Math.random() * 7);
    if(random === history) {
        random = Math.floor(Math.random() * 7);
    }
    history = random;
    return random;
}

function createPiece(matrix, pivot, id, color) {
    function setPivot(x, y) {
        pivot = [x, y];
    }
    function getPivot() {
        return pivot;
    }
    function getMatrix() {
        return matrix;
    }
    function getColor() {
        return color;
    }
    function draw() {
        boardCtx.fillStyle = color;
        boardCtx.strokeStyle = '#000000';
        matrix.forEach(tile => {
            boardCtx.globalAlpha = 1;
            boardCtx.fillRect((tile[0] + pivot[0]) * scale, (tile[1] + pivot[1])* scale, scale, scale);
            boardCtx.globalAlpha = 0.5;
            boardCtx.strokeRect((tile[0] + pivot[0]) * scale, (tile[1] + pivot[1])* scale, scale, scale);
        });
    }
    function rotate(dir) {
        if(id == 'O') return;
        let rotation = dir == 0? [
            [0, 1],
            [-1, 0]
        ] : [
            [0, -1],
            [1, 0]
        ];
        matrix = matrix.map(tile => {
            return matrixMultiply(rotation, tile);
        });
    }
    return {
        draw, 
        setPivot, 
        getPivot, 
        getMatrix, 
        rotate, 
        getColor,
    };
}

function createTPiece(x, y) {
    const id = 'T';
    const color = '#ff00ff';
    let matrix = [
        [0, - 1],
        [- 1, 0],
        [0, 0],
        [1, 0],
    ];
    const TPiece = createPiece(matrix, [x, y], id, color);
    return TPiece;
}

function createIPiece(x, y) {
    const id = 'I';
    const color = '#00ffff';
    let matrix = [
        [- 1.5, 0.5],
        [- 0.5, 0.5],
        [0.5, 0.5],
        [1.5, 0.5],
    ];
    const IPiece = createPiece(matrix, [x, y], id, color);
    return IPiece;
}

function createJPiece(x, y) {
    const id = 'J';
    const color = '#0000ff';
    let matrix = [
        [- 1, 0],
        [0, 0],
        [1, 0],
        [-1, -1],
    ];
    const JPiece = createPiece(matrix, [x, y], id, color);
    return JPiece;
}

function createLPiece(x, y) {
    const id = 'L';
    const color = '#ff7f00';
    let matrix = [
        [-1, 0],
        [0, 0],
        [1, 0],
        [1, -1],
    ];
    const LPiece = createPiece(matrix, [x, y], id, color);
    return LPiece;
}

function createSPiece(x, y) {
    const id = 'S';
    const color = '#00ff00';
    let matrix = [
        [-1, 0],
        [0, 0],
        [0, -1],
        [1, -1],
    ];
    const SPiece = createPiece(matrix, [x, y], id, color);
    return SPiece;
}

function createOPiece(x, y) {
    const id = 'O';
    const color = '#ffff00';
    let matrix = [
        [-1, 0],
        [0, 0],
        [-1, -1],
        [0, -1],
    ];
    const OPiece = createPiece(matrix, [x, y], id, color);
    return OPiece;
}

function createZPiece(x, y) {
    const id = 'Z';
    const color = '#ff0000';
    let matrix = [
        [-1, -1],
        [0, 0],
        [0, -1],
        [1, 0],
    ];
    const ZPiece = createPiece(matrix, [x, y], id, color);
    return ZPiece;
}

function spawn() {
    const random = randomizer();
    let piece;
    switch(random) {
        case 0:
            piece = createTPiece(5, 1);
            piece.draw();
            break;
        case 1:
            piece = createIPiece(4.5, -0.5);
            piece.draw();
            break;
        case 2:
            piece = createJPiece(5, 1);
            piece.draw();
            break;
        case 3:
            piece = createLPiece(5, 1);
            piece.draw();
            break;
        case 4:
            piece = createSPiece(5, 1);
            piece.draw();
            break;
        case 5:
            piece = createOPiece(5, 1);
            piece.draw();
            break;
        case 6:
            piece = createZPiece(5, 1);
            piece.draw();
            break;    
    }
}

spawn();