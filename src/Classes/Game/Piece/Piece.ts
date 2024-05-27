import { PieceId, PieceMatrix } from "../../../Types/GameTypes";
import { CanvasMatrix } from "../../TetrominoCanvas/TetrominoCanvas";

export interface PieceInterface {
  matrix: PieceMatrix;
  position?: [number, number];
  id: PieceId;
  color: string;
}

export default abstract class Piece {
  protected matrix: PieceMatrix;
  protected position: [number, number];
  protected id: PieceId;
  protected color: string;
  protected orientation: 0 | 1 | 2 | 3;
  protected kickData: [number, number][][];

  constructor({ matrix, position = [4, 0], id, color }: PieceInterface) {
    this.matrix = matrix;
    this.position = position;
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

  public getId = (): PieceId => `${this.id}`;

  public getMatrix = (): PieceInterface["matrix"] => {
    return [...this.matrix];
  };

  public getPosition = (): [number, number] => {
    return [...this.position];
  };

  public setPosition = (x: number, y: number): void => {
    this.position = [x, y];
  };

  public getColor = (): PieceInterface["color"] => {
    return `${this.color}`;
  };

  public freeRotate = (dir: 1 | 0): void => {
    this.changeOrientation(dir);
    this.matrix = this.rotateMatrix(this.matrix, dir);
  };

  public rotate = (dir: 0 | 1, boardMatrix: CanvasMatrix): void => {
    if (this.id === "O") return;

    let rotated = this.rotateMatrix(this.matrix, dir);

    this.changeOrientation(dir);

    let rotationSuccessful: boolean = false;
    for (const [x, y] of this.kickData[this.orientation]) {
      let kick: boolean = this.checkKick(x, y, rotated, boardMatrix);
      if (kick) {
        this.doKick(x, y, rotated, dir);
        this.matrix = rotated;
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

  private rotateMatrix = (matrix: number[][], dir: 0 | 1) => {
    const rotationMatrix = this.getRotationMatrix(dir);

    return matrix.map((tile) => [
      rotationMatrix[0][0] * tile[0] + rotationMatrix[0][1] * tile[1],
      rotationMatrix[1][0] * tile[0] + rotationMatrix[1][1] * tile[1],
    ]);
  };

  private checkKick(
    x: number,
    y: number,
    rotated: PieceInterface["matrix"],
    boardMatrix: CanvasMatrix
  ): boolean {
    let kick = true;
    for (let i = 0; i < rotated.length; i++) {
      if (
        rotated[i][0] + this.position[0] + x < 0 ||
        rotated[i][0] + this.position[0] + x > 9 ||
        rotated[i][1] + this.position[1] + y < 0 ||
        rotated[i][1] + this.position[1] + y > 19
      ) {
        kick = false;
        break;
      } else if (
        boardMatrix[rotated[i][1] + this.position[1] + y]?.[
          rotated[i][0] + this.position[0] + x
        ]?.value === 1
      ) {
        kick = false;
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
    this.position[0] += x;
    this.position[1] += y;
    this.changeOrientation(dir);
  }

  private changeOrientation(dir: 1 | 0) {
    this.orientation = (
      dir === 1
        ? (((this.orientation + 1) % 4) + 4) % 4
        : (((this.orientation - 1) % 4) + 4) % 4
    ) as typeof this.orientation;
  }
}
