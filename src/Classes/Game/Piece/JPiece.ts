import Piece, { PieceInterface } from "./Piece";

export default class JPiece extends Piece {
  constructor(position?: PieceInterface["position"]) {
    const id = "J";
    const color = "#0000ff";
    let matrix = [
      [-1, -1],
      [-1, 0],
      [0, 0],
      [1, 0],
    ];
    super({
      id,
      color,
      position,
      matrix,
    });
  }
}