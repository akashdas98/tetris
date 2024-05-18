import { mutifyHexColor } from "../../utils";
import Piece from "../Piece/Piece";

export type BoardMatrix = { value: number; color: string | null }[][];

export default class Board {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scale: number;
  private matrix: BoardMatrix;
  private totalLinesCleared: number;

  constructor(canvas: HTMLCanvasElement, scale: number = 30) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.ctx.imageSmoothingEnabled = false;
    this.scale = scale;
    this.canvas.height = 20 * this.scale;
    this.canvas.width = 10 * this.scale;
    this.totalLinesCleared = 0;
    this.matrix = Array.from({ length: 20 }, () =>
      Array.from({ length: 10 }, () => ({ value: 0, color: null }))
    );
  }

  private drawTile = (x: number, y: number, color: string): void => {
    const strokeWidth = 6;
    const innerScale = this.scale - strokeWidth - 4;
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = mutifyHexColor(color, 0.8, 0.8);
    this.ctx.lineWidth = strokeWidth;
    this.ctx.fillRect(
      x * this.scale + strokeWidth / 2,
      y * this.scale + strokeWidth / 2,
      innerScale,
      innerScale
    );
    this.ctx.strokeRect(
      x * this.scale + strokeWidth / 2,
      y * this.scale + strokeWidth / 2,
      innerScale,
      innerScale
    );
  };

  public drawPiece = (piece: Piece): void => {
    const { getPivot, getColor, getMatrix } = piece;
    const pivot = getPivot();
    const color = getColor();
    getMatrix().forEach((tile) => {
      this.drawTile(tile[0] + pivot[0], tile[1] + pivot[1], color);
    });
  };

  public draw = (): void => {
    this.clear();
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = this.matrix[y][x];
        if (cell.value === 1) {
          this.drawTile(x, y, cell.color as string);
        }
      }
    }
  };

  public getMatrix = (): BoardMatrix => this.matrix;

  public getCtx = (): CanvasRenderingContext2D => this.ctx;

  public clear = (): void =>
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
      const pivot = piece.getPivot();
      const cell = this.matrix[tile[1] + pivot[1]]?.[tile[0] + pivot[0]];
      if (cell) {
        cell.value = 1;
        cell.color = piece.getColor();
      }
    });
  };

  public getTotalLinesCleared = (): number => this.totalLinesCleared;

  public setScale = (scale: number = 30) => {
    this.scale = scale;
    this.canvas.height = 20 * this.scale;
    this.canvas.width = 10 * this.scale;
    this.draw();
  };
}
