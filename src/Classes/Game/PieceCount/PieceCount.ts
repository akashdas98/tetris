import { PieceCountMap, PieceId } from "../../../Types/GameTypes";
import TetrominoCanvas from "../../TetrominoCanvas/TetrominoCanvas";
import GameUI, { GameUIInterface } from "../GameUI/GameUI";
import PieceCountCanvas from "./PieceCountCanvas";

export interface PieceCountInterface extends GameUIInterface {
  canvas?: HTMLCanvasElement;
  scale?: number;
  cb?: (pieceCount: PieceCountMap) => any;
}

export default class PieceCount extends GameUI {
  private pieceCount: PieceCountMap;
  private canvas?: PieceCountCanvas;

  constructor({ canvas, scale, cb }: PieceCountInterface) {
    super({ cb });
    this.canvas = canvas
      ? new PieceCountCanvas({
          canvas,
          scale: scale,
        })
      : undefined;
    this.pieceCount = TetrominoCanvas.getPieceData().reduce((acc, data) => {
      acc[data.id] = 0;
      return acc;
    }, {} as PieceCountMap);
    this.onChange?.(this.pieceCount);
  }

  public incrementPieceCount = (id: PieceId) => {
    this.pieceCount[id] = this.pieceCount[id] + 1;
    this.canvas?.update(this.pieceCount);
    this.onChange?.(this.pieceCount);
  };

  public redraw = () => {
    this.canvas?.update(this.pieceCount);
  };

  public setCanvasScale = (scale: number) => {
    this.canvas?.setScale(scale);
  };

  public getPieceCountCanvas = (): PieceCountCanvas | undefined => this.canvas;
}
