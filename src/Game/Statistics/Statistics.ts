import GameUI, { GameUIInterface } from "../../Classes/GameUI/GameUI";
import TetrominoCanvas from "../../Classes/TetrominoCanvas/TetrominoCanvas";
import Board from "../Board/Board";
import Level, { LevelInterface } from "../Level/Level";
import Piece from "../Piece/Piece";
import Scoring, { ScoringInterface } from "../Scoring/Scoring";

export interface StatisticsInterface extends GameUIInterface {
  board: Board;
  startingLevel: number;
  cb?: ({ linesCleared }: { linesCleared: number }) => any;
  scoringCb?: ScoringInterface["cb"];
  levelCb?: LevelInterface["cb"];
  nextPieceCanvas?: HTMLCanvasElement;
  pieceCountCanvas?: HTMLCanvasElement;
  scale?: number;
}

export default class Statistics extends GameUI {
  private scoring: Scoring;
  private level: Level;
  private nextPieceCanvas?: TetrominoCanvas;
  private pieceCountCanvas?: TetrominoCanvas;
  private board: Board;

  constructor({
    cb,
    scoringCb,
    levelCb,
    board,
    startingLevel,
    nextPieceCanvas,
    pieceCountCanvas,
    scale = 30,
  }: StatisticsInterface) {
    super({ cb });
    this.scoring = new Scoring({ cb: scoringCb });
    this.level = new Level({ startingLevel, cb: levelCb });
    this.nextPieceCanvas = nextPieceCanvas
      ? new TetrominoCanvas(nextPieceCanvas, scale, 5, 5)
      : undefined;
    this.pieceCountCanvas = pieceCountCanvas
      ? new TetrominoCanvas(pieceCountCanvas, scale, 5, 5)
      : undefined;
    this.board = board;
    this.onChange?.(this.board.getTotalLinesCleared());
  }

  public getLevel = (): Level => this.level;

  public getScoring = (): Scoring => this.scoring;

  public setScale = (scale: number): void => {
    this.nextPieceCanvas?.setScale(scale);
    this.pieceCountCanvas?.setScale(scale);
  };
}
