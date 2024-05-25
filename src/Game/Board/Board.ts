import Piece from "../Piece/Piece";
import TetrominoCanvas from "../../Classes/TetrominoCanvas/TetrominoCanvas";
import { lightenHexColor } from "../../utils";

export default class Board extends TetrominoCanvas {
  private totalLinesCleared: number;

  constructor(canvas: HTMLCanvasElement, scale: number = 30) {
    super(canvas, scale, 20, 10);
    this.totalLinesCleared = 0;
  }

  public drawPiece = (piece: Piece): void => {
    const { getColor, getMatrix, getPosition } = piece;
    const color = getColor();
    const position = getPosition();
    getMatrix().forEach((tile) => {
      this.drawTile(tile[1] + position[1], tile[0] + position[0], color);
    });
  };

  public clearLine = (): number => {
    const height = 20;
    const width = 10;
    let linesToClear = [];

    // First, identify all the full lines
    for (let y = height - 1; y >= 0; y--) {
      if (this.matrix[y].every((cell) => cell.value === 1)) {
        linesToClear.push(y);
      }
    }

    // Move each line down starting from the lowest full line
    for (let i = linesToClear.length - 1; i >= 0; i--) {
      let line = linesToClear[i];
      // Move all lines above this one down
      for (let y = line; y > 0; y--) {
        this.matrix[y] = this.matrix[y - 1];
      }
      // Clear the top row
      this.matrix[0] = Array.from({ length: width }, () => ({
        value: 0,
        color: null,
      }));
    }

    if (linesToClear.length > 0) {
      this.draw();
      this.totalLinesCleared += linesToClear.length;
    }

    return linesToClear.length;
  };

  public maxHeightReached = (): boolean =>
    this.matrix[0].some((cell) => cell.value === 1);

  public addToStack = (piece: Piece) => {
    piece.getMatrix().forEach((tile) => {
      const position = piece.getPosition();
      const row = tile[1] + position[1];
      const col = tile[0] + position[0];
      this.addTileToMatrix({ value: 1, color: piece.getColor() }, row, col);
    });
    this.draw();
  };

  public getTotalLinesCleared = (): number => this.totalLinesCleared;

  protected drawTile = (row: number, column: number, color: string): void => {
    super.drawTile(row, column, color);
    const strokeWidth = this.getStrokeWidth();
    const sparkleSizeX = this.scale / 5;
    const sparkleSizeY = this.scale / 4;
    const sparkleOffsetX = this.scale / 32; // Adjustable offset from the right edge
    const sparkleOffsetY = this.scale / 32; // Adjustable offset from the top edge

    this.ctx.fillStyle = lightenHexColor(color, 0.3);
    this.ctx.fillRect(
      (column + 1) * this.scale - sparkleSizeX - strokeWidth - sparkleOffsetX,
      row * this.scale + strokeWidth + sparkleOffsetY,
      sparkleSizeX,
      sparkleSizeY
    );
  };
}
