const board = document.querySelector('canvas');
const boardCtx = board.getContext('2d');
const scale = 30;

board.height = 20 * scale;
board.width = 10 * scale;

for(let i = scale; i < board.width; i += scale) {
    boardCtx.strokeStyle = 'red';
    boardCtx.beginPath();
    boardCtx.moveTo(i, 0);
    boardCtx.lineTo(i, board.height);
    boardCtx.stroke();
} 

function createPiece(updateMatrix) {
    let pivot;
    let matrix;
    function setPivot(x, y) {
        pivot = {x, y};
        matrix = updateMatrix(pivot);
    }
    function draw() {
        boardCtx.fillStyle = '#ffffff';
        matrix.forEach(Tile => {
            boardCtx.fillRect(Tile.x * scale, Tile.y * scale, scale, scale);
        });
    }
    return {draw, setPivot};
};

function createTPiece(x, y) {
    function updateMatrix(pivot) {
        return [
            {x: pivot.x, y: pivot.y - 1},
            {x: pivot.x - 1, y: pivot.y},
            {x: pivot.x, y: pivot.y},
            {x: pivot.x + 1, y: pivot.y},
        ];
    }
    const TPiece = createPiece(updateMatrix);
    TPiece.setPivot(x, y);
    return TPiece;
}

function createIPiece(x, y) {
    function updateMatrix(pivot) {
        return [
            {x: pivot.x - 1.5, y: pivot.y + 0.5},
            {x: pivot.x - 0.5, y: pivot.y + 0.5},
            {x: pivot.x + 0.5, y: pivot.y + 0.5},
            {x: pivot.x + 1.5, y: pivot.y + 0.5},
        ];
    }
    const IPiece = createPiece(updateMatrix);
    IPiece.setPivot(x, y);
    return IPiece;
}

const I = createIPiece(1.5, -0.5);
I.draw();
I.setPivot(2.5, 2.5);
I.draw();
console.log(I);