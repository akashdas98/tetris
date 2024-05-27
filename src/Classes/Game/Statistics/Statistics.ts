import { PieceId } from "../../../Types/PieceTypes";
import GameUI, { GameUIInterface } from "../../GameUI/GameUI";
import TetrominoCanvas from "../../TetrominoCanvas/TetrominoCanvas";
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
  private pieceCount: Record<PieceId, number>;

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
      ? new TetrominoCanvas(nextPieceCanvas, scale, 3, 5)
      : undefined;
    this.pieceCountCanvas = pieceCountCanvas
      ? new TetrominoCanvas(pieceCountCanvas, 0.75 * scale, 22, 12)
      : undefined;
    this.pieceCount = TetrominoCanvas.getPieceData().reduce((acc, data) => {
      acc[data.id] = 0;
      return acc;
    }, {} as Record<PieceId, number>);
    this.board = board;
    this.onChange?.(this.board.getTotalLinesCleared());
  }

  public getLevel = (): Level => this.level;

  public getScoring = (): Scoring => this.scoring;

  public setScale = (scale: number): void => {
    this.nextPieceCanvas?.setScale(scale);
    this.pieceCountCanvas?.setScale(scale);
  };

  public drawNextPiece = (piece: Piece) => {
    this.nextPieceCanvas?.clear();
    this.nextPieceCanvas?.drawPiece(
      piece,
      piece.getId() === "I"
        ? [1.5, 1]
        : piece.getId() === "O"
        ? [1.5, 1.5]
        : [2, 1.5]
    );
  };

  public incrementPieceCount = (id: PieceId) => {
    this.pieceCount[id] = this.pieceCount[id] + 1;
  };
}
