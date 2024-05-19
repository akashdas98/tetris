import { mutifyHexColor } from "../../utils";
import Piece from "../../Game/Piece/Piece";

export type Tile = { value: number; color: string | null };

export type CanvasMatrix = Tile[][];

export default class TetrominoCanvas {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected scale: number;
  protected matrix: CanvasMatrix;

  constructor(
    canvas: HTMLCanvasElement,
    scale: number = 30,
    rows: number = 10,
    columns: number = 10
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.ctx.imageSmoothingEnabled = false;
    this.scale = scale;
    this.canvas.height = rows * this.scale;
    this.canvas.width = columns * this.scale;
    this.matrix = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => ({ value: 0, color: null }))
    );
  }

  protected drawTile = (row: number, column: number, color: string): void => {
    const strokeWidth = this.scale / 6;
    const innerScale = this.scale - strokeWidth - 0.65 * strokeWidth;
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = mutifyHexColor(color, 0.8, 0.8);
    this.ctx.lineWidth = strokeWidth;
    this.ctx.fillRect(
      column * this.scale + strokeWidth / 2,
      row * this.scale + strokeWidth / 2,
      innerScale,
      innerScale
    );
    this.ctx.strokeRect(
      column * this.scale + strokeWidth / 2,
      row * this.scale + strokeWidth / 2,
      innerScale,
      innerScale
    );
  };

  public draw = (): void => {
    this.clear();
    for (let row = 0; row < this.matrix.length; row++) {
      for (let col = 0; col < this.matrix[0].length; col++) {
        const cell = this.matrix[row][col];
        if (cell.value === 1) {
          this.drawTile(row, col, cell.color as string);
        }
      }
    }
  };

  public getMatrix = (): CanvasMatrix => this.matrix;

  public getCtx = (): CanvasRenderingContext2D => this.ctx;

  public clear = (): void =>
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  public addTileToMatrix = (tile: Tile, row: number, col: number) => {
    if (row < this.matrix.length && col < this.matrix[row].length) {
      this.matrix[row][col] = tile;
    }
  };

  public setScale = (scale: number = 30) => {
    this.scale = scale;
    this.canvas.height = this.matrix.length * this.scale;
    this.canvas.width = this.matrix[0].length * this.scale;
  };

  public resizeMatrix = (rows: number, columns: number) => {
    this.matrix = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => ({ value: 0, color: null }))
    );
  };
}
