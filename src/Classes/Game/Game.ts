import Board from "./Board/Board";
import { Controls } from "./Controls/Controls";
import PieceController from "./PieceController/PieceController";
import Statistics, { StatisticsInterface } from "./Statistics/Statistics";

interface GameInterface {
  boardCanvas: HTMLCanvasElement;
  startingLevel: number;
  scale: number;
  nextPieceCanvas?: HTMLCanvasElement;
  pieceCountCanvas?: HTMLCanvasElement;
  onChangeScore?: StatisticsInterface["scoringCb"];
  onChangeLevel?: StatisticsInterface["levelCb"];
  onChangeStats?: StatisticsInterface["cb"];
}

class Game {
  private pieceController: PieceController;
  private board: Board;
  private controls: Controls;
  private statistics: Statistics;

  private stopTimeout: NodeJS.Timeout | undefined;
  private stopped: boolean;
  private currentSpeed: number;
  private isSoftDropping: boolean;
  private lastUpdateTime: number;
  private accumulatedTime: number;
  private frameRequestHandle: number | null;

  constructor({
    boardCanvas,
    startingLevel = 0,
    scale = 30,
    nextPieceCanvas,
    pieceCountCanvas,
    onChangeScore,
    onChangeLevel,
    onChangeStats,
  }: GameInterface) {
    this.lastUpdateTime = window.performance.now();
    this.pieceController = new PieceController();
    this.board = new Board(boardCanvas, scale);
    this.controls = new Controls({
      game: this,
      board: this.board,
      pieceController: this.pieceController,
    });
    this.controls.initialize();
    this.statistics = new Statistics({
      cb: onChangeStats,
      scoringCb: onChangeScore,
      levelCb: onChangeLevel,
      startingLevel,
      scale,
      nextPieceCanvas,
      pieceCountCanvas,
    });
    this.currentSpeed = this.statistics.getLevel().getCurrentSpeed();
    this.isSoftDropping = false;
    this.accumulatedTime = 0;
    this.frameRequestHandle = null;
    this.stopped = true;
  }

  public startGame = () => {
    this.stopped = false;
    console.log("STARTED");
    this.pieceController.spawn();
    this.statistics.drawNextPiece(this.pieceController.getNextPiece());
    this.board.drawPiece(this.pieceController.getCurrentPiece());
    this.startDropLoop();
  };

  public setScale = (scale: number = 30) => {
    this.board.setScale(scale);
    this.statistics.setScale(scale);
  };

  public redrawGameBoard = () => {
    this.board.draw();
    this.board.drawPiece(this.pieceController.getCurrentPiece());
  };

  public startSoftDrop = (): void => {
    if (!this.isSoftDropping) {
      this.updateCurrentSpeed(
        Math.min(100, this.statistics.getLevel().getCurrentSpeed() / 2)
      );
      this.isSoftDropping = true;
    }
  };

  public stopSoftDrop = (): void => {
    this.updateCurrentSpeed(this.statistics.getLevel().getCurrentSpeed());
    this.isSoftDropping = false;
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
      if (this.pieceController.canDrop(this.board.getMatrix())) {
        this.pieceController.drop();
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

  private queueStop = () => {
    if (this.stopTimeout) return;
    console.log("STOPPING");
    this.stopTimeout = setTimeout(this.stop, 1000);
  };

  private stop = (): void => {
    console.log("STOPPED");
    this.clearStopTimeout();
    if (this.pieceController.canDrop(this.board.getMatrix())) {
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
    const scoring = this.statistics.getScoring();
    const level = this.statistics.getLevel();

    console.log("ADDING TO BOARD");
    this.board.addToStack(this.pieceController.getCurrentPiece());

    console.log("CLEARING LINES");
    const clearedLines = this.board.clearLine();

    this.statistics.incrementTotalLinesCleared(clearedLines);
    this.statistics.incrementPieceCount(
      this.pieceController.getCurrentPiece().getId()
    );
    scoring.addScore(clearedLines, level.getCurrentLevel());
    level.updateLevel(this.statistics.getTotalLinesCleared());
    this.updateCurrentSpeed(level.getCurrentSpeed());
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
}

export default Game;
