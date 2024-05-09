import { BoardMatrix } from "../Board/Board";
import { matrixMultiply } from "../utils";

export interface PieceInterface {
  matrix: number[][];
  pivot: number[];
  id: "O" | "I" | "S" | "Z" | "J" | "L" | "T";
  color: string;
}

export default abstract class Piece {
  protected matrix: PieceInterface["matrix"];
  protected pivot: PieceInterface["pivot"];
  protected id: PieceInterface["id"];
  protected color: PieceInterface["color"];
  protected orientation: 0 | 1 | 2 | 3;
  protected kickData: [number, number][][];

  constructor({ matrix, pivot, id, color }: PieceInterface) {
    this.matrix = matrix;
    this.pivot = pivot;
    this.id = id;
    this.color = color;
    this.orientation = 0;
    this.kickData = [
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [1, 0],
        [0, -1],
        [0, 2],
        [1, 2],
      ],
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [0, 2],
        [-1, 2],
      ],
    ];
  }

  public setPivot = (x: number, y: number): void => {
    this.pivot = [x, y];
  };

  public getPivot = (): PieceInterface["pivot"] => {
    return this.pivot;
  };

  public getMatrix = (): PieceInterface["matrix"] => {
    return this.matrix;
  };

  public getColor = (): PieceInterface["color"] => {
    return this.color;
  };

  public rotate = (dir: 0 | 1, boardMatrix: BoardMatrix): void => {
    if (this.id === "O") return;
    let rotation = this.getRotationMatrix(dir);

    let rotated = this.matrix.map((tile) => {
      return matrixMultiply(rotation, tile);
    });

    this.changeOrientation(dir);

    let rotationSuccessful: boolean = false;
    for (const [x, y] of this.kickData[this.orientation]) {
      let kick: boolean = this.checkKick(x, y, rotated, boardMatrix);
      if (!kick) {
        this.doKick(x, y, rotated, dir);
        rotationSuccessful = true;
        break;
      }
    }

    if (!rotationSuccessful) {
      this.changeOrientation(dir === 0 ? 1 : 0);
    }
  };

  private getRotationMatrix(dir: 0 | 1): number[][] {
    let rotation;
    if (dir === 0) {
      rotation = [
        [0, 1],
        [-1, 0],
      ];
    } else {
      rotation = [
        [0, -1],
        [1, 0],
      ];
    }

    return rotation;
  }

  private checkKick(
    x: number,
    y: number,
    rotated: PieceInterface["matrix"],
    boardMatrix: BoardMatrix
  ): boolean {
    let kick = false;
    for (let i = 0; i < rotated.length; i++) {
      if (
        rotated[i][0] + this.pivot[0] + x < 0 ||
        rotated[i][0] + this.pivot[0] + x > 9 ||
        rotated[i][1] + this.pivot[1] + y < 0 ||
        rotated[i][1] + this.pivot[1] + y > 19
      ) {
        kick = true;
        break;
      } else if (
        boardMatrix[rotated[i][1] + this.pivot[1] + y]?.[
          rotated[i][0] + this.pivot[0] + x
        ]?.value === 1
      ) {
        kick = true;
        break;
      }
    }
    return kick;
  }

  private doKick(
    x: number,
    y: number,
    rotated: PieceInterface["matrix"],
    dir: 1 | 0
  ) {
    this.matrix = rotated;
    this.pivot[0] += x;
    this.pivot[1] += y;
    this.changeOrientation(dir);
  }

  private changeOrientation(dir: 1 | 0) {
    this.orientation = (
      dir == 1
        ? (((this.orientation + 1) % 4) + 4) % 4
        : (((this.orientation - 1) % 4) + 4) % 4
    ) as typeof this.orientation;
  }
}
