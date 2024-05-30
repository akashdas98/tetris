import { PieceCountMap } from "../../../Types/GameTypes";
import theme from "../../../theme";
import TetrominoCanvas, {
  TetrominoCanvasInterface,
} from "../../TetrominoCanvas/TetrominoCanvas";
import Piece from "../Piece/Piece";

export interface PieceCountCanvasInterface {
  canvas: HTMLCanvasElement;
  scale?: number;
}

export default class PieceCountCanvas extends TetrominoCanvas {
  constructor({ canvas, scale = 0.6 * 30 }: PieceCountCanvasInterface) {
    super({
      canvas,
      scale,
      rows: 21,
      columns: 10,
    });

    this.update();
  }

  public update = (pieceCount?: PieceCountMap) => {
    this.clear();
    this.drawText({
      text: "PIECE-COUNT",
      position: [this.matrix[0].length / 2, 1.5],
      align: "center",
      fontSize: this.scale,
    });
    const pieces: Piece[] = TetrominoCanvas.getTetrisPieces();
    for (let i = 0; i < 7; i++) {
      const piece = pieces[i];
      const y = 4 + i * 2.5 + (piece.getId() === "I" ? 0 : 0.5);
      const x = 2;
      this.drawPiece(piece, [x, y]);

      const count = pieceCount?.[piece.getId()] ?? 0;
      this.drawText({
        text: count,
        position: [this.matrix[0].length - 1, y],
        align: "right",
        fontSize: this.scale * 1.5,
      });
    }
  };
}
