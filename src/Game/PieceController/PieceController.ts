import { CanvasMatrix } from "../../Classes/TetrominoCanvas/TetrominoCanvas";
import { shuffle } from "../../utils";
import Board from "../Board/Board";
import IPiece from "../Piece/IPiece";
import JPiece from "../Piece/JPiece";
import LPiece from "../Piece/LPiece";
import OPiece from "../Piece/OPiece";
import Piece from "../Piece/Piece";
import SPiece from "../Piece/SPiece";
import TPiece from "../Piece/TPiece";
import ZPiece from "../Piece/ZPiece";

export default class PieceController {
  private currentPiece: Piece;
  private nextPiece: Piece;
  private bag: Piece[];

  constructor() {
    this.bag = [];
    this.nextPiece = this.generateRandomPiece();
    this.currentPiece = this.nextPiece;
  }

  public spawn = () => {
    this.currentPiece = this.nextPiece;
    this.nextPiece = this.generateRandomPiece();
  };

  public getCurrentPiece = (): Piece => this.currentPiece;

  public rotateCurrentPiece = (dir: 0 | 1, boardMatrix: CanvasMatrix): void => {
    this.currentPiece.rotate(dir, boardMatrix);
  };

  public tryMove = (
    xOffset: number,
    yOffset: number,
    boardMatrix: CanvasMatrix
  ) => {
    const matrix = this.currentPiece.getMatrix();
    const position = this.currentPiece.getPosition();
    let flag = matrix.every((tile) => {
      const newX = tile[0] + position[0] + xOffset;
      const newY = tile[1] + position[1] + yOffset;
      return this.isPositionValid(newX, newY, boardMatrix);
    });

    if (flag) {
      this.currentPiece.setPosition(
        position[0] + xOffset,
        position[1] + yOffset
      );
    }
  };

  public canDrop = (boardMatrix: CanvasMatrix) => {
    const matrix = this.currentPiece.getMatrix();
    const position = this.currentPiece.getPosition();
    return matrix.every((tile) => {
      const newY = tile[1] + position[1] + 1;
      return (
        newY <= 19 && boardMatrix[newY]?.[tile[0] + position[0]]?.value !== 1
      );
    });
  };

  public drop = () => {
    const position = this.currentPiece.getPosition();
    this.currentPiece.setPosition(position[0], position[1] + 1);
  };

  private generateBag = (): Piece[] => {
    const bag: Piece[] = [
      new IPiece(),
      new OPiece(),
      new TPiece(),
      new SPiece(),
      new ZPiece(),
      new JPiece(),
      new LPiece(),
    ];
    return shuffle(bag);
  };

  private generateRandomPiece = (): Piece => {
    if (this.bag.length === 0) {
      this.bag = this.generateBag();
    }
    const nextPiece = this.bag.pop() as Piece;
    return nextPiece;
  };

  private isPositionValid = (
    x: number,
    y: number,
    boardMatrix: CanvasMatrix
  ) => {
    return (
      x >= 0 && x <= 9 && y >= 0 && y <= 19 && boardMatrix[y]?.[x]?.value !== 1
    );
  };
}
