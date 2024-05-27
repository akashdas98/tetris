import { PieceInterface } from "../../Classes/Game/Piece/Piece";
import { mutifyHexColor, shuffle } from "../../utils";
import TetrominoCanvas from "../TetrominoCanvas/TetrominoCanvas";

export default class BackgroundCanvas extends TetrominoCanvas {
  private mouseX: number;
  private mouseY: number;
  private hoverGlowRadius: number;

  constructor(
    canvas: HTMLCanvasElement,
    scale: number = 30,
    rows: number = 10,
    columns: number = 10,
    hoverGlowRadius: number = 2
  ) {
    super(canvas, scale, rows, columns);
    this.hoverGlowRadius = hoverGlowRadius;
    this.mouseX = -this.hoverGlowRadius * this.scale;
    this.mouseY = -this.hoverGlowRadius * this.scale;
    canvas.style.pointerEvents = "auto";
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseleave", this.handleMouseLeave);
  }

  private handleMouseMove = (event: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    this.mouseX = (event.clientX - rect.left) * scaleX;
    this.mouseY = (event.clientY - rect.top) * scaleY;

    this.draw();
  };

  private handleMouseLeave = () => {
    this.mouseX = -this.hoverGlowRadius * this.scale;
    this.mouseY = -this.hoverGlowRadius * this.scale;
    this.draw();
  };

  private getDistanceFromPointer = (row: number, column: number): number => {
    const tileCenterX = column * this.scale + this.scale / 2;
    const tileCenterY = row * this.scale + this.scale / 2;
    const distanceX = this.mouseX - tileCenterX;
    const distanceY = this.mouseY - tileCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    return distance;
  };

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
      this.addTileToMatrix({ value: 1, color }, row + tile[1], col + tile[0]);
    }
  };

  private isPieceUsedTooOften = (
    pieceColor: string,
    row: number,
    col: number,
    proximity: number,
    occurance: number
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
          if (count > occurance) {
            return true;
          }
        }
      }
    }
    return false;
  };

  public generateBackground = (): void => {
    const cols = this.matrix[0]?.length;
    const rows = this.matrix.length;
    const proximity = 3;
    const occurance = 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (this.matrix[row]?.[col]?.value === 0) {
          let piecePlaced = false;
          let pieceIndices = Array.from(
            Array(TetrominoCanvas.TETRIS_PIECES.length).keys()
          );
          pieceIndices = shuffle(pieceIndices);

          for (let pieceIndex of pieceIndices) {
            const piece = TetrominoCanvas.TETRIS_PIECES[pieceIndex];
            let shapeIndices = Array.from(Array(piece.shapes.length).keys());
            shapeIndices = shuffle(shapeIndices);

            for (let shapeIndex of shapeIndices) {
              const shape = piece.shapes[shapeIndex];
              if (
                this.canPlacePiece(shape, row, col) &&
                !this.isPieceUsedTooOften(
                  piece.color,
                  row,
                  col,
                  proximity,
                  occurance
                )
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

  private generateGradient = (
    color: string,
    startSaturation: number,
    startLightness: number
  ): Map<number, string> => {
    const radius = this.hoverGlowRadius;
    const gradientMap = new Map<number, string>();

    // The 0th distance will always be (1, 1)
    gradientMap.set(0, color);

    // Use an exponential decay function for saturation and lightness decrease
    const decayRate = 1.5; // Adjust this rate to control aggressiveness

    for (let i = 1; i <= radius; i++) {
      const decayFactor = i / radius;
      const saturation =
        startSaturation +
        (1 - startSaturation) * Math.exp(-decayRate * decayFactor);
      const lightness =
        startLightness +
        (1 - startLightness) * Math.exp(-decayRate * decayFactor);
      gradientMap.set(i, mutifyHexColor(color, saturation, lightness));
    }

    return gradientMap;
  };

  protected drawTile = (row: number, column: number, color: string): void => {
    const strokeWidth = this.scale / 6;
    const innerScale = this.scale - strokeWidth - 0.65 * strokeWidth;
    const distanceFromPointer = this.getDistanceFromPointer(row, column);
    const distanceInTiles = Math.floor(distanceFromPointer / this.scale);

    const distanceColorMap: Map<number, string> = this.generateGradient(
      color,
      0.4,
      0.3
    );

    this.ctx.strokeStyle =
      distanceColorMap.get(distanceInTiles) || mutifyHexColor(color, 0.4, 0.3);
    this.ctx.lineWidth = strokeWidth;
    this.ctx.strokeRect(
      column * this.scale + strokeWidth / 2,
      row * this.scale + strokeWidth / 2,
      innerScale,
      innerScale
    );
  };
}
