import Board from "../Board/Board";
import Game from "../Game";

export class Controls {
  private game: Game;
  private board: Board;
  private touchStartX: number | null;
  private touchStartY: number | null;
  private touchX: number | null;
  private touchY: number | null;
  private touchMoving: boolean;

  constructor(game: Game, board: Board) {
    this.game = game;
    this.board = board;
    this.touchStartX = null;
    this.touchStartY = null;
    this.touchX = null;
    this.touchY = null;
    this.touchMoving = false;
  }

  public initialize = () => {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("touchstart", this.handleTouchStart);
    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchend", this.handleTouchEnd);
  };

  private handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchX = touch.clientX;
    this.touchY = touch.clientY;
  };

  private handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (
      this.touchX === null ||
      this.touchY === null ||
      this.touchStartX === null ||
      this.touchStartY === null
    )
      return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - this.touchX;
    const deltaY = touch.clientY - this.touchY;
    const touchThreshold = this.board.getScale();

    if (Math.abs(deltaX) > touchThreshold * 1.5) {
      this.touchMoving = true;
    }

    if (Math.abs(deltaX) > touchThreshold && this.touchMoving) {
      this.game.stopSoftDrop();
      if (deltaX > 0) {
        this.tryMove(1, 0); // Swipe right
      } else {
        this.tryMove(-1, 0); // Swipe left
      }
      this.touchX = touch.clientX;
      this.touchY = touch.clientY;
    }

    if (deltaY > touchThreshold * 2) {
      this.game.startSoftDrop(); // Swipe down
      this.touchMoving = false;
    }

    this.game.redrawGameBoard();
  };

  private handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;

    if (this.touchStartX === null || this.touchStartY === null) return;

    const deltaX = endX - this.touchStartX;
    const deltaY = endY - this.touchStartY;
    const touchThreshold = this.board.getScale();

    if (
      Math.abs(deltaX) < touchThreshold &&
      Math.abs(deltaY) < touchThreshold
    ) {
      const windowWidth = window.innerWidth;
      if (endX < windowWidth / 2) {
        this.game.getCurrentPiece().rotate(0, this.board.getMatrix()); // Tap left half to rotate left
      } else {
        this.game.getCurrentPiece().rotate(1, this.board.getMatrix()); // Tap right half to rotate right
      }
    }

    this.touchStartX = null;
    this.touchStartY = null;
    this.touchX = null;
    this.touchY = null;
    this.touchMoving = false;
    this.game.stopSoftDrop();
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    const boardMatrix = this.board.getMatrix();

    switch (e.key) {
      case "ArrowLeft":
        this.tryMove(-1, 0);
        break;
      case "ArrowRight":
        this.tryMove(1, 0);
        break;
      case "ArrowDown":
        this.game.startSoftDrop();
        break;
      case "ArrowUp":
      case "c":
        this.game.getCurrentPiece().rotate(1, boardMatrix);
        break;
      case " ":
        this.game.getCurrentPiece().rotate(0, boardMatrix);
        break;
      default:
        return;
    }

    this.game.redrawGameBoard();
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      this.game.stopSoftDrop();
    }
  };

  private isPositionValid = (x: number, y: number) => {
    const boardMatrix = this.board.getMatrix();
    return x >= 0 && x <= 9 && y <= 19 && boardMatrix[y]?.[x]?.value !== 1;
  };

  private tryMove = (xOffset: number, yOffset: number) => {
    const matrix = this.game.getCurrentPiece().getMatrix();
    const position = this.game.getCurrentPiece().getPosition();
    let flag = matrix.every((tile) => {
      const newX = tile[0] + position[0] + xOffset;
      const newY = tile[1] + position[1] + yOffset;
      return this.isPositionValid(newX, newY);
    });

    if (flag) {
      this.game
        .getCurrentPiece()
        .setPosition(position[0] + xOffset, position[1] + yOffset);
    }
  };
}
