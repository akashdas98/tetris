import { mutifyHexColor, shuffle } from "../../utils";
import TetrominoCanvas, {
  TetrominoCanvasInterface,
} from "../TetrominoCanvas/TetrominoCanvas";

export interface BackgroundCanvasInterface extends TetrominoCanvasInterface {
  hoverGlowRadius?: number;
  trailDelay?: number;
}

export default class BackgroundCanvas extends TetrominoCanvas {
  private mouseX: number;
  private mouseY: number;
  private hoverGlowRadius: number;
  private rect: DOMRect;
  private distanceColorMap: [number, number][];
  private tilesToClear: Set<string>;
  private trailDelay: number;

  constructor({
    canvas,
    scale,
    rows,
    columns,
    hoverGlowRadius = 3,
    trailDelay = 120,
  }: BackgroundCanvasInterface) {
    super({ canvas, scale, rows, columns });
    this.hoverGlowRadius = hoverGlowRadius;
    this.mouseX = -this.hoverGlowRadius * this.scale;
    this.mouseY = -this.hoverGlowRadius * this.scale;
    canvas.style.pointerEvents = "auto";
    this.rect = this.canvas.getBoundingClientRect();
    this.distanceColorMap = this.generateGradient(0.4, 0.3);
    this.tilesToClear = new Set();
    this.trailDelay = trailDelay;
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseleave", this.handleMouseLeave);
  }

  private handleMouseMove = (event: MouseEvent) => {
    const rect = this.rect;
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    this.mouseX = (event.clientX - rect.left) * scaleX;
    this.mouseY = (event.clientY - rect.top) * scaleY;

    const tileX = Math.floor(this.mouseX / this.scale);
    const tileY = Math.floor(this.mouseY / this.scale);

    const startRow = Math.max(0, tileY - this.hoverGlowRadius);
    const endRow = Math.min(
      this.matrix.length - 1,
      tileY + this.hoverGlowRadius
    );
    const startCol = Math.max(0, tileX - this.hoverGlowRadius);
    const endCol = Math.min(
      this.matrix[0].length - 1,
      tileX + this.hoverGlowRadius
    );

    this.drawGlow(startRow, startCol, endRow, endCol);
  };

  private handleMouseLeave = () => {
    this.mouseX = -this.hoverGlowRadius * this.scale;
    this.mouseY = -this.hoverGlowRadius * this.scale;
    this.clearPreviousHighlights();
    this.draw();
  };

  private clearPreviousHighlights() {
    this.tilesToClear?.forEach((tile) => {
      const [row, col] = tile.split(",").map(Number);
      if (this.matrix[row][col].value === 1) {
        this.drawTile(row, col, this.matrix[row][col].color as string);
      }
    });
    this.tilesToClear?.clear();
  }

  private getDistanceFromPointer = (row: number, column: number): number => {
    const tileCenterX = column * this.scale + this.scale / 2;
    const tileCenterY = row * this.scale + this.scale / 2;
    const distanceX = this.mouseX - tileCenterX;
    const distanceY = this.mouseY - tileCenterY;
    const distance = Math.floor(
      Math.sqrt(distanceX * distanceX + distanceY * distanceY)
    );

    return distance;
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
            Array(TetrominoCanvas.getPieceData().length).keys()
          );
          pieceIndices = shuffle(pieceIndices);

          for (let pieceIndex of pieceIndices) {
            const piece = TetrominoCanvas.getPieceData()[pieceIndex];
            let shapeIndices = Array.from(Array(piece.shapes.length).keys());
            shapeIndices = shuffle(shapeIndices);

            for (let shapeIndex of shapeIndices) {
              const shape = piece.shapes[shapeIndex];
              if (
                this.canAddShape(shape, row, col) &&
                !this.isPieceUsedTooOften(
                  piece.color,
                  row,
                  col,
                  proximity,
                  occurance
                )
              ) {
                this.addShapeToMatrix({ shape, color: piece.color }, row, col);
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
    startSaturation: number,
    startLightness: number
  ): [number, number][] => {
    const radius = this.hoverGlowRadius;
    const gradientMap: [number, number][] = [];

    // The 0th distance will always be (1, 1)
    gradientMap[0] = [1, 1];

    // Use an exponential decay function for saturation and lightness decrease
    const decayRate = 2; // Adjust this rate to control aggressiveness

    for (let i = 1; i <= radius; i++) {
      const decayFactor = i / radius;
      const saturation =
        startSaturation +
        (1 - startSaturation) * Math.exp(-decayRate * decayFactor);
      const lightness =
        startLightness +
        (1 - startLightness) * Math.exp(-decayRate * decayFactor);
      gradientMap[i] = [saturation, lightness];
    }

    return gradientMap;
  };

  private drawGlow = (
    startRow: number = 0,
    startCol: number = 0,
    endRow: number = this.matrix.length - 1,
    endCol: number = this.matrix[0]?.length - 1
  ): void => {
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const cell = this.matrix[row][col];
        if (cell.value === 1) {
          this.drawTileGlow(row, col, cell.color as string);
          this.tilesToClear.add(`${row},${col}`);
        }
      }
    }
  };

  protected drawTileGlow = (
    row: number,
    column: number,
    color: string
  ): void => {
    const distanceFromPointer = this.getDistanceFromPointer(row, column);
    const distanceInTiles = Math.floor(distanceFromPointer / this.scale);

    const glowColor = this.distanceColorMap[distanceInTiles]
      ? mutifyHexColor(
          color,
          this.distanceColorMap[distanceInTiles][0],
          this.distanceColorMap[distanceInTiles][1]
        )
      : mutifyHexColor(color, 0.4, 0.3);

    this.drawTile(row, column, glowColor, 1, 1);

    const tileKey = `${row},${column}`;
    this.tilesToClear.add(tileKey);

    const clearTileWithDelay = () => {
      const distanceFromPointer = this.getDistanceFromPointer(row, column);
      const distanceInTiles = Math.floor(distanceFromPointer / this.scale);
      if (this.tilesToClear.has(tileKey)) {
        if (distanceInTiles > this.hoverGlowRadius) {
          this.clear(row, column, row, column);
          this.drawTile(row, column, color);
          this.tilesToClear.delete(tileKey);
        } else {
          // Retry clearing after the delay
          setTimeout(clearTileWithDelay, this.trailDelay);
        }
      }
    };

    setTimeout(clearTileWithDelay, this.trailDelay);
  };

  protected drawTile = (
    row: number,
    column: number,
    color: string,
    saturation?: number,
    lightness?: number
  ): void => {
    const strokeWidth = Math.floor(this.scale / 6);
    const innerScale = this.scale - strokeWidth - 0.65 * strokeWidth;

    this.ctx.strokeStyle = mutifyHexColor(
      color,
      saturation ?? 0.4,
      lightness ?? 0.3
    );
    this.ctx.lineWidth = strokeWidth;
    this.ctx.strokeRect(
      column * this.scale + strokeWidth / 2,
      row * this.scale + strokeWidth / 2,
      innerScale,
      innerScale
    );
  };

  public setScale = (scale: number) => {
    super.setScale(scale);
    this.rect = this.canvas.getBoundingClientRect();
  };
}
