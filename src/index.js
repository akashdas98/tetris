import { join } from "path";

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
}

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

function createJPiece(x, y) {
    function updateMatrix(pivot) {
        return [
            {x: pivot.x - 1, y: pivot.y},
            {x: pivot.x, y: pivot.y},
            {x: pivot.x + 1, y: pivot.y},
            {x: pivot.x - 1, y: pivot.y - 1},
        ];
    }
    const JPiece = createPiece(updateMatrix);
    JPiece.setPivot(x, y);
    return JPiece;
}

function createLPiece(x, y) {
    function updateMatrix(pivot) {
        return [
            {x: pivot.x - 1, y: pivot.y},
            {x: pivot.x, y: pivot.y},
            {x: pivot.x + 1, y: pivot.y},
            {x: pivot.x + 1, y: pivot.y - 1},
        ];
    }
    const LPiece = createPiece(updateMatrix);
    LPiece.setPivot(x, y);
    return LPiece;
}

function createSPiece(x, y) {
    function updateMatrix(pivot) {
        return [
            {x: pivot.x - 1, y: pivot.y},
            {x: pivot.x, y: pivot.y},
            {x: pivot.x, y: pivot.y - 1},
            {x: pivot.x + 1, y: pivot.y - 1},
        ];
    }
    const SPiece = createPiece(updateMatrix);
    SPiece.setPivot(x, y);
    return SPiece;
}

function createOPiece(x, y) {
    function updateMatrix(pivot) {
        return [
            {x: pivot.x - 1, y: pivot.y},
            {x: pivot.x, y: pivot.y},
            {x: pivot.x - 1, y: pivot.y - 1},
            {x: pivot.x, y: pivot.y - 1},
        ];
    }
    const OPiece = createPiece(updateMatrix);
    OPiece.setPivot(x, y);
    return OPiece;
}

function createZPiece(x, y) {
    function updateMatrix(pivot) {
        return [
            {x: pivot.x - 1, y: pivot.y - 1},
            {x: pivot.x, y: pivot.y},
            {x: pivot.x, y: pivot.y - 1},
            {x: pivot.x + 1, y: pivot.y},
        ];
    }
    const ZPiece = createPiece(updateMatrix);
    ZPiece.setPivot(x, y);
    return ZPiece;
}
