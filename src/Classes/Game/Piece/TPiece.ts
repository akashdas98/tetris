import Piece, { PieceInterface } from "./Piece";

export default class TPiece extends Piece {
  constructor(position?: PieceInterface["position"]) {
    const id = "T";
    const color = "#ff00ff";
    let matrix = [
      [0, -1],
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
