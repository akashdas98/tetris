import Board from "./Board/Board";
import Piece from "./Piece/Piece";
import TPiece from "./Piece/TPiece";
import IPiece from "./Piece/IPiece";
import OPiece from "./Piece/OPiece";
import SPiece from "./Piece/SPiece";
import JPiece from "./Piece/JPiece";
import ZPiece from "./Piece/ZPiece";
import LPiece from "./Piece/LPiece";

class Game {
  private board: Board;
  private history: number = 99;
  private currentPiece: Piece;
  private nextPiece: Piece;
  private timeout: NodeJS.Timeout | undefined;
  private interval: NodeJS.Timeout | undefined;
  private normalDrop: number = 100;
  private softDrop: number = 50;
  private stopped: boolean;
  private currentSpeed: number;
  private isSoftDropping: boolean;
  private lastUpdateTime: number;
  private accumulatedTime: number;
  private frameRequestHandle: number | null;

  constructor() {
    this.lastUpdateTime = window.performance.now();
    this.board = new Board(
      document.querySelector("canvas") as HTMLCanvasElement
    );
    this.nextPiece = this.generateRandomPiece();
    this.currentPiece = this.generateRandomPiece();
    this.currentSpeed = this.normalDrop;
    this.isSoftDropping = false;
    this.accumulatedTime = 0;
    this.frameRequestHandle = null;
    this.stopped = true;
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

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
        this.startSoftDrop();
        break;
      case "ArrowUp":
      case "c":
        this.currentPiece.rotate(1, boardMatrix);
        break;
      case " ":
        this.currentPiece.rotate(0, boardMatrix);
        break;
      default:
        return;
    }

    this.redrawGameBoard();
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      this.stopSoftDrop();
    }
  };

  private tryMove = (xOffset: number, yOffset: number) => {
    const matrix = this.currentPiece.getMatrix();
    const pivot = this.currentPiece.getPivot();
    let flag = matrix.every((tile) => {
      const newX = tile[0] + pivot[0] + xOffset;
      const newY = tile[1] + pivot[1] + yOffset;
      return this.isPositionValid(newX, newY);
    });

    if (flag) {
      this.currentPiece.setPivot(pivot[0] + xOffset, pivot[1] + yOffset);
    }
  };

  private isPositionValid = (x: number, y: number) => {
    const boardMatrix = this.board.getMatrix();
    return x >= 0 && x <= 9 && y <= 19 && boardMatrix[y]?.[x]?.value !== 1;
  };

  private startSoftDrop() {
    if (!this.isSoftDropping) {
      this.currentSpeed = this.softDrop;
      this.isSoftDropping = true;
    }
  }

  private stopSoftDrop() {
    this.currentSpeed = this.normalDrop;
    this.isSoftDropping = false;
  }

  private canDrop = () => {
    const boardMatrix = this.board.getMatrix();
    const matrix = this.currentPiece.getMatrix();
    const pivot = this.currentPiece.getPivot();
    return matrix.every((tile) => {
      const newY = tile[1] + pivot[1] + 1;
      return newY <= 19 && boardMatrix[newY]?.[tile[0] + pivot[0]]?.value !== 1;
    });
  };

  private redrawGameBoard = () => {
    this.board.draw();
    this.board.drawPiece(this.currentPiece);
  };

  public startGame = () => {
    this.stopped = false;
    this.spawn();
    this.frameRequestHandle = requestAnimationFrame(this.startDropLoop);
  };

  private startDropLoop = (timestamp: number) => {
    const deltaTime = timestamp - this.lastUpdateTime;
    this.lastUpdateTime = timestamp;
    this.accumulatedTime += deltaTime;

    // Use currentSpeed to determine logic update frequency
    while (this.accumulatedTime > this.currentSpeed) {
      if (this.canDrop()) {
        this.drop();
      } else if (!this.timeout) {
        this.queueStop();
      }
      this.accumulatedTime -= this.currentSpeed;
    }

    this.redrawGameBoard();
    if (!this.stopped) {
      this.frameRequestHandle = requestAnimationFrame(this.startDropLoop);
    }
  };

  private spawn = () => {
    this.currentPiece = this.nextPiece;
    this.nextPiece = this.generateRandomPiece();
    this.board.drawPiece(this.currentPiece);
  };

  private drop = () => {
    const pivot = this.currentPiece.getPivot();
    this.currentPiece.setPivot(pivot[0], pivot[1] + 1);
    this.redrawGameBoard();
  };

  private queueStop = () => {
    if (this.timeout) return;
    this.timeout = setTimeout(this.stop, 1000);
  };

  private stop = (): void => {
    if (this.canDrop()) return;
    this.clearDropInterval();
    this.clearStopTimeout();
    this.stopped = true;
    this.board.addToStack(this.currentPiece);
    this.board.clearLine();
    if (this.board.maxHeightReached()) {
    } else {
      this.startGame();
    }
  };

  private clearDropInterval = (): void => {
    if (this.frameRequestHandle) {
      cancelAnimationFrame(this.frameRequestHandle);
      this.frameRequestHandle = null;
    }
  };

  private clearStopTimeout = (): void => {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = undefined;
  };

  private randomizer = (): number => {
    let random = Math.floor(Math.random() * 7);
    while (random === this.history) {
      random = Math.floor(Math.random() * 7);
    }
    this.history = random;
    return random;
  };

  private generateRandomPiece = (): Piece => {
    const random = this.randomizer();
    let piece: Piece;
    switch (random) {
      case 0:
        piece = new TPiece(5, 0);
        break;
      case 1:
        piece = new IPiece(4.5, -0.5);
        break;
      case 2:
        piece = new JPiece(5, 0);
        break;
      case 3:
        piece = new LPiece(5, 0);
        break;
      case 4:
        piece = new SPiece(5, 0);
        break;
      case 5:
        piece = new OPiece(5, 0);
        break;
      default:
        piece = new ZPiece(5, 0);
        break;
    }
    return piece;
  };
}

export default Game;
