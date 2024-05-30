import { PieceId } from "../../../Types/GameTypes";
import GameUI, { GameUIInterface } from "../GameUI/GameUI";
import TetrominoCanvas from "../../TetrominoCanvas/TetrominoCanvas";
import Level, { LevelInterface } from "../Level/Level";
import Piece from "../Piece/Piece";
import Scoring, { ScoringInterface } from "../Scoring/Scoring";
import PieceCount from "../PieceCount/PieceCount";

export interface StatisticsInterface extends GameUIInterface {
  startingLevel: number;
  cb?: (linesCleared: number) => any;
  scoringCb?: ScoringInterface["cb"];
  levelCb?: LevelInterface["cb"];
  nextPieceCanvas?: HTMLCanvasElement;
  pieceCountCanvas?: HTMLCanvasElement;
  scale?: number;
}

export default class Statistics extends GameUI {
  private scoring: Scoring;
  private level: Level;
  private pieceCount: PieceCount;
  private nextPieceCanvas?: TetrominoCanvas;
  private totalLinesCleared: number;

  constructor({
    cb,
    scoringCb,
    levelCb,
    startingLevel,
    nextPieceCanvas,
    pieceCountCanvas,
    scale = 30,
  }: StatisticsInterface) {
    super({ cb });
    this.scoring = new Scoring({ cb: scoringCb });
    this.level = new Level({ startingLevel, cb: levelCb });
    this.nextPieceCanvas = nextPieceCanvas
      ? new TetrominoCanvas({
          canvas: nextPieceCanvas,
          scale: Math.floor(0.75 * scale),
          rows: 4,
          columns: 5,
        })
      : undefined;
    this.pieceCount = new PieceCount({
      canvas: pieceCountCanvas,
      scale: Math.floor(0.7 * scale),
    });
    this.totalLinesCleared = 0;
    this.onChange?.(this.totalLinesCleared);
  }

  public getLevel = (): Level => this.level;

  public getScoring = (): Scoring => this.scoring;

  public getPieceCount = (): PieceCount => this.pieceCount;

  public setScale = (scale: number): void => {
    this.nextPieceCanvas?.setScale(Math.floor(0.75 * scale));
    this.pieceCount?.setCanvasScale(Math.floor(0.7 * scale));
  };

  public drawNextPiece = (piece: Piece) => {
    this.nextPieceCanvas?.clear();
    this.nextPieceCanvas?.drawText({
      text: "NEXT",
      position: [this.nextPieceCanvas.getMatrix()[0].length / 2, 0.7],
      align: "center",
    });

    const piecePositionOffsetY = 1.1;
    const piecePosition: [number, number] =
      piece.getId() === "I"
        ? [1.5, 1]
        : piece.getId() === "O"
        ? [1.5, 1.5]
        : [2, 1.5];
    piecePosition[1] = piecePosition[1] + piecePositionOffsetY;

    this.nextPieceCanvas?.drawPiece(piece, piecePosition);
  };

  public getTotalLinesCleared = (): number => this.totalLinesCleared;

  public incrementTotalLinesCleared = (lines: number): void => {
    this.totalLinesCleared += lines;
    this.onChange?.(this.totalLinesCleared);
  };
}
