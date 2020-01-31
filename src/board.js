const board = document.querySelector('canvas');
const boardCtx = board.getContext('2d');
const scale = 30;

board.height = 20 * scale;
board.width = 10 * scale;

export {board, boardCtx, scale};