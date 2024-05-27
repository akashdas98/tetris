import Piece, { PieceInterface } from "./Piece";

export default class SPiece extends Piece {
  constructor(position?: PieceInterface["position"]) {
    const id = "S";
    const color = "#00ff00";
    let matrix = [
      [-1, 0],
      [0, 0],
      [0, -1],
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
