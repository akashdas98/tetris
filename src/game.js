import pieces from './pieces';
import {board, boardCtx, scale} from './board';

function createNewGame() {
    let history = 99;
    let currentPiece;
    let nextPiece = generateRandomPiece();
    let boardMatrix = [];
    let matrix;
    let pivot;
    let timeout;
    let interval;
    let normalDrop = 100;
    let softDrop = 50;
    let stopped = true;
    let count = 0;

    for(let x = 0; x < 10; x++) {
        boardMatrix[x] = [];
    }
    boardMatrix.forEach(x => {
        for(let y = 0; y < 20; y++) {
            x[y] = {value: 0, color: null};
        }
    });

    function handleKeyDown(e) {
        let flag = 1;
        if(count === 10) {
            return;
        }
        switch(e.key) {
            case 'ArrowLeft':
                matrix.forEach(tile => {
                    if(tile[0] + pivot[0] === 0) {
                        flag = 0;
                    } else if(boardMatrix[tile[0] + pivot[0] - 1][tile[1] + pivot[1]]) {
                        if(boardMatrix[tile[0] + pivot[0] - 1][tile[1] + pivot[1]].value === 1) {
                            flag = 0;
                        }
                    }
                });
                if(flag === 1) {
                    currentPiece.setPivot(pivot[0] - 1, pivot[1]);
                }
                flag = 1;
                break;
            case 'ArrowRight':
                matrix.forEach(tile => {
                    if(tile[0] + pivot[0] === 9) {
                        flag = 0;
                    } else if(boardMatrix[tile[0] + pivot[0] + 1][tile[1] + pivot[1]]) {
                        if(boardMatrix[tile[0] + pivot[0] + 1][tile[1] + pivot[1]].value === 1) {
                            flag = 0;
                        }
                    }
                });
                
                if(flag === 1) {
                    currentPiece.setPivot(pivot[0] + 1, pivot[1]);
                }
                flag = 1;
                break;
            case 'ArrowDown':
                matrix.forEach(tile => {
                    if(tile[1] + pivot[1] >= 0) {
                        if(tile[1] + pivot[1] === 19) {
                            flag = 0;
                        } else if(boardMatrix[tile[0] + pivot[0]][tile[1] + pivot[1] + 1]) {
                            if(boardMatrix[tile[0] + pivot[0]][tile[1] + pivot[1] + 1].value === 1) {
                                flag = 0;
                            }
                        }
                    }
                });
                if(flag === 1) {
                    clearInterval(interval);
                    drop(softDrop);
                }
                flag = 1;
                break;
            case 'ArrowUp' || 'c':
                currentPiece.rotate(1, boardMatrix);
                flag = 1;
                break;
            case ' ':
                currentPiece.rotate(0, boardMatrix);
                flag = 1;
                break;
        }
        pivot = currentPiece.getPivot();
        matrix = currentPiece.getMatrix();
        boardCtx.clearRect(0, 0, board.width, board.height);
        currentPiece.draw();
        draw();
        if(stopped) {
            for(let i = 0; i < matrix.length; i++) {
                if(matrix[i][1] + pivot[1] >= 0) {
                    if(matrix[i][1] + pivot[1] === 19 || boardMatrix[matrix[i][0] + pivot[0]][matrix[i][1] + pivot[1] + 1].value === 1) {
                        flag = 0;
                    }
                }
            }
            if(flag === 1) {
                stopped = !stopped;
                clearInterval(interval);
                drop(normalDrop);
                count = 0; 
            }
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if(stopped) {
                    addToStack();
                    clear();
                    start();
                    count = 0;
                }
            }, 1000);
            count++;
        }
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', (e) => {
        if(e.key === 'ArrowDown') {
            clearInterval(interval);
            if(!stopped) {
                drop(normalDrop);
            }
        }
    });

    function start() {
        count = 0;
        stopped = false;
        spawn();
        drop(normalDrop);
    }

    function stop() {
        clearInterval(interval);
        stopped = true;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if(stopped) {
                addToStack();
                clear();
                start();
            }
        }, 1000);
    }

    function randomizer() {
        let random = Math.floor(Math.random() * 7);
        if(random === history) {
            random = Math.floor(Math.random() * 7);
        }
        history = random;
        return random;
    }
    
    function generateRandomPiece() {
        const random = randomizer();
        let piece;
        switch(random) {
            case 0:
                piece = pieces.createTPiece(5, -1);
                //piece.draw();
                break;
            case 1:
                piece = pieces.createIPiece(4.5, -1.5);
                //piece.draw();
                break;
            case 2:
                piece = pieces.createJPiece(5, -1);
                //piece.draw();
                break;
            case 3:
                piece = pieces.createLPiece(5, -1);
                //piece.draw();
                break;
            case 4:
                piece = pieces.createSPiece(5, -1);
                //piece.draw();
                break;
            case 5:
                piece = pieces.createOPiece(5, -1);
                //piece.draw();
                break;
            case 6:
                piece = pieces.createZPiece(5, 1);
                //piece.draw();
                break;    
        }
        return piece;
    }

    function spawn() {
        currentPiece = nextPiece;
        nextPiece = generateRandomPiece();
        currentPiece.draw();
        pivot = currentPiece.getPivot();
        matrix = currentPiece.getMatrix();
    }

    function drop(speed) {
        interval = setInterval(() => {
            pivot = currentPiece.getPivot();
            matrix = currentPiece.getMatrix();
            for(let i = 0; i < matrix.length; i++) {
                if(matrix[i][1] + pivot[1] >= 0) {
                    if(matrix[i][1] + pivot[1] === 19 || boardMatrix[matrix[i][0] + pivot[0]][matrix[i][1] + pivot[1] + 1].value === 1) {
                        stop();
                        return;
                    }
                }
            }
            boardCtx.clearRect(0, 0, board.width, board.height);
            currentPiece.setPivot(pivot[0], pivot[1] + 1);
            currentPiece.draw();
            draw();
        }, speed);
    }

    function draw() {
        boardMatrix.forEach((column, x) => {
            column.forEach((row, y) => {
                if(boardMatrix[x][y].value === 1) {
                    boardCtx.fillStyle = boardMatrix[x][y].color;
                    boardCtx.strokeStyle = '#000000';
                    boardCtx.globalAlpha = 1;
                    boardCtx.fillRect(x * scale, y * scale, scale, scale);
                    boardCtx.globalAlpha = 0.5;
                    boardCtx.strokeRect(x * scale, y * scale, scale, scale);
                }
            });
        });
    }

    function addToStack() {
        matrix.forEach((tile) => {
            boardMatrix[tile[0] + pivot[0]][tile[1] + pivot[1]].value = 1;
            boardMatrix[tile[0] + pivot[0]][tile[1] + pivot[1]].color = currentPiece.getColor();
        });
        /*if(boardMatrix[4][0].value === 1) {
            over();
        }*/
    }

    function clear() {
        for(let y = 0; y < 20; y++) {
            let flag = 1;
            for(let x = 0; x < 10; x++) {
                if(boardMatrix[x][y].value !== 1) {
                    flag = 0;
                }
            }
            if(flag === 1) {
                for(let x = 0; x < 10; x++) {
                    boardMatrix[x][y].value = 0;
                    boardMatrix[x][y].color = null;
                }
                for(let y1 = y-1; y1 >= 0; y1--) {
                    for(let x = 0; x < 10; x++) {
                        boardMatrix[x][y1+1] = boardMatrix[x][y1];
                    }
                }
            }
        }
        draw();
    }

    return {
        start,
    };
}

export default createNewGame;