import Board from "./Board/Board";
import Piece from "./Piece/Piece";
import TPiece from "./Piece/TPiece";
import IPiece from "./Piece/IPiece";
import OPiece from "./Piece/OPiece";
import SPiece from "./Piece/SPiece";
import JPiece from "./Piece/JPiece";
import ZPiece from "./Piece/ZPiece";
import LPiece from "./Piece/LPiece";
import Scoring from "./Scoring/Scoring";
import Level from "./Level/Level";
import { shuffle } from "../utils";

class Game {
  private board: Board;
  private scoring: Scoring;
  private level: Level;
  private currentPiece: Piece;
  private nextPiece: Piece;
  private stopTimeout: NodeJS.Timeout | undefined;
  private stopped: boolean;
  private currentSpeed: number;
  private isSoftDropping: boolean;
  private lastUpdateTime: number;
  private accumulatedTime: number;
  private frameRequestHandle: number | null;
  private bag: Piece[];

  constructor(
    canvas: HTMLCanvasElement,
    startingLevel: number = 0,
    scale: number = 30,
    onChangeScore?: (...args: any[]) => any,
    onChangeLevel?: (...args: any[]) => any
  ) {
    this.lastUpdateTime = window.performance.now();
    this.board = new Board(canvas, scale);
    this.scoring = new Scoring(onChangeScore);
    this.level = new Level(startingLevel, onChangeLevel);
    this.currentSpeed = this.level.getCurrentSpeed();
    this.bag = [];
    this.nextPiece = this.generateRandomPiece();
    this.currentPiece = this.nextPiece;
    this.isSoftDropping = false;
    this.accumulatedTime = 0;
    this.frameRequestHandle = null;
    this.stopped = true;
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  public startGame = () => {
    this.stopped = false;
    console.log("STARTED");
    this.spawn();
    this.startDropLoop();
  };

  public resizeGameBoard = (scale: number = 30) => {
    this.board.setScale(scale);
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
    const position = this.currentPiece.getPosition();
    let flag = matrix.every((tile) => {
      const newX = tile[0] + position[0] + xOffset;
      const newY = tile[1] + position[1] + yOffset;
      return this.isPositionValid(newX, newY);
    });

    if (flag) {
      this.currentPiece.setPosition(
        position[0] + xOffset,
        position[1] + yOffset
      );
    }
  };

  private isPositionValid = (x: number, y: number) => {
    const boardMatrix = this.board.getMatrix();
    return x >= 0 && x <= 9 && y <= 19 && boardMatrix[y]?.[x]?.value !== 1;
  };

  private startSoftDrop = (): void => {
    if (!this.isSoftDropping) {
      this.updateCurrentSpeed(Math.min(100, this.level.getCurrentSpeed() / 2));
      this.isSoftDropping = true;
    }
  };

  private stopSoftDrop = (): void => {
    this.updateCurrentSpeed(this.level.getCurrentSpeed());
    this.isSoftDropping = false;
  };

  private canDrop = () => {
    const boardMatrix = this.board.getMatrix();
    const matrix = this.currentPiece.getMatrix();
    const position = this.currentPiece.getPosition();
    return matrix.every((tile) => {
      const newY = tile[1] + position[1] + 1;
      return (
        newY <= 19 && boardMatrix[newY]?.[tile[0] + position[0]]?.value !== 1
      );
    });
  };

  private redrawGameBoard = () => {
    this.board.draw();
    this.board.drawPiece(this.currentPiece);
  };

  private updateCurrentSpeed = (speed: number): void => {
    this.currentSpeed = speed;
  };

  private startDropLoop = (): void => {
    this.frameRequestHandle = requestAnimationFrame(this.dropLoop);
  };

  private dropLoop = (timestamp: number): void => {
    const deltaTime = timestamp - this.lastUpdateTime;
    this.lastUpdateTime = timestamp;
    this.accumulatedTime += deltaTime;

    // Use currentSpeed to determine logic update frequency
    while (this.accumulatedTime > this.currentSpeed) {
      if (this.canDrop()) {
        this.drop();
      } else if (!this.stopTimeout) {
        this.queueStop();
      }
      this.accumulatedTime -= this.currentSpeed;
    }

    this.redrawGameBoard();
    if (!this.stopped) {
      this.startDropLoop();
    }
  };

  private spawn = () => {
    this.currentPiece = this.nextPiece;
    this.nextPiece = this.generateRandomPiece();
    this.board.drawPiece(this.currentPiece);
  };

  private drop = () => {
    const position = this.currentPiece.getPosition();
    this.currentPiece.setPosition(position[0], position[1] + 1);
    this.redrawGameBoard();
  };

  private queueStop = () => {
    if (this.stopTimeout) return;
    console.log("STOPPING");
    this.stopTimeout = setTimeout(this.stop, 1000);
  };

  private stop = (): void => {
    console.log("STOPPED");
    this.clearStopTimeout();
    if (this.canDrop()) {
      console.log("STOP CANCELLED");
      return;
    }
    this.clearDropInterval();
    this.stopped = true;
    this.handlePostOps();
    if (this.board.maxHeightReached()) {
      console.log("GAME OVER");
    } else {
      this.startGame();
    }
  };

  private handlePostOps = () => {
    console.log("ADDING TO BOARD");
    this.board.addToStack(this.currentPiece);
    console.log("CLEARING LINES");
    const clearedLines = this.board.clearLine();
    this.scoring.addScore(clearedLines, this.level.getCurrentLevel());
    this.level.updateLevel(this.board.getTotalLinesCleared());
    this.updateCurrentSpeed(this.level.getCurrentSpeed());
  };

  private clearDropInterval = (): void => {
    if (this.frameRequestHandle) {
      cancelAnimationFrame(this.frameRequestHandle);
      this.frameRequestHandle = null;
    }
  };

  private clearStopTimeout = (): void => {
    if (this.stopTimeout) clearTimeout(this.stopTimeout);
    this.stopTimeout = undefined;
  };

  private generateBag = (): Piece[] => {
    const bag: Piece[] = [
      new IPiece(),
      new OPiece(),
      new TPiece(),
      new SPiece(),
      new ZPiece(),
      new JPiece(),
      new LPiece(),
    ];
    return shuffle(bag);
  };

  private generateRandomPiece = (): Piece => {
    if (this.bag.length === 0) {
      this.bag = this.generateBag();
    }
    const nextPiece = this.bag.pop() as Piece;
    return nextPiece;
  };
}

export default Game;
