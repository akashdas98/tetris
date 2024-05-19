import IPiece from "../../Game/Piece/IPiece";
import OPiece from "../../Game/Piece/OPiece";
import Piece, { PieceInterface } from "../../Game/Piece/Piece";
import TPiece from "../../Game/Piece/TPiece";
import SPiece from "../../Game/Piece/SPiece";
import { mutifyHexColor, shuffle } from "../../utils";
import TetrominoCanvas from "../TetrominoCanvas/TetrominoCanvas";
import ZPiece from "../../Game/Piece/ZPiece";
import JPiece from "../../Game/Piece/JPiece";
import LPiece from "../../Game/Piece/LPiece";

type PieceData = {
  shapes: PieceInterface["matrix"][];
  color: string;
};

export default class BackgroundCanvas extends TetrominoCanvas {
  private TETRIS_PIECES: PieceData[];

  constructor(
    canvas: HTMLCanvasElement,
    scale: number = 30,
    rows: number = 10,
    columns: number = 10
  ) {
    super(canvas, scale, rows, columns);
    this.TETRIS_PIECES = [
      new IPiece(),
      new OPiece(),
      new TPiece(),
      new SPiece(),
      new ZPiece(),
      new JPiece(),
      new LPiece(),
    ].map((piece: Piece) => {
      const shapes = [0, 0, 0, 0].map(() => {
        const matrix = piece.getMatrix();
        piece.freeRotate(1);
        return matrix;
      });

      return {
        shapes: shapes,
        color: piece.getColor(),
      };
    });
  }

  private canPlacePiece = (
    shape: PieceInterface["matrix"],
    row: number,
    col: number
  ): boolean => {
    for (let i = 0; i < shape.length; i++) {
      const tile = shape[i];
      if (
        !this.matrix[row + tile[1]] ||
        !this.matrix[row + tile[1]][col + tile[0]] ||
        this.matrix[row + tile[1]][col + tile[0]].value === 1
      ) {
        return false;
      }
    }
    return true;
  };

  private placePiece = (
    { shape, color }: { shape: PieceInterface["matrix"]; color: string },
    row: number,
    col: number
  ): void => {
    for (let i = 0; i < shape.length; i++) {
      const tile = shape[i];
      this.matrix[row + tile[1]][col + tile[0]] = { value: 1, color };
    }
  };

  private isPieceUsedTooOften = (
    pieceColor: string,
    row: number,
    col: number,
    proximity: number
  ): boolean => {
    let count = 0;
    for (
      let r = Math.max(0, row - proximity);
      r <= Math.min(this.matrix.length - 1, row + proximity);
      r++
    ) {
      for (
        let c = Math.max(0, col - proximity);
        c <= Math.min(this.matrix[0].length - 1, col + proximity);
        c++
      ) {
        if (this.matrix[r][c].color === pieceColor) {
          count++;
          if (count > 2) {
            return true;
          }
        }
      }
    }
    return false;
  };

  public generateBackground = (): void => {
    const cols = this.matrix[0].length;
    const rows = this.matrix.length;
    const proximity = 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (this.matrix[row]?.[col]?.value === 0) {
          let piecePlaced = false;
          let pieceIndices = Array.from(
            Array(this.TETRIS_PIECES.length).keys()
          );
          pieceIndices = shuffle(pieceIndices);

          for (let pieceIndex of pieceIndices) {
            const piece = this.TETRIS_PIECES[pieceIndex];
            let shapeIndices = Array.from(Array(piece.shapes.length).keys());
            shapeIndices = shuffle(shapeIndices);

            for (let shapeIndex of shapeIndices) {
              const shape = piece.shapes[shapeIndex];
              if (
                this.canPlacePiece(shape, row, col) &&
                !this.isPieceUsedTooOften(piece.color, row, col, proximity)
              ) {
                this.placePiece({ shape, color: piece.color }, row, col);
                piecePlaced = true;
                break;
              }
            }

            if (piecePlaced) break;
          }
        }
      }
    }
    this.draw();
  };

  protected drawTile = (row: number, column: number, color: string): void => {
    const strokeWidth = this.scale / 6;
    const innerScale = this.scale - strokeWidth - 0.65 * strokeWidth;

    this.ctx.strokeStyle = mutifyHexColor(color, 0.4, 0.3);
    this.ctx.lineWidth = strokeWidth;
    this.ctx.strokeRect(
      column * this.scale + strokeWidth / 2,
      row * this.scale + strokeWidth / 2,
      innerScale,
      innerScale
    );
  };
}
