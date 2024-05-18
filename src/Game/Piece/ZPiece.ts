import Piece, { PieceInterface } from "./Piece";

export default class TPiece extends Piece {
  constructor(pivot?: PieceInterface["pivot"]) {
    const id = "Z";
    const color = "#ff0000";
    let matrix = [
      [-1, -1],
      [0, 0],
      [0, -1],
      [1, 0],
    ];
    super({
      id,
      color,
      pivot,
      matrix,
    });
  }
}
