import { lightenHexColor, mutifyHexColor } from "../../utils";
import Piece, { PieceInterface } from "../../Classes/Game/Piece/Piece";
import theme from "../../theme";
import TPiece from "../Game/Piece/TPiece";
import JPiece from "../Game/Piece/JPiece";
import ZPiece from "../Game/Piece/ZPiece";
import OPiece from "../Game/Piece/OPiece";
import SPiece from "../Game/Piece/SPiece";
import LPiece from "../Game/Piece/LPiece";
import IPiece from "../Game/Piece/IPiece";
import pieceDataFactory from "../../factories/pieceDataFactory";
import {
  CanvasMatrix,
  PieceData,
  PieceMatrix,
  ShapeData,
  Tile,
} from "../../Types/GameTypes";

export interface TetrominoCanvasInterface {
  canvas: HTMLCanvasElement;
  scale?: number;
  rows?: number;
  columns?: number;
  strokeWidthMultiplier?: number;
}

export default class TetrominoCanvas {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected scale: number;
  protected matrix: CanvasMatrix;
  protected strokeWidthMultiplier: number;

  private static TETRIS_PIECES: Piece[] = [
    new TPiece(),
    new JPiece(),
    new ZPiece(),
    new OPiece(),
    new SPiece(),
    new LPiece(),
    new IPiece(),
  ];

  private static PIECE_DATA: PieceData[] =
    this.TETRIS_PIECES.map(pieceDataFactory);

  constructor({
    canvas,
    scale = 30,
    rows = 10,
    columns = 10,
    strokeWidthMultiplier = 1 / 6,
  }: TetrominoCanvasInterface) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.scale = Math.floor(scale);
    this.strokeWidthMultiplier = strokeWidthMultiplier;
    this.canvas.height = rows * this.scale;
    this.canvas.width = columns * this.scale;
    this.canvas.style.background = theme.color.background;
    this.canvas.style.display = "block";
    this.canvas.style.padding = `${this.getGap() / 2}px`;
    this.matrix = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => ({ value: 0, color: null }))
    );
    this.drawTile.bind(this);
    this.setScale.bind(this);
  }

  public static getTetrisPieces = (): Piece[] => [...this.TETRIS_PIECES];

  public static getPieceData = (): PieceData[] => [...this.PIECE_DATA];

  public addShapeToMatrix = (
    { shape, color }: ShapeData,
    row: number,
    col: number
  ): void => {
    for (let i = 0; i < shape.length; i++) {
      const tile = shape[i];
      this.addTileToMatrix({ value: 1, color }, row + tile[1], col + tile[0]);
    }
  };

  public drawPiece = (
    piece: Piece,
    position?: [x: number, y: number]
  ): void => {
    const { getColor, getMatrix, getPosition } = piece;
    const color = getColor();
    position = position || getPosition();
    getMatrix().forEach((tile) => {
      this.drawTile(tile[1] + position![1], tile[0] + position![0], color);
    });
  };

  public draw = (
    startRow: number = 0,
    startCol: number = 0,
    endRow: number = this.matrix.length - 1,
    endCol: number = this.matrix[0]?.length - 1
  ): void => {
    this.clear(startRow - 1, startCol - 1, endRow + 1, endCol + 1);
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const cell = this.matrix[row][col];
        if (cell.value === 1) {
          this.drawTile(row, col, cell.color as string);
        }
      }
    }
  };

  public getMatrix = (): CanvasMatrix => this.matrix;

  public getCtx = (): CanvasRenderingContext2D => this.ctx;

  public clear = (
    startRow: number = 0,
    startCol: number = 0,
    endRow: number = this.matrix.length - 1,
    endCol: number = this.matrix[0]?.length - 1
  ): void => {
    const x = startCol * this.scale;
    const y = startRow * this.scale;
    const width = (endCol - startCol + 1) * this.scale;
    const height = (endRow - startRow + 1) * this.scale;
    this.ctx.clearRect(x, y, width, height);
  };

  public addTileToMatrix = (tile: Tile, row: number, col: number) => {
    if (row < this.matrix.length && col < this.matrix[row]?.length) {
      this.matrix[row][col] = tile;
    }
  };

  public getScale = (): number => this.scale;

  public setScale(scale: number = 30): void {
    this.scale = scale;
    this.canvas.height = this.matrix.length * this.scale;
    this.canvas.width = this.matrix[0].length * this.scale;
    this.canvas.style.padding = `${this.getGap() / 2}px`;
  }

  public resizeMatrix = (rows: number, columns: number) => {
    this.matrix = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => ({ value: 0, color: null }))
    );
  };

  public drawText({
    text,
    position,
    fontSize = this.scale,
    color = theme.color.base,
    align = "left",
  }: {
    text: string | number;
    position: [number, number];
    fontSize?: number;
    color?: string;
    align?: "left" | "right" | "center";
  }): void {
    const [x, y] = position;
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px Pixel Emulator`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(text.toString(), x * this.scale, y * this.scale);
  }

  protected getStrokeWidth = () => this.scale * this.strokeWidthMultiplier;

  protected getGap = () => this.getStrokeWidth() * 0.65;

  protected drawTile(
    row: number,
    column: number,
    color: string,
    saturation?: number,
    lightness?: number
  ): void {
    const strokeWidth = this.getStrokeWidth();
    const gap = this.getGap();
    const strokeGapAdjustment = strokeWidth / 2 + gap / 2;
    const innerScale = this.scale - 2 * strokeGapAdjustment;
    const x = column * this.scale + strokeGapAdjustment;
    const y = row * this.scale + strokeGapAdjustment;

    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = mutifyHexColor(
      color,
      saturation ?? 0.3,
      lightness ?? 0.7
    );
    this.ctx.lineWidth = strokeWidth;

    this.ctx.fillRect(x, y, innerScale, innerScale);
    this.ctx.strokeRect(x, y, innerScale, innerScale);

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
  }

  protected canAddShape = (
    shape: PieceMatrix,
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
}
