import Piece from "../Piece/Piece";
import TetrominoCanvas from "../../TetrominoCanvas/TetrominoCanvas";

export default class Board extends TetrominoCanvas {
  constructor(canvas: HTMLCanvasElement, scale: number = 30) {
    super(canvas, scale, 20, 10);
  }

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
    }

    return linesToClear.length;
  };

  public maxHeightReached = (): boolean =>
    this.matrix[0].some((cell) => cell.value === 1);

  public addToStack = (piece: Piece) => {
    const position = piece.getPosition();
    const shape = piece.getMatrix();
    const color = piece.getColor();
    this.addShapeToMatrix({ shape, color }, position[1], position[0]);
    this.draw();
  };
}
