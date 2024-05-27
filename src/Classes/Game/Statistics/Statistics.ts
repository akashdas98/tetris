import { PieceId } from "../../../Types/GameTypes";
import GameUI, { GameUIInterface } from "../../GameUI/GameUI";
import TetrominoCanvas from "../../TetrominoCanvas/TetrominoCanvas";
import Level, { LevelInterface } from "../Level/Level";
import Piece from "../Piece/Piece";
import Scoring, { ScoringInterface } from "../Scoring/Scoring";

export interface StatisticsInterface extends GameUIInterface {
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
  private pieceCount: Record<PieceId, number>;
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
      ? new TetrominoCanvas(nextPieceCanvas, scale, 3, 5)
      : undefined;
    this.pieceCountCanvas = pieceCountCanvas
      ? new TetrominoCanvas(pieceCountCanvas, 0.75 * scale, 22, 12)
      : undefined;
    this.pieceCount = TetrominoCanvas.getPieceData().reduce((acc, data) => {
      acc[data.id] = 0;
      return acc;
    }, {} as Record<PieceId, number>);
    this.totalLinesCleared = 0;
    this.drawPieceCount();
    this.onChange?.(this.totalLinesCleared);
  }

  public drawPieceCount = () => {
    const pieces: Piece[] = TetrominoCanvas.getTetrisPieces();
    for (let i = 0; i < 7; i++) {
      const piece = pieces[i];
      const y = 2 + i * 2.5 + (piece.getId() === "I" ? 0 : 0.5);
      const x = 1;
      this.pieceCountCanvas?.drawPiece(piece, [x, y]);
    }
  };

  public getLevel = (): Level => this.level;

  public getScoring = (): Scoring => this.scoring;

  public setScale = (scale: number): void => {
    this.nextPieceCanvas?.setScale(scale);
    this.pieceCountCanvas?.setScale(0.75 * scale);
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

  public getTotalLinesCleared = (): number => this.totalLinesCleared;

  public incrementTotalLinesCleared = (lines: number): void => {
    this.totalLinesCleared += lines;
  };
}
