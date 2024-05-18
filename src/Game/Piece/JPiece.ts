import Piece, { PieceInterface } from "./Piece";

export default class TPiece extends Piece {
  constructor(pivot?: PieceInterface["pivot"]) {
    const id = "J";
    const color = "#0000ff";
    let matrix = [
      [-1, 0],
      [0, 0],
      [1, 0],
      [-1, -1],
    ];
    super({
      id,
      color,
      pivot,
      matrix,
    });
  }
}
