import Piece, { PieceInterface } from "./Piece";

export default class ZPiece extends Piece {
  constructor(position?: PieceInterface["position"]) {
    const id = "Z";
    const color = "#ff0000";
    let matrix = [
      [-1, -1],
      [0, -1],
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
