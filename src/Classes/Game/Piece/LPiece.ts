import Piece, { PieceInterface } from "./Piece";

export default class LPiece extends Piece {
  constructor(position?: PieceInterface["position"]) {
    const id = "L";
    const color = "#ff7f00";
    let matrix = [
      [-1, 0],
      [0, 0],
      [1, 0],
      [1, -1],
    ];
    super({
      id,
      color,
      position,
      matrix,
    });
  }
}
